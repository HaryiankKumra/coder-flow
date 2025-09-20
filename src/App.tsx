import { useState, useEffect, Suspense, Component, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Replace eager page/component imports with lazy:
const Auth = lazy(() => import("./components/Auth"));
const Layout = lazy(() => import("./components/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Todo = lazy(() => import("./pages/Todo"));
const Timer = lazy(() => import("./pages/Timer"));
const LeetCode = lazy(() => import("./pages/LeetCode"));
const NotFound = lazy(() => import("./pages/NotFound"));

// ErrorBoundary to avoid white screens on runtime errors
class AppErrorBoundary extends Component<{ children?: any }, { hasError: boolean; error: any }> {
  constructor(props: { children?: any }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    console.error("App crash caught by ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || "Something went wrong.";
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white text-black">
          <div className="max-w-md w-full space-y-4 text-center">
            <h1 className="text-2xl font-bold">App Error</h1>
            <p className="text-sm text-gray-600 break-all">{msg}</p>
            <div className="flex gap-2 justify-center">
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={() => (window.location.href = window.location.origin)}
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children || null;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Simple loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Test database connection first
        const { error: connectionTestError } = await supabase
          .from('user_settings')
          .select('id')
          .limit(1);
        
        if (connectionTestError && !connectionTestError.message.includes('RLS')) {
          throw new Error(`Database connection failed: ${connectionTestError.message}`);
        }

        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn("Auth session error:", error.message);
        }
        
        setUser(session?.user || null);
        setConnectionError(null);

        // Subscribe to auth changes safely
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
        });
        
        return () => authListener.subscription.unsubscribe();
      } catch (e: any) {
        console.error("App initialization error:", e);
        setConnectionError(e.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const cleanup = init();
    return () => {
      if (cleanup instanceof Promise) {
        cleanup.then(fn => fn && fn());
      }
    };
  }, []);

  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white text-black">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-2xl font-bold">Connection Error</h1>
          <p className="text-sm text-gray-600 break-all">
            {connectionError}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white"
              onClick={() => (window.location.href = window.location.origin)}
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <AppErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <Toaster />
              <Sonner />
              <Auth onAuthChange={setUser} />
            </Suspense>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
      </AppErrorBoundary>
    );
  }

  return (
    <AppErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="todo" element={<Todo />} />
                    <Route path="timer" element={<Timer />} />
                    <Route path="leetcode" element={<LeetCode />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </Suspense>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
};

export default App;