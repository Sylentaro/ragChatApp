import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import Chat from "@/components/pages/ChatPage";
import { loadFileToText } from "@/lib/serverUtils";

export default async function ChatPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  const userId = data?.user?.id || "";

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error.message);
  }

  // const fileName = "ryzyka_transakcji_sprzedazy_firmy.txt";

  // const fileText = loadFileToText(fileName) || "";

  // return <p>Hello {data.user.email}</p>;
  return (
    <Chat
      userId={userId}
      fetchedConversations={conversations}
      // fileName={fileName}
      // fileText={fileText}
    />
  );
}
