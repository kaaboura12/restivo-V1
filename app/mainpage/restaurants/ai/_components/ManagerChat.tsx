"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { profileInitials } from "../../../_lib/profile";
import { clockLabel, openThread, replyFor, type ChatMessage } from "../_lib/thread";

export function ManagerChat({
  restaurantName,
  ownerName,
}: {
  restaurantName: string;
  ownerName: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => openThread(restaurantName));
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const time = clockLabel();
    const sent = messages.filter((message) => message.role === "owner").length;
    setMessages((current) => [
      ...current,
      { id: `owner-${current.length}`, role: "owner", text, time },
      { id: `assistant-${current.length}`, role: "assistant", text: replyFor(sent), time },
    ]);
    setDraft("");
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
        <div ref={endRef} />
      </div>

      <form
        className="flex items-center gap-2 border-t border-[#E5DFD3] px-4 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask about tonight"
          className="min-w-0 flex-1 rounded-xl border border-[#E5DFD3] bg-[#FAF7F2] px-3 py-2.5 text-sm text-[#1A1A1A] outline-none placeholder:text-[#A39C91] focus:border-[#B55234]"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Send"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B55234] text-white hover:bg-[#9E4328] disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </section>
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
          className={`inline-block rounded-2xl px-3.5 py-2.5 text-left text-[14px] leading-relaxed ${
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
