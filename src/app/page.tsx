import SignInButton from "@/components/SignInButton";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center relative z-10">
      <h1 className="text-6xl font-extrabold tracking-tight mb-6">
        Lawyer Assistant
      </h1>

      <p className="mb-4 text-lg">
        Know About Your Legal Options from Anywhere
      </p>
      <SignInButton />
    </main>
  );
}
