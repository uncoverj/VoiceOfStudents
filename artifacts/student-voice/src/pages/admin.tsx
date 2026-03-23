import { Layout } from "@/components/layout";
import { useAdminStats } from "@/hooks/use-admin";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { MessageSquare, Heart, TrendingUp, AlertCircle, FileText, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8">
          <div className="h-12 w-64 bg-secondary rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-40 bg-secondary rounded-3xl"></div>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[400px] bg-secondary rounded-3xl"></div>
            <div className="h-[400px] bg-secondary rounded-3xl"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !stats) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-3xl shadow-sm border border-border">
          <AlertCircle className="w-16 h-16 text-destructive mb-6" />
          <h3 className="text-2xl font-bold text-foreground">Failed to load admin stats</h3>
          <p className="text-muted-foreground mt-2 text-lg">Could not connect to the server.</p>
        </div>
      </Layout>
    );
  }

  // Modern vibrant colors for the chart matching the theme
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#10b981', '#f43f5e', '#8b5cf6'];

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-lg">Platform insights and community overview.</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-card p-8 rounded-3xl border border-border shadow-md relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
          <div className="flex items-center gap-5 mb-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-sm">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Posts</p>
              <h3 className="text-4xl font-display font-bold text-foreground">{stats.totalPosts}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-8 rounded-3xl border border-border shadow-md relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors"></div>
          <div className="flex items-center gap-5 mb-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 text-accent-foreground flex items-center justify-center border border-accent/30 shadow-sm">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Categories</p>
              <h3 className="text-4xl font-display font-bold text-foreground">{stats.postsByCategory.length}</h3>
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground relative z-10">Active topic sections</p>
        </div>

        <div className="bg-card p-8 rounded-3xl border border-border shadow-md relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors"></div>
          <div className="flex items-center gap-5 mb-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 shadow-sm">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Likes</p>
              <h3 className="text-4xl font-display font-bold text-foreground">
                {stats.mostLikedPosts.reduce((acc, p) => acc + p.likeCount, 0)}+
              </h3>
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground relative z-10">From top engaging posts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* CHART */}
        <div className="lg:col-span-2 bg-card p-8 rounded-3xl border border-border shadow-md">
          <h3 className="text-2xl font-display font-bold text-foreground mb-8 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <TrendingUp className="w-6 h-6" />
            </div>
            Posts by Category
          </h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.postsByCategory} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13, fontWeight: 600 }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13, fontWeight: 600 }} 
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.5 }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderRadius: '16px', 
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    fontWeight: 'bold',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {stats.postsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP POSTS */}
        <div className="bg-card p-8 rounded-3xl border border-border shadow-md flex flex-col">
          <h3 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
              <Heart className="w-6 h-6" />
            </div>
            Most Liked
          </h3>
          <div className="space-y-4 flex-1">
            {stats.mostLikedPosts.map((post, i) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="block group">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent-foreground font-black flex items-center justify-center flex-shrink-0 text-lg border border-accent/20">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground mt-2">
                      <span className="flex items-center gap-1.5 text-accent-foreground bg-accent/10 px-2 py-0.5 rounded-md">
                        <Heart className="w-3.5 h-3.5 fill-accent-foreground" /> {post.likeCount}
                      </span>
                      <span className="truncate">{post.category}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT POSTS TABLE */}
      <div className="bg-card rounded-3xl border border-border shadow-md overflow-hidden">
        <div className="p-8 border-b border-border bg-card/50">
          <h3 className="text-2xl font-display font-bold text-foreground">Recent Posts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary/40 text-muted-foreground font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-8 py-5">Title</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Engagement</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.recentPosts.map((post) => (
                <tr key={post.id} className="hover:bg-secondary/30 transition-colors group">
                  <td className="px-8 py-5 max-w-[300px]">
                    <Link href={`/posts/${post.id}`} className="font-bold text-base text-foreground group-hover:text-primary truncate block transition-colors">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-secondary text-secondary-foreground border border-border">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4 text-muted-foreground font-semibold">
                      <span className="flex items-center gap-1.5 text-accent-foreground"><Heart className="w-4 h-4 fill-accent-foreground/50" /> {post.likeCount}</span>
                      <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> {post.commentCount}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-muted-foreground font-medium text-sm">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <Link href={`/posts/${post.id}`} className="inline-flex items-center justify-center p-2 rounded-lg bg-background border border-border hover:border-primary hover:text-primary transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
