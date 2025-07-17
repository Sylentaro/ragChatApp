import LoginPage from "@/components/pages/LoginPage";
import { getUser } from "@/lib/supabase/data";
import { redirect } from "next/navigation";

export default async function Login() {
  try {
    await getUser();
  } catch (error) {
    return <LoginPage />;
  }
  redirect("/conversation");
}
