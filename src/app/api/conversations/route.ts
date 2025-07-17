import { createClientRoute } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClientRoute(request);
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId!" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Błąd pobierania konwersacji:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createClientRoute(request);
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId!" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: userId,
      title: "Nowa rozmowa",
    })
    .select()
    .single();

  if (error) {
    console.error("Błąd tworzenia konwersacji:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const supabase = createClientRoute(request);
  const { id, title } = await request.json();

  if (!id || !title) {
    return NextResponse.json(
      { error: "Missing id or title!" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("conversations")
    .update({ title })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Błąd aktualizacji konwersacji:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const supabase = createClientRoute(request);
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Missing id!" }, { status: 400 });
  }

  const { error } = await supabase.from("conversations").delete().eq("id", id);

  if (error) {
    console.error("Błąd usuwania konwersacji:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Konwersacja usunięta" });
}
