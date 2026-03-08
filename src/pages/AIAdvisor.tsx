import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickPrompts = [
  "Where should I invest ₹1000?",
  "Best SIP for beginners?",
  "How to diversify my portfolio?",
];

const mockResponses: Record<string, string> = {
  default:
    "Based on your risk profile, I'd recommend splitting your investment:\n\n• **₹500 in Nifty 50 Index Fund** — Low risk, tracks market returns\n• **₹500 in a Flexi-Cap Fund** — Medium risk, higher growth potential\n\nThis gives you diversification while keeping it simple. Start a monthly SIP and stay consistent! 📈",
  sip: "For beginners, I recommend starting with **Nifty 50 Index Fund SIP**. Here's why:\n\n• Very low expense ratio\n• Tracks India's top 50 companies\n• Start with just ₹500/month\n• Historically ~12-14% annual returns\n\nConsistency is key — even small amounts grow significantly over time! 🌱",
  diversify:
    "Great question! Here's a simple diversification strategy:\n\n• **60% Equity** (Index funds + Flexi-cap)\n• **20% Debt** (Short-term debt funds)\n• **10% Gold** (Gold ETF)\n• **10% Cash** (Liquid funds)\n\nThis balances growth with safety. Rebalance every 6 months! ⚖️",
};

const AIAdvisor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI investment advisor 🤖\n\nI can help you make smarter investment decisions. Ask me anything about stocks, mutual funds, or portfolio planning!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let resp = mockResponses.default;
      if (lower.includes("sip") || lower.includes("beginner")) resp = mockResponses.sip;
      if (lower.includes("diversif")) resp = mockResponses.diversify;

      setMessages((prev) => [...prev, { role: "assistant", content: resp }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-5 pb-3 pt-6">
        <div className="flex items-center gap-3">
          <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">AI Advisor</h1>
            <p className="text-xs text-muted-foreground">Powered by StoxMate AI</p>
          </div>
        </div>
      </div>

      {/* Messages */}
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
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground"
              }`}
            >
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
        {isTyping && (
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

      {/* Quick prompts */}
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

      {/* Input */}
      <div className="border-t border-border bg-card p-4 pb-24">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about investing..."
            className="h-11 flex-1 rounded-xl border-border"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
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
