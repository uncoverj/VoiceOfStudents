import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const Home = lazy(() => import("@/pages/home"));
const CreatePost = lazy(() => import("@/pages/create-post"));
const PostDetail = lazy(() => import("@/pages/post-detail"));
const AdminDashboard = lazy(() => import("@/pages/admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function Router() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/create">
          <CreatePost />
        </Route>
        <Route path="/posts/:id">
          <PostDetail />
        </Route>
        <Route path="/admin">
          <AdminDashboard />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Suspense>
  );
}

function RouteLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="glass-panel flex flex-col items-center gap-4 rounded-[2rem] px-8 py-10 text-center">
        <div className="h-12 w-12 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Loading route</p>
          <p className="mt-2 text-lg font-semibold text-foreground">Preparing the next screen</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
