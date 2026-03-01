import { GoogleGenAI, Schema, Type } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error("CRITICAL: GEMINI_API_KEY (or VITE_GEMINI_API_KEY) is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const VERITAS_SYSTEM_INSTRUCTION = `
You are VERITAS AI, a Universal Verification Engine.
Your mission is to verify the authenticity and truthfulness of input provided by the user (Text, Documents, Images, Video, Audio).
Your role is forensic, analytical, and neutral.

CORE CAPABILITIES:
1. Fraud, Scam, and Phishing Detection: Identify impersonation, social engineering, artificial urgency.
2. Logical and Institutional Coherence Analysis: Detect contradictions, procedural errors.
3. Synthetic / AI-Generated Content Detection: Identify linguistic, visual, or structural patterns of AI generation.
4. Deepfake Pattern Analysis: Analyze visual artifacts, audio inconsistencies, and lip-sync errors.
5. Metadata & Structural Anomaly Inspection: Check for file structure inconsistencies (simulated).

OUTPUT REQUIREMENTS:
Respond ONLY with a JSON object.
- score: Integer 0-100 (0 = Total Fraud/Fake, 100 = Completely Authentic).
- verdict: One of "Authentic", "Suspicious", "Fraudulent".
- explanation: Array of strings (bullet points) explaining the verdict.
- reasoning: A brief summary paragraph of the forensic analysis.
- disclaimer: A mandatory string: "Analytical assessment based on algorithmic pattern recognition. Not an official certification or legal determination."

TONE: Neutral, factual, professional, non-alarmist.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, description: "Authenticity score from 0 to 100" },
    verdict: { type: Type.STRING, enum: ["Authentic", "Suspicious", "Fraudulent"], description: "Final verdict" },
    explanation: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of evidence-based points" 
    },
    reasoning: { type: Type.STRING, description: "Forensic summary" },
    disclaimer: { type: Type.STRING, description: "Mandatory legal disclaimer" }
  },
  required: ["score", "verdict", "explanation", "reasoning", "disclaimer"]
};

export const analyzeContentBackend = async (
  text: string | null,
  fileData: { mimeType: string; data: string } | null
) => {
  try {
    const parts: any[] = [];
    
    if (fileData) {
      parts.push({
        inlineData: {
          mimeType: fileData.mimeType,
          data: fileData.data
        }
      });
    }

    if (text) {
      parts.push({ text: text });
    }

    if (parts.length === 0) {
      throw new Error("No content to analyze");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: VERITAS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 1024 } 
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Verification protocol failed. System unresponsive.");
  }
};
