
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message } from "../types";
import { getSupabase } from "../lib/supabaseClient";

export const getGeminiResponse = async (history: Message[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const createBookingRequestDeclaration = {
    name: "createBookingRequest",
    parameters: {
      type: Type.OBJECT,
      description: "Saves a new booking request to the database.",
      properties: {
        vendor_name: { type: Type.STRING },
        vendor_email: { type: Type.STRING },
        customer_name: { type: Type.STRING },
        customer_email: { type: Type.STRING },
        event_date: { type: Type.STRING },
        requirements: { type: Type.STRING },
      },
      required: ["vendor_name", "customer_name", "customer_email", "event_date", "requirements"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        tools: [{ functionDeclarations: [createBookingRequestDeclaration] }],
      },
    });

    const functionCalls = response.functionCalls;
    if (functionCalls) {
      for (const call of functionCalls) {
        if (call.name === "createBookingRequest") {
          const args = call.args as any;
          
          // Execute Supabase Insert
          const supabase = getSupabase();
          const { error } = await supabase
            .from('booking_requests')
            .insert([{
              ...args,
              status: 'new',
              created_at: new Date().toISOString()
            }]);

          if (error) {
            console.error("Supabase Error:", error);
            // We could return a special message or continue
          }

          // We need to tell the model the result or just return a controlled message
          // For simplicity and matching user request "Show this message: Thank you, [Name]!..."
          // We can just construct it here or let the model respond in a second turn.
          // The user specifically gave a template, so let's try to get the model to use it
          // OR we can just return it directly if we want to bypass model's next turn for speed.
          // But to be "AI-like", we should give the result back to model.
          
          const functionResponse = { 
            name: "createBookingRequest", 
            response: { success: !error, message: error ? error.message : "Booking request saved successfully." } 
          };

          // Second turn
          const secondResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
              ...contents,
              { role: 'model', parts: [{ functionCall: call }] },
              { role: 'user', parts: [{ functionResponse: functionResponse }] }
            ],
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
            }
          });
          
          return secondResponse.text || "Booking request processed.";
        }
      }
    }

    return response.text || "No exact matches in my current data. Want to try a different category?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! I hit a snag. Could you try asking that again?";
  }
};
