"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiAskManager } from "@/lib/ai/client";
import { profileInitials } from "../../../_lib/profile";
import { clockLabel, welcomeMessage, type ChatMessage } from "../_lib/thread";

export function ManagerChat({
  restaurantId,
  restaurantName,
  ownerName,
}: {
  restaurantId: string;
  restaurantName: string;
  ownerName: string;
}) {
  const { getAccessToken } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [welcomeMessage(restaurantName)]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, sending]);

  const send = async () => {
    const text = draft.trim();
    const token = getAccessToken();
    if (!text || sending || !token) return;

    const mine: ChatMessage = { id: `owner-${messages.length}`, role: "owner", text, time: clockLabel() };
    const history = [...messages.filter((message) => message.id !== "welcome"), mine];
    setMessages((current) => [...current, mine]);
    setDraft("");
    setError(null);
    setSending(true);

    try {
      const reply = await apiAskManager(
        token,
        restaurantId,
        history.map((message) => ({
          role: message.role === "owner" ? "user" : "assistant",
          content: message.text,
        }))
      );
      setMessages((current) => [
        ...current,
        { id: `assistant-${current.length}`, role: "assistant", text: reply, time: clockLabel() },
      ]);
    } catch (err) {
      setMessages((current) => current.filter((message) => message.id !== mine.id));
      setDraft(text);
      setError(err instanceof Error ? err.message : "The assistant could not answer.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[#E5DFD3] bg-white shadow-sm">
      <header className="border-b border-[#E5DFD3] px-5 py-4">
        <h1 className="text-[15px] font-semibold text-[#1A1A1A]">AI Manager</h1>
        <p className="text-[13px] text-[#8C877D]">Service notes for {restaurantName}</p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-[#F7F4EE] px-4 py-5 sm:px-5">
        {messages.map((message) => (
          <Message key={message.id} message={message} ownerName={ownerName} />
        ))}
        {sending ? <Pending /> : null}
        <div ref={endRef} />
      </div>

      <form
        className="border-t border-[#E5DFD3] px-4 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        {error ? <p className="mb-2 text-[13px] font-medium text-[#B55234]">{error}</p> : null}
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about tonight"
            disabled={sending}
            className="min-w-0 flex-1 rounded-xl border border-[#E5DFD3] bg-[#FAF7F2] px-3 py-2.5 text-sm text-[#1A1A1A] outline-none placeholder:text-[#A39C91] focus:border-[#B55234] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            aria-label="Send"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B55234] text-white hover:bg-[#9E4328] disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  );
}

function Pending() {
  return (
    <div className="flex items-end gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#6B665E]">
        AI
      </span>
      <p className="rounded-2xl border border-[#E5DFD3] bg-white px-3.5 py-2.5 text-[14px] text-[#8C877D]">
        Writing…
      </p>
    </div>
  );
}

function Message({ message, ownerName }: { message: ChatMessage; ownerName: string }) {
  const mine = message.role === "owner";

  return (
    <div className={`flex items-end gap-2.5 ${mine ? "flex-row-reverse" : ""}`}>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
          mine ? "bg-[#FAF0EA] text-[#B55234]" : "bg-white text-[#6B665E]"
        }`}
      >
        {mine ? profileInitials(null, null, ownerName) : "AI"}
      </span>
      <div className={`max-w-[36rem] ${mine ? "text-right" : ""}`}>
        <p
          className={`inline-block rounded-2xl px-3.5 py-2.5 text-left text-[14px] leading-relaxed whitespace-pre-wrap ${
            mine ? "bg-[#B55234] text-white" : "border border-[#E5DFD3] bg-white text-[#1A1A1A]"
          }`}
        >
          {message.text}
        </p>
        <p className="mt-1 text-[11px] text-[#A39C91]">{message.time}</p>
      </div>
    </div>
  );
}
