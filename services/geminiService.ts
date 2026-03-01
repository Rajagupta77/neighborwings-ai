import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message } from "../types";

export const getGeminiResponse = async (history: Message[]) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  console.log('Gemini API Key loaded:', apiKey ? 'YES (length: ' + apiKey.length + ')' : 'MISSING');

  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please check VITE_GEMINI_API_KEY in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-3-pro-latest",
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.8,
    },
  });

  // Fix role order: ensure history starts with "user" and alternates
  const safeHistory = history.map((msg, index) => {
    // Force first message to "user" if it's not
    const role = index === 0 ? "user" : (msg.role === "user" ? "user" : "model");
    return {
      role,
      parts: [{ text: msg.content }],
    };
  });

  console.log('Safe history sent to Gemini:', safeHistory);

  const chat = model.startChat({
    history: safeHistory.slice(0, -1), // exclude the last user message (it's sent separately)
  });

  try {
    const lastUserMessage = history[history.length - 1].content;
    const result = await chat.sendMessage(lastUserMessage);
    const response = await result.response;
    const text = response.text();

    return text || "No exact matches in my current data. Want to try a different category?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, something went wrong while processing your request. Please try again.";
  }
};
