import TryForFreeButton from "@/components/TryForFreeButton";

export default async function Home() {
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

              {/* Demo section */}
              <div className="flex items-center gap-4 pt-8">
                <div className="w-16 h-16 border-2 border-border rounded-full flex items-center justify-center bg-white shadow-shadow">
                  <div className="text-2xl">⚖️</div>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">
                    Just give it a try!
                  </p>
                  <p className="text-xl font-heading">Instant Legal Answers</p>
                </div>
              </div>
            </div>

            {/* Right side - Decorative cards and elements */}
            <div className="relative h-[600px]">
              {/* Legal document card - yellow */}
              <div className="absolute top-20 left-0 w-64 bg-accent border-2 border-border rounded-base shadow-shadow p-6 rotate-[-8deg] z-20">
                <p className="text-sm font-heading mb-4">⚖️ Legal Document</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-foreground rounded-sm" />
                  <div className="h-1 flex-1 bg-foreground/20 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-foreground/10 rounded w-3/4" />
                  <div className="h-2 bg-foreground/10 rounded w-1/2" />
                  <div className="h-2 bg-foreground/10 rounded w-2/3" />
                </div>
                <p className="text-right text-sm font-heading mt-4">
                  Case #001
                </p>
              </div>

              {/* Court order - white */}
              <div className="absolute top-32 right-8 w-80 bg-white border-2 border-border rounded-base shadow-shadow p-6 rotate-[5deg] z-30">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-2xl">⚖️</div>
                  <div className="text-xs font-heading border-2 border-border rounded-base px-2 py-1">
                    OFFICIAL
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-2 bg-foreground/10 rounded w-full" />
                  <div className="h-2 bg-foreground/10 rounded w-5/6" />
                  <div className="h-2 bg-foreground/10 rounded w-4/5" />
                </div>
                <div className="border-t-2 border-border pt-3">
                  <p className="text-xs text-foreground/60">
                    Court Ref: LC-2024-0032
                  </p>
                </div>
                <div className="absolute -top-4 -right-4 bg-main text-main-foreground text-xs px-3 py-1 border-2 border-border rounded-base shadow-shadow">
                  Verified ✓
                </div>
              </div>

              {/* Legal team card */}
              <div className="absolute bottom-20 right-4 w-64 bg-white border-2 border-border rounded-base shadow-shadow p-4 rotate-[3deg] z-10">
                <p className="text-xs font-heading mb-2">Legal Experts</p>
                <div className="flex -space-x-2 mb-2">
                  <div className="w-10 h-10 bg-secondary-background border-2 border-border rounded-full flex items-center justify-center text-sm">
                    👨‍⚖️
                  </div>
                  <div className="w-10 h-10 bg-accent border-2 border-border rounded-full flex items-center justify-center text-sm">
                    👩‍⚖️
                  </div>
                  <div className="w-10 h-10 bg-main border-2 border-border rounded-full flex items-center justify-center text-sm">
                    👨‍💼
                  </div>
                  <div className="w-10 h-10 bg-foreground/20 border-2 border-border rounded-full flex items-center justify-center text-xs font-heading">
                    +15
                  </div>
                </div>
              </div>

              {/* Floating law symbols */}
              <div className="absolute bottom-32 left-8 flex gap-2">
                <div className="w-10 h-10 bg-foreground text-white rounded-full flex items-center justify-center text-lg">
                  ⚖️
                </div>
                <div className="w-10 h-10 bg-foreground text-white rounded-full flex items-center justify-center text-lg">
                  📜
                </div>
              </div>

              {/* Get legal help badge */}
              <div className="absolute top-8 right-16 bg-white border-2 border-border rounded-base shadow-shadow px-4 py-3 rotate-[8deg]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-2xl">⚖️</div>
                  <div className="w-6 h-6 bg-main text-white rounded-full flex items-center justify-center text-xs font-heading">
                    ?
                  </div>
                </div>
                <p className="text-sm font-heading">Need Legal Help?</p>
                <p className="text-xs text-foreground/60">
                  We&apos;re here for you!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
