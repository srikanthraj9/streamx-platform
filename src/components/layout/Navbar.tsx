import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, User, Menu, X, Bookmark, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { APP_NAME } from "@/config";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { href: "/browse", label: "Home" },
    { href: "/search", label: "Browse" },
    { href: "/watchlist", label: "My List" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "navbar-blur" : "bg-gradient-to-b from-background/80 to-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Nav Links */}
          <div className="flex items-center gap-8">
            <Link to="/browse" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gradient">{APP_NAME}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground",
                    location.pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <Link
              to="/search"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Notifications */}
            <button className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {user?.name?.charAt(0) || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass-card">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/watchlist" className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    My List
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden navbar-blur border-t border-border">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block text-base font-medium transition-colors",
                  location.pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
