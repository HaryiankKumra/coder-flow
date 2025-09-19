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

const queryClient = new QueryClient();

// Minimal UI used in Safe Mode (?safe=1)
const SafeDashboard = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">CoderFlow (Safe Mode)</h1>
      <p className="text-gray-600 mb-6">App loaded without external integrations.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Status</h2>
          <ul className="text-sm text-gray-600 list-disc pl-5">
            <li>Router OK</li>
            <li>Tailwind OK</li>
            <li>Rendering OK</li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Next Steps</h2>
          <ul className="text-sm text-gray-600 list-disc pl-5">
            <li>Remove ?safe=1 to restore full app</li>
            <li>Check console for lazy import errors</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);
const SafeLayout = () => <SafeDashboard />;

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [appError, setAppError] = useState<Error | null>(null);

  // Detect Safe Mode (?safe=1)
  const safeMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("safe") === "1";

  useEffect(() => {
    // Surface unexpected errors instead of blank screen
    const onError = (e: ErrorEvent) => {
      console.error("Window error:", e.error || e.message);
      setAppError(e.error || new Error(e.message));
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      console.error("Unhandled rejection:", e.reason);
      setAppError(e.reason instanceof Error ? e.reason : new Error(String(e.reason)));
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  useEffect(() => {
    if (safeMode) {
      setLoading(false);
      setUser({ id: "safe-mode" }); // bypass auth in safe mode
      return;
    }

    let unsub: (() => void) | undefined;
    const init = async () => {
      // Timeout guard so we don’t hang forever on white screen
      const timeout = new Promise<never>((_, rej) =>
        setTimeout(() => rej(new Error("Auth init timeout")), 6000)
      );

      try {
        const sessionPromise = (async () => {
          try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            setUser(session?.user || null);
          } catch (e: any) {
            console.warn("getSession failed:", e?.message || e);
            setUser(null);
          } finally {
            setLoading(false);
          }
        })();

        await Promise.race([sessionPromise, timeout]);

        // Subscribe to auth changes safely
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
          setLoading(false);
        });
        unsub = () => data.subscription.unsubscribe();
      } catch (e: any) {
        console.error("Auth init error:", e);
        setAppError(e instanceof Error ? e : new Error(String(e)));
        setUser(null);
        setLoading(false);
      }
    };

    init();
    return () => unsub?.();
  }, [safeMode]);

  const enterDemoMode = () => {
    setAppError(null);
    setUser({ id: "demo-user", email: "demo@local" });
    setLoading(false);
  };

  if (appError && !safeMode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white text-black">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-2xl font-bold">Startup Error</h1>
          <p className="text-sm text-gray-600 break-all">
            {appError.message || "Unknown error"}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white"
              onClick={() => (window.location.href = window.location.origin)}
            >
              Reload
            </button>
            <button
              className="px-4 py-2 rounded bg-gray-800 text-white"
              onClick={enterDemoMode}
            >
              Continue in Demo Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Safe Mode: render known-good minimal UI without external deps
  if (safeMode) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<SafeLayout />} />
        </Routes>
      </BrowserRouter>
    );
  }

  if (!user) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }>
              <Toaster />
              <Sonner />
              <Auth onAuthChange={setUser} />
              <div className="text-center mt-6">
                <button
                  className="px-4 py-2 rounded bg-gray-800 text-white"
                  onClick={enterDemoMode}
                >
                  Try Demo Mode
                </button>
              </div>
            </Suspense>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return (
    <AppErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }>
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