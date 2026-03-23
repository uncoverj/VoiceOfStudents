import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-28 h-28 bg-secondary/80 rounded-3xl flex items-center justify-center mb-8 border border-border shadow-inner transform rotate-12">
          <FileQuestion className="w-14 h-14 text-muted-foreground -rotate-12" />
        </div>
        <h1 className="text-5xl font-display font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        <Link href="/" className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all duration-300 hover-elevate text-lg">
          <ArrowLeft className="w-5 h-5" />
          Back to Feed
        </Link>
      </div>
    </Layout>
  );
}
