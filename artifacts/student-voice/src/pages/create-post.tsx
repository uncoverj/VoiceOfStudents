import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Layout } from "@/components/layout";
import { ArrowLeft, Lightbulb, MessageSquare, Send, Shield, Sparkles } from "lucide-react";
import { useCreatePost } from "@/hooks/use-posts";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { motion } from "framer-motion";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  content: z.string().min(10, "Content must be at least 10 characters").max(2000, "Content is too long"),
  category: z.string().min(1, "Please select a category")
});

const CATEGORIES = ["Study", "Infrastructure", "Teachers", "Ideas", "Student Life"];
const PROMPTS = [
  {
    title: "Name the friction",
    description: "What exactly happened, where did it happen, and why should students care now?",
    icon: MessageSquare,
  },
  {
    title: "Suggest the improvement",
    description: "The best posts do not just complain. They point toward a better next step.",
    icon: Lightbulb,
  },
  {
    title: "Stay constructive",
    description: "Clarity beats drama. A concise post gets read and acted on faster.",
    icon: Sparkles,
  },
];

export default function CreatePost() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { mutate: createPost, isPending } = useCreatePost();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
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

  const selectedCategory = watch("category");

  return (
    <Layout>
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
          Back to Feed
        </Link>

        <div className="grid gap-8 xl:grid-cols-[0.92fr,1.08fr]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="editorial-card p-6 sm:p-8 lg:p-10">
              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  Anonymous publishing studio
                </div>

                <h2 className="text-balance text-4xl font-bold leading-[0.95] text-foreground sm:text-5xl">
                  Turn a frustration or an idea into a clean, readable campus signal.
                </h2>

                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                  This form is designed for clarity. Write what happened, why it matters, and what better looks like.
                </p>

                <div className="mt-8 rounded-[1.5rem] border border-primary/10 bg-primary/[0.05] p-5">
                  <div className="mb-3 inline-flex items-center gap-2 text-base font-semibold text-foreground">
                    <Shield className="h-5 w-5 text-accent" />
                    Your identity stays protected
                  </div>
                  <p className="leading-7 text-muted-foreground">
                    Posts are published anonymously. No names, no profiles, no personal exposure. The goal is honest feedback with a professional presentation.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {PROMPTS.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 + index * 0.08 }}
                    className="glass-panel rounded-[1.5rem] p-5"
                  >
                    <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-accent shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="editorial-card p-6 sm:p-8 lg:p-10"
          >
            <div className="relative z-10">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Create a post</p>
                  <h3 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Write with structure, publish with confidence.</h3>
                </div>
                <div className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-muted-foreground">
                  Clear input. Fast scan. Anonymous output.
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-3">
                  <label htmlFor="title" className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/70">
                    Post title
                  </label>
                  <input
                    id="title"
                    {...register("title")}
                    className="w-full rounded-[1.4rem] border border-border/80 bg-background/80 px-5 py-4 text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/15"
                    placeholder="E.g. Library study zones need more quiet seating after 6 PM"
                  />
                  {errors.title ? <p className="text-sm font-medium text-destructive">{errors.title.message}</p> : null}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/70">Category</label>
                    <p className="text-sm text-muted-foreground">Choose the lane that fits best</p>
                  </div>

                  <input type="hidden" {...register("category")} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setValue("category", cat, { shouldValidate: true })}
                        className={`rounded-[1.25rem] border px-4 py-4 text-left text-sm font-semibold transition-all duration-300 ${
                          selectedCategory === cat
                            ? "border-primary bg-primary text-primary-foreground shadow-[0_14px_34px_rgba(20,30,60,0.18)]"
                            : "border-border/80 bg-white/75 text-foreground hover:-translate-y-0.5 hover:border-accent/30 hover:bg-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  {errors.category ? <p className="text-sm font-medium text-destructive">{errors.category.message}</p> : null}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="content" className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/70">
                      Details
                    </label>
                    <p className="text-sm text-muted-foreground">Aim for context, impact and a suggested next step</p>
                  </div>

                  <textarea
                    id="content"
                    {...register("content")}
                    rows={9}
                    className="w-full resize-none rounded-[1.4rem] border border-border/80 bg-background/80 px-5 py-4 text-base leading-7 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/15"
                    placeholder="Describe what happened, where it affects students, and what a better version could look like..."
                  />
                  {errors.content ? <p className="text-sm font-medium text-destructive">{errors.content.message}</p> : null}
                </div>

                <div className="flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                    Your post becomes part of a clean public feed for Webster University Tashkent students. Keep it specific and constructive.
                  </p>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="story-link bg-accent text-accent-foreground shadow-[0_14px_34px_rgba(248,109,64,0.24)] hover:-translate-y-0.5 hover:bg-accent/92 disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none"
                  >
                    {isPending ? (
                      <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Publish anonymously
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.section>
        </div>
      </div>
    </Layout>
  );
}
