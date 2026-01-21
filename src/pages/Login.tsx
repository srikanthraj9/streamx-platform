import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { APP_NAME } from "@/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/browse";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      toast({ title: "Welcome back!" });
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Invalid email or password";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/90 z-10" />
        <img
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Logo */}
      <Link
        to="/"
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20"
      >
        <span className="text-3xl font-bold text-gradient">{APP_NAME}</span>
      </Link>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 sm:p-10 rounded-xl glass-card">
        <h1 className="text-3xl font-bold mb-2">Sign In</h1>
        <p className="text-muted-foreground mb-8">
          Welcome back! Sign in to continue watching.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-muted/50 border-muted-foreground/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-muted/50 border-muted-foreground/30 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 glow-red-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
          <p className="text-sm text-muted-foreground">
            <strong>Demo credentials:</strong>
            <br />
            Email: demo@streamx.com
            <br />
            Password: demo123
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            New to {APP_NAME}?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
