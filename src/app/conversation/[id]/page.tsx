import { redirect } from "next/navigation";
import { Chat } from "@/components/Chat";
import {
  getUserId,
  getUserConversations,
  getMessages,
} from "@/lib/supabase/data";

interface Props {
  params: { id: string };
}

export default async function ChatPage({ params }: Props) {
  try {
    const { id } = await params;
    const userId = await getUserId();
    const conversations = await getUserConversations(userId);
    const messages = await getMessages(id);

    return (
      <Chat
        userId={userId}
        fetchedConversations={conversations}
        fetchedMessages={messages}
        selectedConversationId={id}
      />
    );
  } catch (error) {
    console.error("Error:", error);
    redirect("/conversation");
  }
}
