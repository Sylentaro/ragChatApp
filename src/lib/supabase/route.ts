import { createServerClient } from "@supabase/ssr";

export function createClient(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const parsedCookies = cookieHeader
    .split(";")
    .map((cookie) => {
      const [name, ...rest] = cookie.trim().split("=");
      return {
        name,
        value: rest.join("="),
      };
    })
    .filter((cookie) => cookie.name);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parsedCookies;
        },
        // API routes nie mogą ustawiać cookies – tylko frontend lub middleware
        setAll() {
          // Ignorujemy setAll w route.ts
        },
      },
    }
  );
}
