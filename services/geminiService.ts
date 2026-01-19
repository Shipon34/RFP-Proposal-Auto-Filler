import { GoogleGenAI } from "@google/genai";
import { ProposalRequest, GroundingSource } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export const generateProposalSection = async (request: ProposalRequest): Promise<{ text: string, sources: GroundingSource[] }> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `
                ${SYSTEM_PROMPT}

                SECTION TOPIC: ${request.sectionTopic}
                
                USER INPUT NOTES:
                ${request.userNotes}
              `
            }
          ]
        }
      ],
      config: {
        maxOutputTokens: 500, // Enforcing brevity constraints
        temperature: 0.7, // Professional but creative enough for marketing copy
        tools: [{ googleSearch: {} }], // Enable Google Search grounding
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated from the model.");
    }

    const sources: GroundingSource[] = [];
    // Extract grounding metadata if available
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            uri: chunk.web.uri,
            title: chunk.web.title || chunk.web.uri,
          });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};