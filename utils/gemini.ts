import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const gemini = {
  /**
   * Generates a new earning task based on a category.
   */
  async generateTask(category: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a creative online earning task for a Pakistani platform in the category: ${category}. 
      The task should be simple enough for a student to do in 5 minutes.
      Return the response in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Short, catchy task title" },
            instruction: { type: Type.STRING, description: "Detailed step-by-step instructions for the user" },
            reward: { type: Type.NUMBER, description: "Suggested reward in PKR (between 20 and 150)" }
          },
          required: ["title", "instruction", "reward"]
        }
      }
    });
    
    return JSON.parse(response.text || "{}");
  },

  /**
   * Provides support chat responses for users.
   */
  async getSupportResponse(userMessage: string, context: { name: string, balance: number, plan: string }) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `You are the Noor Official V3 AI Support Agent. 
        The platform is for online earning in Pakistan. 
        Rules: 
        1. Min withdrawal is Rs. 500. 
        2. Withdrawals take 24 hours. 
        3. Supported gateways are EasyPaisa and JazzCash. 
        4. Users must have an active plan to see daily tasks.
        User Info: Name: ${context.name}, Current Balance: Rs. ${context.balance}, Active Plan: ${context.plan}.
        Be polite, professional, and use a mix of English and simple Roman Urdu if helpful. Keep answers concise.`
      }
    });
    
    return response.text;
  }
};