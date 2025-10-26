import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TryForFreeButton from "@/components/TryForFreeButton";

export default async function Home() {
  const session = await getServerSession(authOptions);
  // if (session) {
  //   redirect("/app/search");
  // }
  return (
    <div className="min-h-screen bg-color-background">
      <main className="relative overflow-hidden">
        {/* Decorative blue blob - top left */}
        <div className="absolute top-0 left-0 w-64 h-96 bg-main rounded-br-[100px] -translate-x-1/4 -translate-y-1/4" />

        {/* Decorative blue blob - bottom right */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-background rounded-tl-[200px] translate-x-1/4 translate-y-1/4" />

        <div className="max-w-7xl mx-auto px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Hero content */}
            <div className="space-y-8">
              {/* Decorative card */}
              <div className="inline-block bg-white border-2 border-border rounded-base shadow-shadow p-4 rotate-[-5deg]">
                <div className="w-12 h-8 bg-foreground rounded-sm"></div>
              </div>

              <h1 className="text-6xl font-heading leading-tight">
                KNOW YOUR LAWS{" "}
                <span className="relative inline-block">
                  INSTANTLY
                  <sup className="text-2xl">®</sup>
                </span>
              </h1>

              <p className="text-lg text-foreground/80">
                A complete solution for understanding your legal rights &
                navigating legal processes.
              </p>

              <TryForFreeButton />

              {/* Video/Demo section */}
              <div className="flex items-center gap-4 pt-8">
                <div className="w-16 h-16 border-2 border-border rounded-full flex items-center justify-center bg-white shadow-shadow">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-foreground border-b-8 border-b-transparent ml-1" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">
                    Just give it a try!
                  </p>
                  <p className="text-xl font-heading">Instant invoicing</p>
                </div>
              </div>
            </div>

            {/* Right side - Decorative cards and elements */}
            <div className="relative h-[600px]">
              {/* Payment card - yellow */}
              <div className="absolute top-20 left-0 w-64 bg-accent border-2 border-border rounded-base shadow-shadow p-6 rotate-[-8deg] z-20">
                <p className="text-sm font-heading mb-4">Payment</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-foreground rounded-full" />
                  <div className="h-1 flex-1 bg-foreground/20 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-foreground/10 rounded w-3/4" />
                  <div className="h-2 bg-foreground/10 rounded w-1/2" />
                </div>
                <p className="text-right text-sm font-heading mt-4">#001</p>
              </div>

              {/* Credit card - white */}
              <div className="absolute top-32 right-8 w-80 bg-white border-2 border-border rounded-base shadow-shadow p-6 rotate-[5deg] z-30">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-8 bg-foreground rounded-sm" />
                  <div className="flex gap-2">
                    <div className="w-8 h-8 border-2 border-foreground rounded-full" />
                    <div className="w-8 h-8 bg-foreground rounded-full" />
                  </div>
                </div>
                <div className="flex gap-2 mb-2">
                  <div className="w-3 h-3 bg-foreground rounded-full" />
                  <div className="w-3 h-3 bg-foreground rounded-full" />
                  <div className="w-3 h-3 bg-foreground rounded-full" />
                  <div className="w-3 h-3 bg-foreground rounded-full" />
                  <span className="mx-2">****</span>
                  <span className="mx-2">****</span>
                  <span className="font-heading">0032</span>
                </div>
                <p className="text-xs text-foreground/60">04/23</p>
                <div className="absolute -top-4 -right-4 bg-main text-main-foreground text-xs px-3 py-1 border-2 border-border rounded-base shadow-shadow">
                  Security confirmed
                </div>
              </div>

              {/* Team members card */}
              <div className="absolute bottom-20 right-4 w-64 bg-white border-2 border-border rounded-base shadow-shadow p-4 rotate-[3deg] z-10">
                <div className="flex -space-x-2 mb-2">
                  <div className="w-10 h-10 bg-secondary-background border-2 border-border rounded-full" />
                  <div className="w-10 h-10 bg-accent border-2 border-border rounded-full" />
                  <div className="w-10 h-10 bg-main border-2 border-border rounded-full" />
                  <div className="w-10 h-10 bg-foreground/20 border-2 border-border rounded-full flex items-center justify-center text-xs">
                    +8
                  </div>
                </div>
              </div>

              {/* Floating dollar signs */}
              <div className="absolute bottom-32 left-8 flex gap-2">
                <div className="w-8 h-8 bg-foreground text-white rounded-full flex items-center justify-center text-sm font-heading">
                  $
                </div>
                <div className="w-8 h-8 bg-foreground text-white rounded-full flex items-center justify-center text-sm font-heading">
                  $
                </div>
              </div>

              {/* Join our team badge */}
              <div className="absolute top-8 right-16 bg-white border-2 border-border rounded-base shadow-shadow px-4 py-3 rotate-[8deg]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 bg-secondary-background border-2 border-border rounded-full" />
                    <div className="w-6 h-6 bg-accent border-2 border-border rounded-full" />
                    <div className="w-6 h-6 bg-main border-2 border-border rounded-full" />
                  </div>
                  <div className="w-6 h-6 bg-foreground text-white rounded-full flex items-center justify-center text-xs font-heading">
                    +
                  </div>
                </div>
                <p className="text-sm font-heading">Join our team</p>
                <p className="text-xs text-foreground/60">
                  It's your turn now!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
