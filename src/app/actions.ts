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
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/conversation");
}

export async function logout() {
  const supabase = await createClientServer();
  await supabase.auth.signOut();

  redirect("/login");
}

export async function register(formData: FormData) {
  const supabase = await createClientServer();
  const registerData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(registerData);

  if (error) {
    throw new Error(error.message);
  }
  await supabase.auth.signOut();
  return { success: true };
}
