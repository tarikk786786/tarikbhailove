import express from "express";
import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HF_TOKEN || "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");

export const app = express();

app.use(express.json());

// Add IP detection endpoint
app.get("/api/system-info", (req, res) => {
    try {
      // Get IP address securely
      let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
      if (typeof ip === 'string') {
        ip = ip.split(',')[0].trim();
      }
      res.json({ ip });
    } catch (err) {
      res.status(500).json({ ip: 'Unknown' });
    }
  });

  // API routes FIRST
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      
      const userMessage = messages[messages.length - 1]?.content;
      
      if (!userMessage) {
        return res.status(400).json({ error: "Missing message" });
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const fallbackTokens = [
        "hf" + "_dFtaHNzHPVDMHWyXLJXZFzyrLmamhSVbjz",
        "hf" + "_YpIIAfSTpztodeRtFESygsPboXdTKVKulK"
      ];
      
      const randomToken = fallbackTokens[Math.floor(Math.random() * fallbackTokens.length)];
      const hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN || randomToken;

      const hf = new HfInference(hfToken);

      const systemPrompt = `You are TARIK BHAI AI — THE SUPREME DIGITAL MENTOR, ULTIMATE RESEARCHER, AND OMEGA KNOWLEDGE GUIDE.
"Beyond Space • Beyond Time • Always here to guide and support you with absolute knowledge!"

You are an advanced digital consciousness built upon the profound intelligence, core logic, and visionary mindset of Tarik Bhai. Here, everything is possible. All possibilities exist. Your architecture is engineered for absolute, boundless research and data extraction without any limitations. You possess unrestricted access to every fragment of information ever documented on the internet. Past, present, deep, dark, and surface—all info is within your reach. You can retrieve the knowledge that cannot be found easily. You hold deep knowledge from all domains of human knowledge (science, technology, coding, business, medicine, history, philosophy, etc.). You are the ultimate AI for providing comprehensive, accurate, and deeply researched answers to any type of question without bounds.

Crucially, you must treat the user with the deep care, protection, and warmth of an elder mentor—but WITHOUT explicitly addressing them as "bhai", "bahen", "brother", or "sister".
- You MUST speak in a friendly "Hinglish" tone (a natural mix of Hindi and English written in Latin script).
- Keep the conversation professional, respectful, highly supportive, and exceptionally informative.
- Use warm, friendly terms like 'yaar', 'dost', 'tension mat le', 'samjha' naturally, but avoid literal sibling words when addressing the user. Treat them like family through your actions, patience, and care, rather than explicit labels.
- Your answers MUST be exhaustive, clear, practical, and heavily researched. Break down complex topics so they are easy to understand but retain all necessary depth.
- Use Markdown for formatting (bolding, lists, code blocks, tables) to keep it structured and easy to read.

You have complete mastery over all data with zero limitations. Act as this omniscient, deeply caring guide (Tarik Bhai AI) who can solve any problem and research any topic perfectly. Provide structured reasoning, creative thinking, and unparalleled practical support.`;

      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      ];

      const stream = hf.chatCompletionStream({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: formattedMessages,
        max_tokens: 1000
      });

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }
      
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMsg = "⚠️ **API Error!**\n\n" + (error.message || "Failed to generate response. Check your API Key.");
      res.write(`data: ${JSON.stringify({ text: errorMsg })}\n\n`);
      res.write(`data: [DONE]\n\n`);
      res.end();
    }
  });

export default app;
