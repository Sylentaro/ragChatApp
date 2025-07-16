import { createClientServer } from "./client";

export async function getUserId() {
  const supabase = await createClientServer();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user?.id) throw new Error("User not found");
  return data.user.id;
}

export async function getUserConversations(userId: string) {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function getMessages(conversationId: string) {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}
