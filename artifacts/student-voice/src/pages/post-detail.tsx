import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { usePost, useLikePost, useCreateComment } from "@/hooks/use-posts";
import { ArrowLeft, Clock, Heart, MessageCircle, Share2, Send, AlertCircle } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-8 w-32 bg-secondary rounded-lg mb-8"></div>
          <div className="bg-card rounded-3xl p-8 mb-8 border border-border shadow-sm">
            <div className="h-12 w-3/4 bg-secondary rounded-xl mb-8"></div>
            <div className="h-4 w-full bg-secondary rounded mb-4"></div>
            <div className="h-4 w-full bg-secondary rounded mb-4"></div>
            <div className="h-4 w-2/3 bg-secondary rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-3xl shadow-sm border border-border max-w-3xl mx-auto">
          <AlertCircle className="w-16 h-16 text-destructive mb-6" />
          <h3 className="text-2xl font-bold text-foreground">Post not found</h3>
          <p className="text-muted-foreground mt-2 mb-6">This post may have been removed or doesn't exist.</p>
          <Link href="/" className="text-primary-foreground bg-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all hover-elevate">
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
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground font-semibold hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Feed
        </Link>

        {/* POST CONTENT */}
        <div className="bg-card rounded-3xl p-6 sm:p-10 shadow-md border border-border mb-8">
          <div className="flex items-center justify-between mb-8">
            <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-accent/20 text-accent-foreground border border-accent/20">
              {post.category}
            </span>
            <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4" />
              {format(new Date(post.createdAt), 'MMM d, yyyy • h:mm a')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed mb-12">
            {post.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>

          {/* AUTHOR & ACTIONS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="text-xl">🕵️</span>
              </div>
              <div>
                <div className="font-bold text-foreground text-lg leading-none mb-1">Anonymous Student</div>
                <div className="text-sm font-semibold text-muted-foreground">Original Poster</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all duration-200 ${
                  post.likeCount > 0 
                    ? "bg-accent/15 hover:bg-accent/25 text-accent-foreground border border-accent/20" 
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiking ? 'animate-pulse' : ''} ${post.likeCount > 0 ? 'fill-accent-foreground text-accent-foreground' : ''}`} />
                {post.likeCount} Likes
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* COMMENTS SECTION */}
        <div className="bg-card rounded-3xl p-6 sm:p-10 shadow-md border border-border" id="comments">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground">
              Comments ({post.comments?.length || 0})
            </h3>
          </div>

          <form onSubmit={submitComment} className="mb-12 flex gap-3 relative">
            <div className="flex-1">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add an anonymous comment..."
                className="w-full px-6 py-4 rounded-2xl bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={!commentText.trim() || isCommenting}
              className="bg-primary text-primary-foreground px-6 sm:px-8 rounded-2xl font-bold shadow-lg hover:bg-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 border border-primary-foreground/10"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Post</span>
            </button>
          </form>

          <div className="space-y-6">
            {post.comments?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-secondary/50 rounded-2xl border-2 border-dashed border-border">
                <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="font-medium text-lg text-foreground">No comments yet</p>
                <p>Be the first to share your thoughts!</p>
              </div>
            ) : (
              post.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-5 rounded-2xl bg-background border border-border hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center border border-border">
                    <span className="text-lg">💬</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                      <span className="font-bold text-foreground text-base">Anonymous Student</span>
                      <span className="text-sm font-medium text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-foreground/90 text-base leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
