import { useState } from "react";
import { Link } from "wouter";
import {
  AlertCircle,
  ArrowRight,
  Clock,
  Filter,
  Flame,
  MessageSquare,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import { PostCard } from "@/components/post-card";
import { Layout } from "@/components/layout";
import { ListPostsSort } from "@workspace/api-client-react";
import { motion } from "framer-motion";

const CATEGORIES = ["All", "Study", "Infrastructure", "Teachers", "Ideas", "Student Life"];

export default function Home() {
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<ListPostsSort>("latest");

  const { data: posts, isLoading, error } = usePosts({
    category: category === "All" ? undefined : category,
    sort
  });

  const feedMetrics = [
    {
      label: "Conversations on the board",
      value: isLoading ? "--" : String(posts?.length ?? 0).padStart(2, "0"),
    },
    {
      label: "Themes currently surfaced",
      value: String(category === "All" ? CATEGORIES.length - 1 : 1).padStart(2, "0"),
    },
    {
      label: "Signals from likes and replies",
      value: isLoading
        ? "--"
        : String(posts?.reduce((sum, post) => sum + post.likeCount + post.commentCount, 0) ?? 0).padStart(2, "0"),
    },
  ];

  const categorySnapshot = CATEGORIES
    .filter((entry) => entry !== "All")
    .map((entry) => ({
      name: entry,
      count: posts?.filter((post) => post.category === entry).length ?? 0,
    }));

  const maxCategoryCount = Math.max(...categorySnapshot.map((entry) => entry.count), 1);

  return (
    <Layout>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mb-8 grid gap-8 xl:grid-cols-[1.15fr,0.85fr]"
      >
        <div className="editorial-card p-6 sm:p-8 lg:p-10">
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-accent">
              <Sparkles className="h-4 w-4" />
              Voice of the campus
            </div>

            <h2 className="max-w-3xl text-balance text-4xl font-bold leading-[0.95] text-foreground sm:text-5xl lg:text-6xl">
              A student feedback board that finally looks as serious as the ideas on it.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Anonymous by default, built for clarity, and designed to turn raw thoughts into a visible campus pulse.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/create"
                className="story-link bg-primary text-primary-foreground shadow-[0_16px_40px_rgba(20,30,60,0.2)] hover:-translate-y-0.5 hover:bg-primary/92"
              >
                <Plus className="h-5 w-5" />
                Start a new post
              </Link>

              <a
                href="#feed"
                className="story-link border border-border/80 bg-white/80 text-foreground hover:-translate-y-0.5 hover:bg-white"
              >
                Explore discussions
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {feedMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 + index * 0.08 }}
                  className="rounded-[1.5rem] border border-white/80 bg-white/78 p-4 shadow-[0_10px_30px_rgba(18,28,55,0.06)]"
                >
                  <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
          className="relative"
        >
          <div className="editorial-card h-full p-6 sm:p-8">
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Campus radar</p>
                  <h3 className="mt-2 text-2xl font-bold text-foreground">What students are surfacing right now</h3>
                </div>
                <div className="pulse-dot flex h-12 w-12 items-center justify-center rounded-full bg-accent/12 text-accent">
                  <Flame className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-4">
                {categorySnapshot.map((entry) => (
                  <div key={entry.name} className="rounded-[1.35rem] border border-border/60 bg-white/78 p-4">
                    <div className="mb-3 flex items-center justify-between text-sm font-semibold text-foreground">
                      <span>{entry.name}</span>
                      <span className="text-muted-foreground">{String(entry.count).padStart(2, "0")}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(29,44,78,1),rgba(248,109,64,0.92))] transition-all duration-500"
                        style={{ width: `${18 + (entry.count / maxCategoryCount) * 82}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-primary/10 bg-primary/[0.05] p-4">
                  <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    Anonymous by design
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Students can post and comment without turning the product into a messy confession wall.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-accent/15 bg-accent/10 p-4">
                  <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MessageSquare className="h-4 w-4 text-accent" />
                    Discussion-ready
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Structured cards, strong hierarchy and fast scanning make every thread easier to follow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        id="feed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.16 }}
        className="glass-panel mb-8 rounded-[1.75rem] p-3 sm:p-4"
      >
        <div className="mb-4 flex flex-col gap-3 px-2 pt-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Signal filters</p>
            <h3 className="mt-2 text-2xl font-bold text-foreground">Dial into the conversations that matter now</h3>
          </div>

          <div className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-muted-foreground">
            Showing {category === "All" ? "all categories" : category} sorted by{" "}
            <span className="font-semibold text-foreground">{sort === "latest" ? "latest" : "top feedback"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-[1.5rem] border border-white/70 bg-white/68 p-2.5 sm:p-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="hide-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="pl-3 pr-1 text-muted-foreground">
              <Filter className="h-5 w-5" />
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  category === cat
                    ? "bg-primary text-primary-foreground shadow-[0_10px_26px_rgba(20,30,60,0.16)]"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-1 sm:px-2">
            <button
              onClick={() => setSort("latest")}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                sort === "latest"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Clock className="h-4 w-4" />
              Latest
            </button>
            <button
              onClick={() => setSort("most_liked")}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                sort === "most_liked"
                  ? "bg-accent/12 text-accent"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Top
            </button>
          </div>
        </div>
      </motion.section>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="editorial-card flex h-[320px] animate-pulse flex-col p-6">
              <div className="mb-6 flex justify-between">
                <div className="h-7 w-28 rounded-full bg-secondary" />
                <div className="h-5 w-24 rounded-full bg-secondary" />
              </div>
              <div className="mb-4 h-8 w-4/5 rounded-2xl bg-secondary" />
              <div className="mb-2 h-4 w-full rounded bg-secondary" />
              <div className="mb-2 h-4 w-full rounded bg-secondary" />
              <div className="mt-auto h-12 w-3/4 rounded-2xl bg-secondary" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="editorial-card flex flex-col items-center justify-center px-6 py-20 text-center">
          <AlertCircle className="mb-4 h-16 w-16 text-destructive opacity-90" />
          <h3 className="text-3xl font-bold text-foreground">Failed to load posts</h3>
          <p className="mt-3 max-w-md text-lg leading-8 text-muted-foreground">
            We could not reach the server. Refresh the page or try again once the feed is back online.
          </p>
        </div>
      ) : posts?.length === 0 ? (
        <div className="editorial-card flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/12 text-accent">
            <MessageSquare className="h-10 w-10" />
          </div>
          <h3 className="text-3xl font-bold text-foreground">No posts yet</h3>
          <p className="mx-auto mb-8 mt-3 max-w-2xl text-lg leading-8 text-muted-foreground">
            Be the first student to put an idea, concern or campus win onto the board.
          </p>
          <Link
            href="/create"
            className="story-link bg-primary text-primary-foreground shadow-[0_14px_34px_rgba(20,30,60,0.18)] hover:-translate-y-0.5 hover:bg-primary/92"
          >
            <Plus className="h-5 w-5" />
            Create a Post
          </Link>
        </div>
      ) : (
        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Discussion feed</p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">Fresh student conversations, styled for scanning</h3>
            </div>
            <div className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-muted-foreground">
              {posts?.length ?? 0} visible posts
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts?.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: "easeOut" }}
                className="h-full"
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
