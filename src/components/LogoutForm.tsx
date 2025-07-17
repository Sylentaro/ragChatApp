"use client";

import { logout } from "@/app/actions";

export default function LogoutForm() {
  return (
    <form action={logout} className="flex justify-center p-4">
      <button
        type="submit"
        className="w-full bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition"
      >
        Wyloguj się
      </button>
    </form>
  );
}
