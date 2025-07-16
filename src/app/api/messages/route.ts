import { createClient } from "@/lib/supabase/route";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient(request);

  const { searchParams } = new URL(request.url);

  const conversationId = searchParams.get("conversationId");

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Błąd tworzenia konwersacji:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createClient(request);
  const { conversationId, content, role } = await request.json();

  let embedding = null;

  if (!role || role === "user") {
    const ai = new GoogleGenAI({});
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: content,
      config: {
        taskType: "RETRIEVAL_DOCUMENT",
      },
    });

    embedding = response.embeddings?.[0].values;
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      content,
      role: role || "user",
      embedding,
    })
    .select()
    .single();

  if (error) {
    console.error("Błąd tworzenia wiadomości:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
