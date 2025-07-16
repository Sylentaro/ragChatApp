"use client";

import { Tables } from "@/lib/supabase/types";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react"; // ikony edycji i usuwania

interface SidebarProps {
  conversations: Tables<"conversations">[];
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onAddConversation: () => void;
  selectedConversationId: string | null;
  disabled: boolean;
}

export default function Sidebar(props: SidebarProps) {
  const {
    conversations,
    onAddConversation,
    onSelectConversation,
    onDeleteConversation,
    onRenameConversation,
    selectedConversationId,
    disabled,
  } = props;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState<string>("");

  function handleRename(id: string, newTitle: string) {
    const trimmed = newTitle.trim();

    const original =
      conversations.find((conv) => conv.id === id)?.title?.trim() || "";

    if (trimmed.length === 0 || trimmed === original) {
      // Nic nie zmieniono lub pusty tekst — kończymy edycję
      setEditingId(null);
      setTempTitle("");
      return;
    }

    onRenameConversation(id, trimmed);
    setEditingId(null);
    setTempTitle("");
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="p-4 overflow-y-auto flex-1 scrollbar-hide">
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
                  !disabled &&
                  conv.id !== selectedConversationId
                    ? "hover:bg-gray-100"
                    : ""
                }`}
                onClick={
                  !disabled && editingId !== conv.id
                    ? () => onSelectConversation(conv.id)
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
                  disabled={disabled}
                  onClick={() => {
                    setEditingId(conv.id);
                    setTempTitle(conv.title || "");
                  }}
                  className={`p-1 rounded hover:bg-gray-200 ${
                    disabled
                      ? "cursor-not-allowed text-gray-400"
                      : "text-blue-600"
                  }`}
                >
                  <Pencil size={16} />
                </button>

                <button
                  disabled={disabled}
                  onClick={() => onDeleteConversation(conv.id)}
                  className={`p-1 rounded hover:bg-gray-200 ${
                    disabled
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
          onClick={onAddConversation}
          disabled={disabled}
          className={`w-full py-2 px-4 rounded text-white transition-all ${
            disabled
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
