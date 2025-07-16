import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

type MatchedEmbedding = {
  content: string;
  source_file: string;
  distance?: number;
};

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
          text: `Pytanie: ${message}`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `
Jesteś asystentem doradczym. Masz odpowiadać na pytanie wyłącznie na podstawie podanych źródeł. Nie wolno ci udzielać odpowiedzi bez nich.
Jeśli odpowiedź nie znajduje się w źródłach, napisz szczerze: "Nie wiem na podstawie podanych informacji."
Dodaj, z których źródeł pochodzi odpowiedź - na końcu swojej odpowiedzi dodaj nową linię: Źródło/Źródła: "nazwa_pliku.txt".

Źródła:
${contextText}
          `.trim(),
    },
    contents,
  });

  return NextResponse.json({ answer: response.text });
}
