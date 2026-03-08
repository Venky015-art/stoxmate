import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Bot, User, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const quickPrompts = [
  "Where should I invest ₹1000?",
  "Best SIP for beginners?",
  "How to diversify my portfolio?",
  "Explain mutual funds simply",
];

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    if (resp.status === 429) { onError("Too many requests. Please wait a moment."); return; }
    if (resp.status === 402) { onError("AI usage limit reached."); return; }
    onError("AI service unavailable. Please try again.");
    return;
  }

  if (!resp.body) { onError("No response received."); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { streamDone = true; break; }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

const AIAdvisor = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI investment advisor 🤖\n\nI can help you make smarter investment decisions. Ask me anything about stocks, mutual funds, or portfolio planning!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > newMessages.length) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev.slice(0, newMessages.length), { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: newMessages,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsTyping(false),
        onError: (msg) => {
          toast.error(msg);
          setIsTyping(false);
        },
      });
    } catch {
      toast.error("Failed to connect to AI. Please try again.");
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="border-b border-border bg-card px-5 pb-3 pt-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-xl bg-secondary p-2">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">AI Advisor</h1>
            <p className="text-xs text-muted-foreground">Powered by StoxMate AI</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
              msg.role === "assistant" ? "bg-accent/10" : "bg-primary/10"
            }`}>
              {msg.role === "assistant" ? (
                <Bot className="h-4 w-4 text-accent" />
              ) : (
                <User className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground"
            }`}>
              {msg.content.split("\n").map((line, j) => (
                <p key={j} className={j > 0 ? "mt-1" : ""}>
                  {line.split(/(\*\*.*?\*\*)/).map((part, k) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={k}>{part.slice(2, -2)}</strong>
                    ) : (
                      part
                    )
                  )}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
        {isTyping && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
              <Bot className="h-4 w-4 text-accent" />
            </div>
            <div className="flex gap-1 rounded-2xl border border-border bg-card px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="flex gap-2 overflow-x-auto px-5 pb-3">
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="whitespace-nowrap rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-border bg-card p-4 pb-8">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about investing..."
            className="h-11 flex-1 rounded-xl border-border"
            disabled={isTyping}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
