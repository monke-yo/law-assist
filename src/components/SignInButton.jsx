"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
export default function SignInButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Button>Loading...</Button>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <Button
          className="bg-yellow-600 text-black font-semibold px-4 py-2 rounded shadow hover:scale-105 transitionn"
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="bg-yellow-600 text-black font-semibold px-4 py-2 rounded shadow hover:scale-105 transition"
      onClick={() => signIn("google")}
    >
      Sign In with Google
    </Button>
  );
}
