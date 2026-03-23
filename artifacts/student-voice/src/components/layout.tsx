import { Link } from "wouter";
import { ShieldCheck, BarChart3 } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shadow-inner overflow-hidden border border-accent/20">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo.png`} 
                alt="StudentVoice Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold leading-tight tracking-wide">StudentVoice</h1>
              <p className="text-xs text-primary-foreground/70 font-medium">Webster University Tashkent</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-xs font-medium text-primary-foreground/90 border border-primary-foreground/10">
              <ShieldCheck className="w-4 h-4 text-accent" />
              100% Anonymous
            </div>
            
            <Link 
              href="/admin" 
              className="p-2.5 rounded-xl hover:bg-primary-foreground/10 text-primary-foreground/80 hover:text-white transition-all duration-200" 
              title="Admin Dashboard"
            >
              <BarChart3 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      
      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border/50 bg-card mt-auto">
        <p>A safe space for Webster University Tashkent students.</p>
        <p className="mt-1 opacity-70">Identity protected. Feedback amplified.</p>
      </footer>
    </div>
  );
}
