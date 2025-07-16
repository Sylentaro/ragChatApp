"use client";

import { useState } from "react";

import ChatWindow from "@/components/MessageWindow";
import Sidebar from "@/components/Sidebar";
import { Tables } from "@/lib/supabase/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ChatPageProps {
  userId: string;
  fetchedConversations: Tables<"conversations">[] | null;
  selectedConversationId: string | null;
  fetchedMessages: Tables<"messages">[] | [];
}

export function Chat(props: ChatPageProps) {
  const {
    userId,
    fetchedConversations,
    fetchedMessages,
    selectedConversationId,
  } = props;

  const [conversations, setConversations] = useState(
    fetchedConversations || []
  );

  const router = useRouter();

  const [blockSidebar, setBlockSidebar] = useState(false);

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
      toast.error("Błąd dodawania konwersacji!");
    } else {
      toast.success("Utworzono konwersację!");
      const newConversation = await response.json();
      //      setConversations((prev) => [...prev, newConversation]);
      router.push(`/conversation/${newConversation.id}`);
    }
  }

  async function handleRenameConversation(id: string, title: string) {
    setBlockSidebar(true);
    const response = await fetch("/api/conversations", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, title }),
    });
    if (!response.ok) {
      toast.error("Błąd aktualizacji konwersacji!");
    } else {
      setConversations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, title } : item))
      );
    }
    toast.success("Zaktualizowano konwersację!");
    setBlockSidebar(false);
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
      toast.error("Błąd usuwania konwersacji!");
    } else {
      toast.success("Usunięto konwersację!");
      if (selectedConversationId === id) {
        router.push("/conversation");
      }
      setConversations((prev) =>
        prev.filter((conversation) => conversation.id !== id)
      );
    }
    setBlockSidebar(false);
  }

  async function handleSwitchConversation(id: string) {
    router.push(`/conversation/${id}`);
  }

  return (
    <div className="flex h-screen">
      <div className="flex flex-col w-1/4 border-r ">
        <Sidebar
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onAddConversation={handleNewConversation}
          onSelectConversation={handleSwitchConversation}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
          disabled={blockSidebar}
        />
      </div>
      <ChatWindow
        conversationId={selectedConversationId}
        fetchedMessages={fetchedMessages}
      />
    </div>
  );
}
