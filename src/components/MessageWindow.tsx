"use client";

import { Tables } from "@/lib/supabase/types";
import { useState } from "react";

interface ChatWindowProps {
  conversationId: string | null;
  fetchedMessages: Tables<"messages">[] | [];
}

export default function MessageWindow(props: ChatWindowProps) {
  const { conversationId, fetchedMessages } = props;

  const [messages, setMessages] = useState(fetchedMessages);
  const [input, setInput] = useState<string>("");
  const [inputReady, setInputReady] = useState<boolean>(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() === "") return;
    setInputReady(false);

    try {
      const resUserMsg = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content: input }),
      });
      if (!resUserMsg.ok) throw new Error("Błąd wysyłania wiadomości");

      const newMessage = await resUserMsg.json();
      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      const resMatch = await fetch("/api/embeddingMatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryEmbedding: newMessage.embedding }),
      });
      if (!resMatch.ok) throw new Error("Błąd dopasowania embeddingów");
      const context = await resMatch.json();

      const resAsk = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage.content, context }),
      });
      if (!resAsk.ok) throw new Error("Błąd zapytania do AI");
      const { answer } = await resAsk.json();

      const resAiMsg = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content: answer,
          role: "assistant",
        }),
      });
      if (!resAiMsg.ok) throw new Error("Błąd zapisu wiadomości AI");
      const newAiMessage = await resAiMsg.json();

      setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setInputReady(true);
    }
  }

  if (!conversationId) {
    return (
      <div className="p-6 w-3/4 h-screen flex flex-col justify-center items-center">
        <p className="text-gray-500 mb-4">
          Wybierz rozmowę lub rozpocznij nową.
        </p>
      </div>
    );
  }

  return (
    <div className="w-3/4 h-screen flex flex-col p-6">
      <div className="flex-1 overflow-y-auto flex flex-col space-y-2">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user"; // lub na przemian: index % 2 === 0
          return (
            <div
              key={msg.id}
              className={`max-w-[75%] p-3 rounded-lg ${
                isUser
                  ? "bg-blue-100 self-end text-right"
                  : "bg-gray-100 self-start text-left"
              }`}
            >
              {msg.content}
            </div>
          );
        })}
        {!inputReady && (
          <div className="text-sm text-gray-500 italic flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-gray-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 000 16v-4l-3.5 3.5L12 24v-4a8 8 0 01-8-8z"
              />
            </svg>
            Oczekiwanie na odpowiedź...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          disabled={!inputReady}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`flex-1 border p-2 rounded transition-all duration-200 ${
            inputReady
              ? "border-gray-300"
              : "border-gray-400 bg-gray-100 text-gray-500 cursor-not-allowed"
          }`}
          placeholder="Napisz wiadomość..."
        />
        <button
          disabled={!inputReady}
          className={`px-4 py-2 rounded transition-all duration-200 ${
            inputReady
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Wyślij
        </button>
      </form>
    </div>
  );
}
