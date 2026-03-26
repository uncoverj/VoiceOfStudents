import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { usePost, useLikePost, useCreateComment } from "@/hooks/use-posts";
import { AlertCircle, ArrowLeft, Clock3, Heart, MessageCircle, Send, Share2, ShieldCheck } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function PostDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;
  const { toast } = useToast();

  const { data: post, isLoading, error } = usePost(id);
  const { mutate: likePost, isPending: isLiking } = useLikePost();
  const { mutate: createComment, isPending: isCommenting } = useCreateComment();

  const [commentText, setCommentText] = useState("");

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="mb-8 h-8 w-32 rounded-lg bg-secondary"></div>
          <div className="editorial-card mb-8 p-8">
            <div className="mb-5 h-8 w-32 rounded-full bg-secondary"></div>
            <div className="mb-8 h-14 w-4/5 rounded-2xl bg-secondary"></div>
            <div className="mb-4 h-4 w-full rounded bg-secondary"></div>
            <div className="mb-4 h-4 w-full rounded bg-secondary"></div>
            <div className="h-4 w-2/3 rounded bg-secondary"></div>
          </div>
          <div className="glass-panel rounded-[2rem] p-8">
            <div className="mb-4 h-10 w-56 rounded-2xl bg-secondary"></div>
            <div className="h-16 w-full rounded-[1.5rem] bg-secondary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="editorial-card mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
          <AlertCircle className="mb-6 h-16 w-16 text-destructive" />
          <h3 className="text-3xl font-bold text-foreground">Post not found</h3>
          <p className="mb-6 mt-3 max-w-md text-lg leading-8 text-muted-foreground">
            This post may have been removed or it never existed in the current feed.
          </p>
          <Link href="/" className="story-link bg-primary text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/92">
            Return to feed
          </Link>
        </div>
      </Layout>
    );
  }

  const handleLike = () => {
    if (!isLiking) {
      likePost({ id });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Post link has been copied to your clipboard.",
    });
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    createComment({ id, data: { content: commentText.trim() } }, {
      onSuccess: () => {
        setCommentText("");
        toast({ title: "Comment published" });
      },
      onError: () => {
        toast({ title: "Failed to post comment", variant: "destructive" });
      }
    });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
          Back to Feed
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="editorial-card mb-8 p-6 sm:p-8 lg:p-10"
        >
          <div className="relative z-10">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-white/80 px-4 py-1.5 text-sm font-medium text-muted-foreground">
                  <Clock3 className="h-4 w-4" />
                  {format(new Date(post.createdAt), "MMM d, yyyy • h:mm a")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/[0.05] px-4 py-1.5 text-sm font-medium text-foreground">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Anonymous by design
                </span>
              </div>

              <div className="text-sm font-medium text-muted-foreground">
                Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </div>
            </div>

            <h1 className="max-w-4xl text-balance text-4xl font-bold leading-[0.96] text-foreground sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            <div className="mt-8 prose max-w-none text-base leading-8 text-foreground/85">
              {post.content.split("\n").map((paragraph, i) => (
                <p key={i} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/70 bg-white/82 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Likes</p>
                <div className="mt-2 text-3xl font-bold text-foreground">{post.likeCount}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/70 bg-white/82 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Comments</p>
                <div className="mt-2 text-3xl font-bold text-foreground">{post.comments?.length || 0}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/70 bg-white/82 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Format</p>
                <div className="mt-2 text-3xl font-bold text-foreground">Open</div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-border/70 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Original poster</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Anonymous student</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`story-link ${
                    post.likeCount > 0
                      ? "bg-accent/10 text-accent hover:bg-accent/15"
                      : "bg-secondary/90 text-foreground hover:-translate-y-0.5 hover:bg-secondary"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiking ? "animate-pulse" : ""} ${post.likeCount > 0 ? "fill-accent text-accent" : ""}`} />
                  {post.likeCount} Likes
                </button>

                <button
                  onClick={handleShare}
                  className="story-link border border-border/80 bg-white/80 text-foreground hover:-translate-y-0.5 hover:bg-white"
                >
                  <Share2 className="h-5 w-5" />
                  Share thread
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
          className="glass-panel rounded-[2rem] p-6 sm:p-8 lg:p-10"
          id="comments"
        >
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Thread replies</p>
                <h3 className="mt-2 text-3xl font-bold text-foreground">Comments ({post.comments?.length || 0})</h3>
              </div>
            </div>

            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Keep replies constructive. This thread works best when people add context, not noise.
            </p>
          </div>

          <form onSubmit={submitComment} className="mb-10 grid gap-3 sm:grid-cols-[1fr,auto]">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add an anonymous comment..."
              className="w-full rounded-[1.4rem] border border-border/80 bg-white/86 px-5 py-4 text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/15"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || isCommenting}
              className="story-link bg-primary text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/92 disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none"
            >
              <Send className="h-5 w-5" />
              <span>Post</span>
            </button>
          </form>

          <div className="space-y-4">
            {post.comments?.length === 0 ? (
              <div className="rounded-[1.75rem] border-2 border-dashed border-border bg-white/66 px-6 py-12 text-center text-muted-foreground">
                <MessageCircle className="mx-auto mb-3 h-10 w-10 opacity-50" />
                <p className="text-lg font-semibold text-foreground">No comments yet</p>
                <p className="mt-2">Be the first to add a thoughtful reply.</p>
              </div>
            ) : (
              post.comments?.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="rounded-[1.6rem] border border-white/70 bg-white/82 p-5 shadow-[0_10px_24px_rgba(19,31,55,0.05)]"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-border bg-secondary/70">
                      <span className="text-lg">💬</span>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-foreground">Anonymous Student</span>
                        <span className="text-sm font-medium text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-base leading-7 text-foreground/90">{comment.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.section>
      </div>
    </Layout>
  );
}
