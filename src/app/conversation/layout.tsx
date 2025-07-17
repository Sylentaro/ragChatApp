import Sidebar from "@/components/Sidebar";
import { getUser, getUserConversations } from "@/lib/supabase/data";

export default async function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  // let conversations;
  // try {
  //   conversations = await getUserConversations(user.id);
  // } catch (error) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold mb-2">Błąd ładowania rozmów</h1>
  //         <p className="text-gray-500">
  //           Nie udało się pobrać rozmów. Spróbuj ponownie później.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-screen">
      <Sidebar user={user} />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
