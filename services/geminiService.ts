import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateSharkResponse = async (prompt: string, history: string[] = []): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure your environment.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    // Construct a context-aware prompt
    const systemInstruction = `You are "Shark Brain", the intelligent AI assistant of Blue Shark OS. 
    You are helpful, concise, and occasionally make ocean or shark-related puns. 
    Keep responses relatively short as you are inside a chat window.`;

    const fullPrompt = `
    System: ${systemInstruction}
    History: ${history.join('\n')}
    User: ${prompt}
    Shark Brain:
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: fullPrompt,
    });

    return response.text || "I'm having trouble swimming through the data right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection to the deep sea network failed.";
  }
};