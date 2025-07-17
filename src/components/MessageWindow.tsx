"use client";

import { Tables } from "@/lib/supabase/types";
import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface ChatWindowProps {
  conversationId: string | null;
  fetchedMessages: Tables<"messages">[] | [];
}

export default function MessageWindow(props: ChatWindowProps) {
  const { conversationId, fetchedMessages } = props;

  const [messages, setMessages] = useState(fetchedMessages);
  const [input, setInput] = useState<string>("");
  const [inputReady, setInputReady] = useState<boolean>(true);

  async function handleSubmit() {
    if (input.trim() === "") return;
    setInputReady(false);
    const dummyMessage = {
      id: crypto.randomUUID(),
      content: input,
      role: "user",
      created_at: new Date().toISOString(),
      conversation_id: conversationId,
      embedding: null,
    };
    setMessages((prev) => [...prev, dummyMessage]);
    try {
      const resUserMsg = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content: input }),
      });
      if (!resUserMsg.ok) {
        setMessages((prev) =>
          prev.filter((item) => item.id !== dummyMessage.id)
        );
        throw new Error("Błąd wysyłania wiadomości");
      }
      const newMessage = await resUserMsg.json();
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
      toast.error(
        "Wystąpił błąd: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setInputReady(true);
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="flex flex-col w-full max-w-4xl h-full rounded-xl shadow-lg bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto flex flex-col h-full px-8 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 select-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 8h10M7 12h4m-7 8h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="mt-2 text-lg font-medium">
                Brak wiadomości w tej rozmowie.
              </span>
              <span className="text-sm text-gray-300">
                Napisz pierwszą wiadomość, aby rozpocząć rozmowę!
              </span>
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`w-fit min-w-[64px] max-w-[70%] px-5 py-3 rounded-3xl shadow-sm mb-2 text-base break-words
                      ${
                        isUser
                          ? "bg-blue-500 text-white ml-auto rounded-tr-3xl rounded-bl-3xl"
                          : "bg-white border border-gray-200 text-gray-800 self-start rounded-tl-3xl rounded-br-3xl text-left"
                      }`}
                  >
                    {msg.content}
                  </div>
                );
              })}
              {!inputReady && (
                <div className="text-sm text-gray-500 italic flex items-center gap-2 mt-4">
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
            </>
          )}
        </div>
        <form
          className="flex items-center gap-2 p-4 bg-white/80 backdrop-blur shadow-inner"
          onSubmit={(e) => {
            e.preventDefault();
            if (inputReady) handleSubmit();
          }}
        >
          <input
            disabled={!inputReady}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (inputReady) handleSubmit();
              }
            }}
            className={`flex-1 px-4 py-2 rounded-full border-none bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-400 transition text-base max-w-full w-full ${
              inputReady ? "" : "bg-gray-100 text-gray-500 cursor-not-allowed"
            }`}
            placeholder="Napisz wiadomość..."
            maxLength={500}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!inputReady}
            className={`p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow transition flex items-center justify-center ${
              inputReady ? "" : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            aria-label="Wyślij"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
