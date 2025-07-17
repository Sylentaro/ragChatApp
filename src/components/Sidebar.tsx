"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import LogoutForm from "./LogoutForm";
import { Tables } from "@/lib/supabase/types";

interface SidebarProps {
  user: {
    id: string;
    email: string | undefined;
  };
  initialConversations: Tables<"conversations">[];
}

export default function Sidebar({ user, initialConversations }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [conversations, setConversations] = useState(initialConversations);
  const [blockSidebar, setBlockSidebar] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState<string>("");

  const selectedConversationId = pathname?.split("/conversation/")[1] || null;

  async function handleNewConversation() {
    setBlockSidebar(true);
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    setBlockSidebar(false);

    if (!response.ok) {
      toast.error("Błąd dodawania konwersacji!");
      return;
    }

    const newConversation = await response.json();
    toast.success("Utworzono konwersację!");
    setConversations((prev) => [...prev, newConversation]);
    router.push(`/conversation/${newConversation.id}`);
  }

  async function handleRenameConversation(id: string, title: string) {
    setBlockSidebar(true);
    const response = await fetch("/api/conversations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title }),
    });
    setBlockSidebar(false);

    if (!response.ok) {
      toast.error("Błąd aktualizacji konwersacji!");
      return;
    }

    setConversations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title } : item))
    );
    toast.success("Zaktualizowano konwersację!");
  }

  async function handleDeleteConversation(id: string) {
    setBlockSidebar(true);
    const response = await fetch("/api/conversations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBlockSidebar(false);

    if (!response.ok) {
      toast.error("Błąd usuwania konwersacji!");
      return;
    }

    toast.success("Usunięto konwersację!");
    if (selectedConversationId === id) {
      router.push("/conversation");
    }
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
  }

  function handleSwitchConversation(id: string) {
    router.push(`/conversation/${id}`);
  }

  function handleRename(id: string, newTitle: string) {
    const trimmed = newTitle.trim();
    const original =
      conversations.find((conv) => conv.id === id)?.title?.trim() || "";
    if (trimmed.length === 0 || trimmed === original) {
      setEditingId(null);
      setTempTitle("");
      return;
    }
    handleRenameConversation(id, trimmed);
    setEditingId(null);
    setTempTitle("");
  }

  return (
    <div className="h-screen bg-white flex flex-col border-r border-gray-200 shadow-sm max-w-xs w-full">
      <LogoutForm />
      <span className="text-xs text-gray-500 px-4">{user.email}</span>
      <div className="p-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <h2 className="font-bold text-lg mb-4">Twoje rozmowy</h2>
        <ul className="space-y-2">
          {conversations.map((conv) => (
            <li
              key={conv.id}
              className={`flex items-center group rounded transition p-2 ${
                conv.id === selectedConversationId ? "bg-gray-200" : ""
              }`}
            >
              <div
                className={`flex-1 cursor-pointer rounded px-2 py-1 ${
                  editingId !== conv.id &&
                  !blockSidebar &&
                  conv.id !== selectedConversationId
                    ? "hover:bg-gray-100"
                    : ""
                }`}
                onClick={
                  !blockSidebar && editingId !== conv.id
                    ? () => handleSwitchConversation(conv.id)
                    : undefined
                }
              >
                {editingId === conv.id ? (
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={() => handleRename(conv.id, tempTitle)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRename(conv.id, tempTitle);
                      }
                    }}
                    autoFocus
                    className="w-full px-2 py-1 border rounded"
                  />
                ) : (
                  <span className="truncate">{conv.title || "Bez tytułu"}</span>
                )}
              </div>

              <div
                className={`flex items-center space-x-2 ml-2 transition ${
                  conv.id === selectedConversationId
                    ? "opacity-100"
                    : "opacity-70 group-hover:opacity-100"
                } `}
              >
                <button
                  disabled={blockSidebar}
                  onClick={() => {
                    setEditingId(conv.id);
                    setTempTitle(conv.title || "");
                  }}
                  className={`p-1 rounded hover:bg-gray-200 ${
                    blockSidebar
                      ? "cursor-not-allowed text-gray-400"
                      : "text-blue-600"
                  }`}
                >
                  <Pencil size={16} />
                </button>

                <button
                  disabled={blockSidebar}
                  onClick={() => handleDeleteConversation(conv.id)}
                  className={`p-1 rounded hover:bg-gray-200 ${
                    blockSidebar
                      ? "cursor-not-allowed text-gray-400"
                      : "text-red-600"
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4">
        <button
          onClick={handleNewConversation}
          disabled={blockSidebar}
          className={`w-full py-2 px-4 rounded text-white transition-all ${
            blockSidebar
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          + Nowa rozmowa
        </button>
      </div>
    </div>
  );
}
