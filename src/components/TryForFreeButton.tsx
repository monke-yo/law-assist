"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TryForFreeButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (session) {
      router.push("/app/search");
    } else {
      signIn("google");
    }
  };

  return (
    <Button
      size="lg"
      onClick={handleClick}
      className="bg-accent text-accent-foreground hover:translate-x-boxShadowX hover:translate-y-boxShadowY"
    >
      Try for free
    </Button>
  );
}
