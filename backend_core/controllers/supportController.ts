
import { dbNode } from '../utils/db';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const supportController = {
  aiQuery: async (req: any, res: any) => {
    try {
      const { message, userId } = req.body;
      const user = dbNode.findUserById(userId);
      const config = dbNode.getConfig();

      const systemInstruction = `
        You are the AI Assistant for 'Noor Official V3', a Pakistani online earning platform. 
        Your goal is to help users in Urdu (Roman Urdu) and English.
        Platform Rules:
        - Daily Earning: Rs 240 per task.
        - Minimum Withdrawal: Rs 500 via EasyPaisa/JazzCash.
        - Work Hours: 9 AM to 10 PM.
        - Referral Bonus: Based on plan purchase.
        - Terminology: Earning, Reward, Balance, Team.
        Current User: ${user?.name || 'Guest'}, Balance: Rs ${user?.balance || 0}, Plan: ${user?.currentPlan || 'None'}.
        Be polite and helpful. If you don't know the answer, tell them to wait for an Admin agent.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: message,
        config: { systemInstruction }
      });

      return res.status(200).json({ reply: response.text });
    } catch (err) {
      return res.status(500).json({ reply: "Sorry, AI logic is busy. Please contact Admin directly." });
    }
  },

  getChats: async (req: any, res: any) => {
    const chats = dbNode.getChats();
    if (req.user.role === 'admin') return res.status(200).json(chats);
    const userChat = chats.find((c: any) => c.userId === req.user.id);
    return res.status(200).json(userChat ? [userChat] : []);
  },

  sendMessage: async (req: any, res: any) => {
    const { userId, text, sender } = req.body;
    let chats = dbNode.getChats();
    let chatIndex = chats.findIndex((c: any) => c.userId === userId);

    const newMessage = { 
      id: Date.now(), 
      sender, 
      text, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString()
    };

    if (chatIndex === -1) {
      const user = dbNode.findUserById(userId);
      chats.push({
        userId,
        userName: user?.name || 'Associate',
        avatar: user?.name?.charAt(0) || 'U',
        status: 'active',
        messages: [newMessage],
        lastMsg: text,
        lastTime: newMessage.time
      });
    } else {
      chats[chatIndex].messages.push(newMessage);
      chats[chatIndex].lastMsg = text;
      chats[chatIndex].lastTime = newMessage.time;
      chats[chatIndex].status = 'active';
    }

    dbNode.saveChats(chats);
    return res.status(200).json({ success: true });
  },

  resolveChat: async (req: any, res: any) => {
    const { userId } = req.body;
    let chats = dbNode.getChats();
    const chatIndex = chats.findIndex((c: any) => c.userId === userId);
    if (chatIndex !== -1) {
      chats[chatIndex].status = 'closed';
      dbNode.saveChats(chats);
    }
    return res.status(200).json({ success: true });
  }
};
