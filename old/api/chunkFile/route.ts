import { createClientRoute } from "@/lib/supabase/client";
import { chunkText } from "@/lib/serverUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { filecontent, filename } = await request.json();

  if (!filecontent) {
    return NextResponse.json({ error: "Chunks are required" }, { status: 400 });
  }
  const chunks = chunkText(filecontent, 300);
  const chunkedData = chunks.map((chunk, index) => ({
    content: chunk,
    source_file: filename,
    chunk_index: index,
  }));

  console.table(chunkedData); // Debugging: log the chunked data to console

  const supabase = createClientRoute(request);
  const { error } = await supabase.from("knowledge_chunks").insert(chunkedData);

  if (error) {
    console.error("Error inserting chunks:", error);
    return NextResponse.json(
      { error: "Failed to insert chunks" },
      { status: 500 }
    );
  }

  // Here you would typically save the chunks to your database or process them further
  // For demonstration, we'll just return the chunks
  return NextResponse.json({ msg: "ok" });
}
