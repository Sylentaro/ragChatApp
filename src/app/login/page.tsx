import Login from "@/components/pages/LoginPage";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (data?.user || !error) {
    // If user is already logged in, redirect to chat page
    redirect("/chat");
  }
  return <Login />;
}
