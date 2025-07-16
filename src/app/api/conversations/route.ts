import { createClient } from "@/lib/supabase/route";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient(request);
  const { userId } = await request.json();

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
  const supabase = createClient(request);
  const { id, title } = await request.json();

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
  const supabase = createClient(request);
  const { id } = await request.json();

  const { error } = await supabase.from("conversations").delete().eq("id", id);

  if (error) {
    console.error("Błąd usuwania konwersacji:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Konwersacja usunięta" });
}
