import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ui/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Browse from "./pages/Browse";
import MovieDetails from "./pages/MovieDetails";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import Watchlist from "./pages/Watchlist";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// ✅ Admin Page
import AdminUpload from "./pages/AdminUpload";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* ✅ FIX: React Router Future Flags (removes warnings) */}
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ✅ Protected Routes */}
            <Route
              path="/browse"
              element={
                <ProtectedRoute>
                  <Browse />
                </ProtectedRoute>
              }
            />

            <Route
              path="/movie/:id"
              element={
                <ProtectedRoute>
                  <MovieDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/watch/:id"
              element={
                <ProtectedRoute>
                  <Watch />
                </ProtectedRoute>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />

            <Route
              path="/watchlist"
              element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* ✅ Admin Upload (Netflix Studio style) */}
            <Route
              path="/admin/upload"
              element={
                <ProtectedRoute>
                  <AdminUpload />
                </ProtectedRoute>
              }
            />

            {/* ✅ Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
