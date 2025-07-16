"use server";

import { createClientServer } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClientServer();
  const loginData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(loginData);

  if (error) {
    console.error("Login error:", error.message);
  }

  revalidatePath("/", "layout");
  redirect("/conversation");
}

export default login;
