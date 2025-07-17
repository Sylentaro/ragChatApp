"use client";

import { login, register } from "@/app/actions";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useState, useTransition, useRef } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      if (mode === "login") {
        try {
          await login(formData);
        } catch (err) {
          if (!isRedirectError(err) && err instanceof Error) {
            toast.error("Błąd logowania: " + (err?.message || "Nieznany błąd"));
          }
        }
      } else {
        try {
          const result = await register(formData);
          if (result && result.success) {
            toast.success(
              "Konto zostało utworzone! Możesz się teraz zalogować."
            );
            setMode("login");
            form.reset();
          }
        } catch (err) {
          if (err instanceof Error) {
            toast.error("Błąd rejestracji: " + err.message);
          } else {
            toast.error("Błąd rejestracji: Nieznany błąd");
          }
        }
      }
    });
  }

  function handleModeChange(newMode: "login" | "register") {
    setMode(newMode);
    if (formRef.current) {
      formRef.current.reset();
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        ref={formRef}
        className="bg-white p-8 rounded-xl shadow-md min-w-[320px] w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <div className="flex mb-6">
          <button
            type="button"
            onClick={() => handleModeChange("login")}
            className={`flex-1 py-2 rounded-l-xl text-lg font-semibold transition-colors duration-150 ${
              mode === "login"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Logowanie
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("register")}
            className={`flex-1 py-2 rounded-r-xl text-lg font-semibold transition-colors duration-150 ${
              mode === "register"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Rejestracja
          </button>
        </div>
        <h2 className="text-2xl mb-4 text-center font-bold">
          {mode === "login" ? "Logowanie" : "Rejestracja"}
        </h2>
        <input
          type="email"
          placeholder="Email"
          name="email"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          name="password"
          className="w-full p-2 mb-6 border rounded"
          required
        />
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-500 text-white p-2 rounded font-semibold text-lg hover:bg-blue-600 transition disabled:opacity-60"
        >
          {isPending
            ? mode === "login"
              ? "Logowanie..."
              : "Rejestracja..."
            : mode === "login"
            ? "Zaloguj się"
            : "Zarejestruj się"}
        </button>
      </form>
    </div>
  );
}
