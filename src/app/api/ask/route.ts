import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { message } = body;
  const context: MatchedEmbedding[] = body.context;

  const contextText = context
    .map(
      (item, index) =>
        `Źródło ${index + 1} (${item.source_file}):\n${item.content}`
    )
    .join("\n\n");

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `
Jesteś asystentem doradczym. Masz odpowiadać wyłącznie na podstawie podanych źródeł. Nie wolno ci udzielać odpowiedzi bez nich.
Jeśli odpowiedź nie znajduje się w źródłach, napisz szczerze: "Nie wiem na podstawie podanych informacji."
Dodaj na końcu, z którego źródła pochodzi odpowiedź - na końcu swojej odpowiedzi dodaj nową linię: Źródło: "nazwa_pliku.txt".

Pytanie: ${message}

Źródła:
${contextText}
          `.trim(),
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });

  return NextResponse.json({ answer: response.text });
}
