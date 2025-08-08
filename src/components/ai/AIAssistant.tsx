import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ask me about any bill and how it affects crime, healthcare, or your daily life. I’ll explain in simple terms." },
  ]);
  const [question, setQuestion] = useState("");

  const ask = () => {
    if (!question.trim()) return;
    const userMsg: Message = { role: "user", content: question.trim() };
    // Mocked response. Replace with your AI backend (via Supabase Edge Function) later.
    const reply: Message = {
      role: "assistant",
      content:
        "In plain language: " +
        question.trim().replace(/\?$/, "") +
        ". For most people, this likely means small day-to-day changes, with specific benefits depending on your profession and location.",
    };
    setMessages((m) => [...m, userMsg, reply]);
    setQuestion("");
  };

  return (
    <Card className="p-4 space-y-4 card-elevated">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-gradient-to-r from-brand to-brand2" aria-hidden />
        <div>
          <p className="text-sm text-muted-foreground">AI Avatar</p>
          <p className="text-sm">Explains bills in plain language</p>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-auto pr-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div className={
              m.role === "user"
                ? "inline-block rounded-lg px-3 py-2 bg-secondary text-secondary-foreground"
                : "inline-block rounded-lg px-3 py-2 bg-accent text-accent-foreground"
            }>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Ask how a bill impacts you (e.g., as a nurse in Madrid)"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          aria-label="Ask the AI avatar"
        />
        <Button onClick={ask} variant="hero">Ask</Button>
      </div>
      <p className="text-xs text-muted-foreground">Note: Connect Supabase + your AI provider to enable real answers, translation, and TTS.</p>
    </Card>
  );
};
