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
    model: "gemini-1.5-flash-latest", // or "gemini-1.5-pro-latest" if you prefer
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.8,
    },
  });

  const chat = model.startChat({
    history: history.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    })),
  });

  try {
    const result = await chat.sendMessage(history[history.length - 1].content);
    const response = await result.response;
    const text = response.text();

    return text || "No exact matches in my current data. Want to try a different category?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, something went wrong while processing your request. Please try again.";
  }
};
