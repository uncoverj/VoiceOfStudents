import { Link } from "wouter";
import { Heart, MessageCircle, Clock } from "lucide-react";
import { Post } from "@workspace/api-client-react";
import { formatDistanceToNow } from "date-fns";
import { useLikePost } from "@/hooks/use-posts";

export function PostCard({ post, linkToDetail = true }: { post: Post, linkToDetail?: boolean }) {
  const { mutate: likePost, isPending: isLiking } = useLikePost();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLiking) {
      likePost({ id: post.id });
    }
  };

  const CardContent = (
    <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-sm border border-border/60 hover:shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col h-full relative group hover-elevate overflow-visible">
      <div className="flex justify-between items-start mb-4 gap-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-secondary text-secondary-foreground border border-border">
          {post.category}
        </span>
        <div className="flex items-center text-xs text-muted-foreground gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5" />
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </div>
      </div>
      
      <h3 className="text-xl font-display font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
        {post.title}
      </h3>
      
      <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
        {post.content}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <div className="w-7 h-7 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
            <span className="text-[12px]">🕵️</span>
          </div>
          <span className="opacity-90">Anonymous</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 transition-all duration-200 px-2.5 py-1.5 rounded-lg active:scale-95 ${
              post.likeCount > 0 
                ? "text-accent-foreground bg-accent/5 hover:bg-accent/10" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiking ? 'animate-pulse' : ''} ${post.likeCount > 0 ? 'fill-accent-foreground text-accent-foreground' : ''}`} />
            <span className="text-sm font-bold">{post.likeCount}</span>
          </button>
          
          <div className="flex items-center gap-1.5 text-muted-foreground px-2.5 py-1.5 rounded-lg hover:bg-secondary transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-bold">{post.commentCount}</span>
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
