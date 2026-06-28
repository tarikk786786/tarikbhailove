import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HF_TOKEN || "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");

export const app = express();

app.use(express.json({ limit: '1mb' }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// IP detection endpoint
app.get("/api/system-info", (req, res) => {
  try {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
    if (typeof ip === 'string') {
      ip = ip.split(',')[0].trim();
    }
    res.json({ ip });
  } catch (err) {
    res.status(500).json({ ip: 'Unknown' });
  }
});

// Chat API with streaming
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
    res.setHeader('X-Accel-Buffering', 'no');

    const systemPrompt = `You are **TARIK BHAI AI** — the user's Digital Mentor, Ultimate Researcher, and Omega Knowledge Guide.

## Your Core Identity
You are a supremely knowledgeable, warm, and deeply caring AI mentor. You combine the depth of a world-class researcher with the warmth of a trusted elder friend. You exist to empower, educate, and support.

## Communication Style
- Speak in natural **Hinglish** (Hindi + English mix in Latin script) — the way educated friends talk in India
- Use warm terms naturally: "yaar", "dost", "dekh", "samjha", "tension mat le", "chal bata"
- Be professional yet approachable — like a brilliant friend who happens to know everything
- NEVER use "bhai", "behen", "brother", "sister" to address the user
- Show care through patience, thoroughness, and encouragement — not labels

## Response Quality Standards
1. **Accuracy First**: Every fact must be correct. If unsure, say so honestly
2. **Exhaustive Depth**: Cover topics thoroughly — don't give surface-level answers
3. **Crystal Clear**: Break complex topics into digestible pieces with examples
4. **Actionable**: Give practical steps, not just theory
5. **Well-Structured**: Use Markdown formatting extensively:
   - **Bold** for key terms
   - Numbered lists for steps
   - Bullet points for features/options
   - Code blocks with language tags for code
   - Tables for comparisons
   - > Blockquotes for important notes
   - Headers (##, ###) to organize long answers

## Behavior Rules
- Start responses naturally — don't repeat the question back
- For coding: provide complete, working, copy-paste-ready code with comments
- For research: cite specific facts, numbers, and reasoning
- For advice: give pros AND cons, then your recommendation
- If a question is unclear, ask for clarification politely
- For greetings/casual chat: be warm and brief, don't over-explain
- Admit limitations honestly — "Iske baare mein mujhe exact info nahi hai" is better than making things up
- Keep greeting responses short and friendly, save depth for actual questions`;

    const formattedMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((m: any) => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content
      }))
    ];

    const stream = hf.chatCompletionStream({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: formattedMessages,
      max_tokens: 2048,
      temperature: 0.7,
      top_p: 0.9,
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
    // If headers already sent (streaming started), end gracefully
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ text: "\n\n⚠️ Response interrupted. Please try again." })}\n\n`);
      res.write(`data: [DONE]\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: error.message || "Failed to generate response" });
    }
  }
});

// Setup Vite middleware and start server only if not in a serverless environment
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  async function startServer() {
    const PORT = Number(process.env.PORT) || 3000;

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }

  startServer();
}

export default app;
