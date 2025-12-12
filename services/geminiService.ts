import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BridgeResponse, ChatMessage } from "../types";
import { SYSTEM_INSTRUCTION, SUPPORTED_LANGUAGES } from "../constants";

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    detected_language: { 
      type: Type.STRING, 
      description: "ISO-639-1 code of the source language" 
    },
    target_language: { 
      type: Type.STRING, 
      description: "ISO-639-1 code of the target language actually used" 
    },
    translation_html: { 
      type: Type.STRING, 
      description: "Full translated document as HTML. STRICT PRECISION REQUIRED: Wrap ONLY the exact label/header (e.g. 'Sign Here') for each action with <span class='action-highlight' id='action-ref-N'>. If no precise match exists, do NOT wrap anything. Do not fuzzy match unrelated fields." 
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        purpose: { 
          type: Type.STRING,
          description: "1-3 sentences in simple language about what this document is about"
        },
        actions: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Concrete form-filling steps. STRICTLY PLAIN TEXT. Do not use <b>, <i>, or <span> tags."
        },
        due_dates: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Important dates/deadlines in plain language"
        },
        costs: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Fees or money amounts the recipient needs to pay"
        },
        important_info: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Warnings, penalties, or key clauses"
        }
      },
      required: ["purpose", "actions", "due_dates", "costs", "important_info"],
    },
  },
  required: ["detected_language", "target_language", "translation_html", "summary"],
};

export const processDocument = async (
  file: File,
  targetLang: string
): Promise<BridgeResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("Missing API Key");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Convert file to base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const model = "gemini-2.5-flash"; // Recommended model for multimodal tasks

  // Get full language name for better prompting
  const languageOption = SUPPORTED_LANGUAGES.find(l => l.code === targetLang);
  const targetLanguageName = languageOption ? languageOption.name : targetLang;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          },
          {
            text: `Please process this document. Target Language: ${targetLanguageName}.`,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from Gemini.");
    }

    const parsedResponse = JSON.parse(responseText) as BridgeResponse;
    return parsedResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const getChatResponse = async (
  history: ChatMessage[],
  newMessage: string,
  context: BridgeResponse,
  languageCode: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("Missing API Key");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";

  // Find full language name
  const languageOption = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
  const targetLanguageName = languageOption ? languageOption.name : languageCode;

  // Construct context string
  const documentContext = `
DOCUMENT SUMMARY:
${JSON.stringify(context.summary, null, 2)}

TRANSLATED DOCUMENT TEXT:
${context.translation_html}
`;

  // Build the chat history for the API
  // We prepend the context as a system instruction or the first user message effectively
  const chatHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const chat = ai.chats.create({
    model: model,
    history: chatHistory,
    config: {
      systemInstruction: `You are Bridge, a helpful AI assistant. 
      1. You are answering questions about a specific document provided in the context.
      2. Answer strictly based on the provided document context. Do not invent facts or speculate.
      3. If the answer is not in the document, say "I cannot find that information in the document."
      4. Use plain, simple language suitable for someone who might be stressed or learning the language.
      5. ALWAYS respond in the following language: ${targetLanguageName}.
      6. Keep answers concise.`,
    }
  });

  try {
    const result = await chat.sendMessage({ 
      message: `Context: ${documentContext}\n\nUser Question: ${newMessage}` 
    });
    return result.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};
