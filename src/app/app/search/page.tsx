import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ChatUI from "./ChatUI";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageDropdown from "@/components/LanguageDropdown";

export default async function SearchPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/"); // if not logged in, go to landing page
  }

  return (
    <LanguageProvider>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Lawyer Assistant</h1>
            <p className="mt-2">Welcome, {session.user?.name}</p>
          </div>
          <LanguageDropdown />
        </div>
        <ChatUI />
      </div>
    </LanguageProvider>
  );
}
