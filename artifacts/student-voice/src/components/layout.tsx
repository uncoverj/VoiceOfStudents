import { Link } from "wouter";
import { ArrowUpRight, BarChart3, ShieldCheck, Sparkles } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="floating-orb absolute -left-16 top-8 h-64 w-64 rounded-full bg-[rgba(248,109,64,0.22)]" />
        <div className="floating-orb absolute right-[-4rem] top-40 h-72 w-72 rounded-full bg-[rgba(91,136,255,0.18)] [animation-delay:-5s]" />
        <div className="floating-orb absolute bottom-[-5rem] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[rgba(255,192,92,0.18)] [animation-delay:-2s]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
          <div className="glass-panel mx-auto flex max-w-7xl items-center justify-between rounded-[1.75rem] px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-accent/20 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                <img
                  src={`${import.meta.env.BASE_URL}images/logo.png`}
                  alt="StudentVoice Logo"
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-[0.04em] text-foreground sm:text-xl">StudentVoice</h1>
                  <span className="hidden rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent sm:inline-flex">
                    Live
                  </span>
                </div>
                <p className="text-xs font-medium text-muted-foreground sm:text-sm">Webster University Tashkent</p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-semibold text-foreground/80 lg:flex">
                <Sparkles className="h-4 w-4 text-accent" />
                Speak freely. Shape campus better.
              </div>

              <div className="hidden items-center gap-1.5 rounded-full border border-primary/10 bg-primary/[0.06] px-3 py-2 text-xs font-semibold text-foreground md:inline-flex">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Protected identity
              </div>

              <Link
                href="/create"
                className="story-link bg-primary text-primary-foreground shadow-[0_12px_30px_rgba(25,38,67,0.22)] hover:-translate-y-0.5 hover:bg-primary/92"
              >
                Share a story
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href="/admin"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/70 text-foreground/70 transition-all duration-300 hover:-translate-y-0.5 hover:text-foreground"
                title="Admin Dashboard"
              >
                <BarChart3 className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </header>

        <main className="relative z-10 flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>

        <footer className="relative z-10 px-4 pb-8 sm:px-6 lg:px-8">
          <div className="glass-panel mx-auto grid max-w-7xl gap-6 rounded-[2rem] px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.4fr,0.9fr,0.9fr]">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                Campus signal board
              </p>
              <h2 className="max-w-md text-2xl font-bold text-foreground">
                Anonymous feedback that looks serious, feels safe and stays useful.
              </h2>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-semibold uppercase tracking-[0.18em] text-foreground/70">Principles</p>
              <p>Identity protected for every post and comment.</p>
              <p>Clean discussion flow for ideas, concerns and campus wins.</p>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-semibold uppercase tracking-[0.18em] text-foreground/70">Designed For</p>
              <p>Students who want clarity, not noise.</p>
              <p>Webster University Tashkent.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
