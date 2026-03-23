import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Layout } from "@/components/layout";
import { Shield, ArrowLeft, Send } from "lucide-react";
import { useCreatePost } from "@/hooks/use-posts";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  content: z.string().min(10, "Content must be at least 10 characters").max(2000, "Content is too long"),
  category: z.string().min(1, "Please select a category")
});

const CATEGORIES = ["Study", "Infrastructure", "Teachers", "Ideas", "Student Life"];

export default function CreatePost() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { mutate: createPost, isPending } = useCreatePost();

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: ""
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createPost({ data: values }, {
      onSuccess: () => {
        toast({
          title: "Post published!",
          description: "Your anonymous post has been shared successfully.",
        });
        setLocation("/");
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create post. Please try again.",
        });
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground font-semibold hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Feed
        </Link>

        <div className="bg-card rounded-3xl p-6 sm:p-10 shadow-xl border border-border">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3 tracking-tight">Create New Post</h2>
            <p className="text-muted-foreground text-lg">Share your feedback, ideas, or experiences.</p>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 sm:p-6 flex items-start gap-4 mb-10">
            <div className="bg-primary/10 p-3 rounded-xl text-primary mt-0.5">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-lg mb-1">Your identity is protected</h4>
              <p className="text-muted-foreground leading-relaxed">
                Posts are 100% anonymous. We do not track or display any personal information. 
                Feel free to speak openly, but please keep it constructive.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="title" className="text-base font-bold text-foreground">Post Title</label>
              <input
                id="title"
                {...register("title")}
                className="w-full px-5 py-4 rounded-xl bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                placeholder="E.g. We need more study spaces in the library"
              />
              {errors.title && <p className="text-sm font-medium text-destructive mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-3">
              <label htmlFor="category" className="text-base font-bold text-foreground">Category</label>
              <div className="relative">
                <select
                  id="category"
                  {...register("category")}
                  className="w-full px-5 py-4 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none font-medium cursor-pointer"
                >
                  <option value="" disabled>Select a category...</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-muted-foreground">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.5L6 6.5L10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              {errors.category && <p className="text-sm font-medium text-destructive mt-1">{errors.category.message}</p>}
            </div>

            <div className="space-y-3">
              <label htmlFor="content" className="text-base font-bold text-foreground">Details</label>
              <textarea
                id="content"
                {...register("content")}
                rows={6}
                className="w-full px-5 py-4 rounded-xl bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none font-medium"
                placeholder="Explain your thoughts in detail..."
              />
              {errors.content && <p className="text-sm font-medium text-destructive mt-1">{errors.content.message}</p>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg bg-accent text-accent-foreground shadow-lg shadow-accent/25 hover:shadow-xl hover:bg-[#eab308] hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-accent-foreground/10"
              >
                {isPending ? (
                  <div className="w-6 h-6 border-3 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Publish Anonymously
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
