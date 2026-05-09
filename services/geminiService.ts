import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message } from "../types";
import { getSupabase } from "../lib/supabaseClient";

// Fetch vendors from Supabase and return as a formatted string for Gemini
const fetchVendorsContext = async (): Promise<string> => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('vendors')
      .select('name, service, price_range, location, description, rating, email, instagram, whatsapp')
      .order('rating', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("Could not fetch vendors from Supabase:", error);
      return "No vendors are currently registered.";
    }

    const vendorList = data.map((v, i) =>
      `Vendor ${i + 1}:
  Name: ${v.name}
  Service: ${v.service || 'General'}
  Price Range: ${v.price_range || 'Contact for pricing'}
  Location: ${v.location || 'Tampa Bay Area'}
  Description: ${v.description || ''}
  Rating: ${v.rating ? v.rating + '/5' : 'N/A'}
  Email: ${v.email || 'N/A'}
  Instagram: ${v.instagram ? '@' + v.instagram : 'N/A'}
  WhatsApp: ${v.whatsapp || 'N/A'}`
    ).join('\n\n');

    return `Here are the REAL registered vendors in the NeighborWings database. ONLY recommend vendors from this list — do not invent any:\n\n${vendorList}`;
  } catch (err) {
    console.error("Vendor fetch error:", err);
    return "Vendor data temporarily unavailable.";
  }
};

export const getGeminiResponse = async (history: Message[]) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

  // Fetch live vendors and build a dynamic system instruction
  const vendorsContext = await fetchVendorsContext();
  const dynamicSystemInstruction = `${SYSTEM_INSTRUCTION}\n\n---\nLIVE VENDOR DATABASE:\n${vendorsContext}`;

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
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: dynamicSystemInstruction,
        temperature: 0.8,
        tools: [{ functionDeclarations: [createBookingRequestDeclaration] }],
      },
    });

    const functionCalls = response.functionCalls;
    if (functionCalls) {
      for (const call of functionCalls) {
        if (call.name === "createBookingRequest") {
          const args = call.args as any;

          const supabase = getSupabase();
          const { error } = await supabase
            .from('booking_requests')
            .insert([{
              ...args,
              status: 'new',
              created_at: new Date().toISOString()
            }]);

          if (error) {
            console.error("Supabase booking error:", error);
          }

          const functionResponse = {
            name: "createBookingRequest",
            response: {
              success: !error,
              message: error ? error.message : "Booking request saved successfully."
            }
          };

          const secondResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              ...contents,
              { role: 'model', parts: [{ functionCall: call }] },
              { role: 'user', parts: [{ functionResponse: functionResponse }] }
            ],
            config: {
              systemInstruction: dynamicSystemInstruction,
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
