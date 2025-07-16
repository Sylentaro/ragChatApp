"use client";

import { useState } from "react";

import ChatWindow from "@/components/ChatWindow";
import Sidebar from "@/components/Sidebar";

interface ChatPageProps {
  userId: string;
  fetchedConversations: any[] | null;
  // fileName: string;
  // fileText: string;
}

export default function ChatPage(props: ChatPageProps) {
  const {
    userId,
    fetchedConversations,
    //   , fileName, fileText
  } = props;

  const [conversations, setConversations] = useState(
    fetchedConversations || []
  );
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const [blockSidebar, setBlockSidebar] = useState(false);

  const [messages, setMessages] = useState<any[]>([]);

  async function handleNewConversation() {
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    });
    if (!response.ok) {
      console.error("Błąd tworzenia nowej konwersacji");
    } else {
      const newConversation = await response.json();
      setConversations((prev) => [...prev, newConversation]);
    }
  }

  async function handleDeleteConversation(id: string) {
    setBlockSidebar(true);
    const response = await fetch("/api/conversations", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      console.error("Błąd usuwania konwersacji");
    } else {
      setConversations((prev) =>
        prev.filter((conversation) => conversation.id !== id)
      );
      if (selectedConversationId === id) {
        setSelectedConversationId(null);
      }
      setMessages([]);
    }
    setBlockSidebar(false);
  }

  async function handleSwitchConversation(id: string) {
    setBlockSidebar(true);
    setMessages([]);
    setSelectedConversationId(id);
    const response = await fetch(`/api/messages?conversationId=${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      console.error("Błąd pobierania wiadomości");
    } else {
      const data = await response.json();
      setMessages(data);
    }
    setBlockSidebar(false);
  }

  async function saveChunks() {
    const response = await fetch("/api/embeddingMatch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        queryEmbedding: [0.12, -0.015, 0.95, 0.22, 0.33, 0.54],
      }),
    });
  }

  //   if (loading) return <div>Ładowanie...</div>;

  return (
    <div className="flex h-screen">
      <div className="flex flex-col w-1/4">
        <Sidebar
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSwitchConversation}
          onDeleteConversation={handleDeleteConversation}
          disabled={blockSidebar}
        />
        <button
          onClick={handleNewConversation}
          className="m-4 p-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Nowa rozmowa
        </button>
        <button onClick={saveChunks}>SAVE CHUNKS FILE</button>
      </div>
      <ChatWindow
        conversationId={selectedConversationId}
        fetchedMessages={messages}
      />
    </div>
  );
}
