import { useState } from "react";
import { Link } from "wouter";
import { Plus, Filter, TrendingUp, Clock, AlertCircle, MessageSquare } from "lucide-react";
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

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-display font-bold text-foreground">Student Voices</h2>
          <p className="text-muted-foreground mt-2 text-base">Speak your mind freely and anonymously to improve campus life.</p>
        </div>
        <Link href="/create" className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-accent/20 hover:shadow-xl hover:bg-[#eab308] hover:-translate-y-1 transition-all duration-300 active:translate-y-0 active:shadow-md border border-accent-foreground/10 text-lg">
          <Plus className="w-6 h-6" />
          New Post
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-card p-2 sm:p-3 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="pl-3 pr-2 text-muted-foreground hidden sm:block">
            <Filter className="w-5 h-5" />
          </div>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                category === cat 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-2 sm:px-4 lg:border-l border-border pt-2 lg:pt-0">
          <button
            onClick={() => setSort("latest")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              sort === "latest" ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Clock className="w-4 h-4" />
            Latest
          </button>
          <button
            onClick={() => setSort("most_liked")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              sort === "most_liked" ? "text-accent-foreground bg-accent/20" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Top
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-card rounded-3xl p-6 h-[280px] animate-pulse border border-border shadow-sm flex flex-col">
              <div className="flex justify-between mb-6">
                <div className="w-24 h-7 bg-secondary rounded-full"></div>
                <div className="w-20 h-5 bg-secondary rounded-full"></div>
              </div>
              <div className="w-4/5 h-7 bg-secondary rounded-lg mb-4"></div>
              <div className="w-full h-4 bg-secondary rounded mb-2"></div>
              <div className="w-full h-4 bg-secondary rounded mb-2"></div>
              <div className="w-2/3 h-4 bg-secondary rounded mt-auto"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-3xl border border-border shadow-sm">
          <AlertCircle className="w-16 h-16 text-destructive mb-4 opacity-90" />
          <h3 className="text-2xl font-bold text-foreground">Failed to load posts</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">We couldn't reach the server. Please try refreshing the page.</p>
        </div>
      ) : posts?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-3xl border border-border shadow-sm">
          <div className="w-20 h-20 bg-accent/15 text-accent-foreground rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-display font-bold text-foreground mb-3">No posts yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
            Be the first to share your thoughts, ideas, or feedback about life at Webster University Tashkent.
          </p>
          <Link href="/create" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all hover-elevate shadow-lg text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create a Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
              className="h-full"
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
