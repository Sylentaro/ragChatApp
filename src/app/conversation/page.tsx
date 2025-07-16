import { Chat } from "@/components/Chat";
import { getUserId, getUserConversations } from "@/lib/supabase/data";

export default async function EmptyChatPage() {
  try {
    const userId = await getUserId();
    const conversations = await getUserConversations(userId);

    return (
      <Chat
        userId={userId}
        fetchedConversations={conversations}
        fetchedMessages={[]}
        selectedConversationId={null}
      />
    );
  } catch (error) {
    console.error("Error:", error);
    return <>Wystąpił błąd podczas ładowania strony</>;
  }
}
