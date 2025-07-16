import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/route";

export async function POST(request: NextRequest) {
  const { queryEmbedding } = await request.json();

  const supabase = createClient(request);

  const { data, error } = await supabase.rpc("match_embeddings", {
    query_embedding: queryEmbedding,
    match_count: 5,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
