import { conversationExists, getMessages } from "@/lib/supabase/data";
import MessageWindow from "@/components/MessageWindow";
import { redirect } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function ChatMessages(props: PageProps) {
  const { id } = await props.params;

  // First, check if conversation exists
  try {
    await conversationExists(id);
  } catch (error) {
    redirect("/conversation");
  }

  // Then, try to fetch messages
  let messages = [];
  try {
    messages = await getMessages(id);
  } catch (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Błąd ładowania wiadomości</h1>
          <p className="text-gray-500">
            Nie udało się pobrać wiadomości. Spróbuj ponownie później.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => window.location.reload()}
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return <MessageWindow conversationId={id} fetchedMessages={messages} />;
}
