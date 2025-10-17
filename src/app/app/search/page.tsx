import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ChatUI from "./ChatUI";

export default async function SearchPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/"); // if not logged in, go to landing page
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Lawyer Assistant</h1>
      <p className="mt-2">Welcome, {session.user?.name}</p>
      <ChatUI />
    </div>
  );
}
