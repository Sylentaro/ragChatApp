import { NextRequest, NextResponse } from "next/server";
import { createClientRoute } from "@/lib/supabase/client";

export async function POST(request: NextRequest) {
  const { queryEmbedding } = await request.json();

  if (!queryEmbedding) {
    return NextResponse.json(
      { error: "Missing queryEmbedding!" },
      { status: 400 }
    );
  }

  const supabase = createClientRoute(request);

  const { data, error } = await supabase.rpc("match_embeddings", {
    query_embedding: queryEmbedding,
    match_count: 5,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
