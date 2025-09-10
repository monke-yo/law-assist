"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button
        disabled
        className="bg-yellow-300 text-black font-semibold px-4 py-2 rounded shadow opacity-70"
      >
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-black font-medium">
          {session.user?.name ?? session.user?.email}
        </span>
        <button
          className="bg-yellow-600 text-black font-semibold px-4 py-2 rounded shadow hover:scale-105 transitionn"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      className="bg-yellow-600 text-black font-semibold px-4 py-2 rounded shadow hover:scale-105 transition"
      onClick={() => signIn("google")}
    >
      Sign In with Google
    </button>
  );
}
