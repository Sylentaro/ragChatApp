import fs from "fs";
import path from "path";

export function loadFileToText(fileName: string) {
  const filePath = path.join(process.cwd(), `src/data/${fileName}`);

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8"); // <- wynik to string
    console.log("Plik załadowany!");
    console.log(fileContent); // możesz teraz np. podzielić na chunki
    return fileContent; // zwróć zawartość pliku jako string
  } catch (error) {
    console.log("dirname:", __dirname);
    console.error("Błąd odczytu pliku:", error);
    return null;
  }
}

export function chunkText(text: string, maxChunkSize = 300): string[] {
  const chunks = []; // 1. Tablica na fragmenty tekstu
  let start = 0; // 2. Indeks początku aktualnego fragmentu

  while (start < text.length) {
    // 3. Pętla dopóki nie przetworzymy całego tekstu
    let end = start + maxChunkSize; // 4. Indeks końca fragmentu (maksymalny rozmiar chunk)
    if (end > text.length) end = text.length; // 5. Jeśli fragment wykracza poza tekst, ustaw koniec na koniec tekstu

    let chunk = text.slice(start, end); // 6. Wyciągnij fragment tekstu od start do end (nie włącznie)

    // 7. Szukamy ostatniej kropki w fragmencie
    const lastPeriod = chunk.lastIndexOf(".");
    if (lastPeriod > 0 && lastPeriod < chunk.length - 1) {
      // 8. Jeśli kropka jest gdzieś w środku (nie na początku i nie na końcu)
      // to przycinamy fragment do końca tej kropki, żeby nie ciąć zdania
      chunk = chunk.slice(0, lastPeriod + 1);
      end = start + chunk.length; // Aktualizujemy indeks końca fragmentu do nowej długości
    }

    chunks.push(chunk.trim()); // 9. Dodajemy przycięty fragment do tablicy (bez zbędnych spacji na brzegach)
    start = end; // 10. Przesuwamy start na koniec tego fragmentu, by zacząć kolejny
  }
  return chunks; // 11. Zwracamy tablicę fragmentów (chunków)
}
