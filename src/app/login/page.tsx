import Login from "@/components/pages/LoginPage";
import { createClientServer } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClientServer();
  const { data, error } = await supabase.auth.getUser();
  if (data?.user || !error) {
    // If user is already logged in, redirect to chat page
    redirect("/conversation");
  }
  return <Login />;
}
