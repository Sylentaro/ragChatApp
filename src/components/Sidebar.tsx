"use client";

interface SidebarProps {
  conversations: any[];
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  selectedConversationId: string | null;
  disabled: boolean;
}

export default function Sidebar(props: SidebarProps) {
  const {
    conversations,
    onSelectConversation,
    onDeleteConversation,
    selectedConversationId,
    disabled,
  } = props;
  return (
    <div className="border-r h-screen p-4 overflow-y-auto">
      <h2 className="font-bold mb-4">Twoje rozmowy</h2>
      <ul className="space-y-2">
        {conversations.map((conv) => (
          <div key={conv.id}>
            <li
              onClick={
                !disabled ? () => onSelectConversation(conv.id) : () => {}
              }
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                conv.id === selectedConversationId ? "bg-gray-200" : ""
              }`}
            >
              {conv.title || "Bez tytułu"}
            </li>
            <button
              disabled={disabled}
              onClick={() => {
                onDeleteConversation(conv.id);
              }}
              className="ml-2 text-red-500 cursor-pointer hover:text-red-700"
            >
              DEL
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
}
