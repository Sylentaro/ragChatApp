import LoginPage from "@/components/pages/LoginPage";
import { getUser } from "@/lib/supabase/data";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Login() {
  try {
    await getUser();
  } catch (error) {
    console.error("Wystąpił błąd:", error);
    return <LoginPage />;
  }
  redirect("/conversation");
}
