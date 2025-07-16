"use client";

import { useEffect, useState } from "react";

interface ChatWindowProps {
  conversationId: string | null;
  fetchedMessages: any[];
}

export default function ChatWindow(props: ChatWindowProps) {
  const { conversationId, fetchedMessages } = props;

  const [messages, setMessages] = useState(fetchedMessages);

  const [input, setInput] = useState("");
  const [inputReady, setInputReady] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (input.trim() === "") return;
    setInputReady(false);

    const resUserMsg = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        content: input,
      }),
    });
    if (!resUserMsg.ok) {
      console.error("Błąd wysyłania wiadomości");
    }
    const newMessage = await resUserMsg.json();
    setMessages((prev) => [...prev, newMessage]);

    const resMatch = await fetch("/api/embeddingMatch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ queryEmbedding: newMessage.embedding }),
    });
    if (!resMatch.ok) {
      console.error("Błąd dopasowania embeddingów");
      setInputReady(true);
      return;
    }
    const context = await resMatch.json();

    // Call API to get AI response
    const resAsk = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: newMessage.content, context }),
    });

    if (!resAsk.ok) {
      console.error("Błąd zapytania do AI");
      setInputReady(true);
      return;
    }

    const { answer } = await resAsk.json();

    // Insert AI response

    const resAiMsg = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        content: answer,
        role: "assistant",
      }),
    });
    if (!resAiMsg.ok) {
      console.error("Błąd zapisu wiadomości AI");
    }
    const newAiMessage = await resAiMsg.json();
    setMessages((prev) => [...prev, newAiMessage]);

    // Reset input
    setInput("");
    setInputReady(true);
  }

  useEffect(() => {
    setMessages(fetchedMessages);
  }, [fetchedMessages]);

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
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-gray-100 p-2 rounded">
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          disabled={!inputReady}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Napisz wiadomość..."
        />
        <button
          disabled={!inputReady}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Wyślij
        </button>
      </form>
    </div>
  );
}
