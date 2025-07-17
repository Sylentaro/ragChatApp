import Sidebar from "@/components/Sidebar";
import { getUser } from "@/lib/supabase/data";

export default async function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="flex h-screen">
      <Sidebar user={user} />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
