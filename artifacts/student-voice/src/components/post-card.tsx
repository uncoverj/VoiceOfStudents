import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Clock3, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import { Post } from "@workspace/api-client-react";
import { formatDistanceToNow } from "date-fns";
import { useLikePost } from "@/hooks/use-posts";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage, hasLikedPost, isAlreadyLikedError, markPostLiked } from "@/lib/utils";

export function PostCard({ post, linkToDetail = true }: { post: Post, linkToDetail?: boolean }) {
  const { mutate: likePost, isPending: isLiking } = useLikePost();
  const { toast } = useToast();
  const [liked, setLiked] = useState(() => hasLikedPost(post.id));

  useEffect(() => {
    setLiked(hasLikedPost(post.id));
  }, [post.id]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLiking && !liked) {
      likePost(
        { id: post.id },
        {
          onSuccess: () => {
            markPostLiked(post.id);
            setLiked(true);
          },
          onError: (error) => {
            const message = getApiErrorMessage(
              error,
              "You can like a post only once from the same device.",
            );

            if (isAlreadyLikedError(message)) {
              markPostLiked(post.id);
              setLiked(true);
            }

            toast({
              title: "Unable to like this post",
              description: message,
              variant: "destructive",
            });
          },
        },
      );
    }
  };

  const CardContent = (
    <div className="editorial-card group flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(20,30,60,0.12)] sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(248,109,64,0.16),transparent_28%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="pointer-events-none absolute right-5 top-2 text-[5rem] font-display leading-none text-primary/[0.05] transition-transform duration-500 group-hover:-translate-y-1 sm:right-7">
        "
      </span>

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-5 flex items-start justify-between gap-4">
          <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            {post.category}
          </span>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-white/85 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </div>
        </div>

        <h3 className="mb-3 text-2xl font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
          {post.title}
        </h3>

        <p className="mb-7 line-clamp-4 flex-1 text-sm leading-7 text-muted-foreground sm:text-[15px]">
          {post.content}
        </p>

        <div className="mt-auto border-t border-border/70 pt-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/[0.05] px-3 py-1.5 text-xs font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Protected identity
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Anonymous student voice</p>
            </div>

            {linkToDetail ? (
              <div className="hidden items-center gap-1 text-sm font-semibold text-primary sm:inline-flex">
                Read post
                <ArrowUpRight className="h-4 w-4" />
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleLike}
              disabled={isLiking || liked}
              className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                liked
                  ? "bg-accent/10 text-accent hover:bg-accent/15"
                  : "bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${isLiking ? "animate-pulse" : ""} ${
                  liked ? "fill-accent text-accent" : ""
                }`}
              />
              {post.likeCount}
            </button>

            <div className="flex items-center gap-2 rounded-full bg-secondary/80 px-3.5 py-2 text-sm font-semibold text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              {post.commentCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (linkToDetail) {
    return (
      <Link href={`/posts/${post.id}`} className="block h-full outline-none focus-visible:ring-4 focus-visible:ring-accent/50 rounded-2xl group">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
