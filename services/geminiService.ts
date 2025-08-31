import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: 'You are a helpful and creative assistant. Be concise and friendly in your responses.'
    },
  });
};

// FIX: `GenerateContentStreamResult` is not an exported member of `@google/genai`.
// The return type for a streaming method is a Promise resolving to an async iterable of `GenerateContentResponse`.
export const streamChatMessage = (chat: Chat, message: string): Promise<AsyncIterable<GenerateContentResponse>> => {
  return chat.sendMessageStream({ message });
};

export const generateImages = async (prompt: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 4,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
    } catch (error) {
        console.error("Error generating images:", error);
        throw new Error("Failed to generate images. Please try again.");
    }
};

export const summarizeText = async (text: string): Promise<string> => {
    try {
        const prompt = `Please provide a concise summary of the following text:\n\n---\n\n${text}\n\n---\n\nSummary:`;
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.3,
                topP: 0.95,
                topK: 64,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing text:", error);
        throw new Error("Failed to summarize the text. Please try again.");
    }
};
