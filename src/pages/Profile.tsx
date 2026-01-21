import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, LogOut, Settings, Bell, Shield, Loader2 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast({ title: "Logged out successfully" });
      navigate("/");
    } catch {
      toast({
        title: "Logout failed",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const settingsItems = [
    { icon: User, label: "Edit Profile", description: "Update your name and avatar" },
    { icon: Bell, label: "Notifications", description: "Manage notification preferences" },
    { icon: Shield, label: "Privacy & Security", description: "Password and security settings" },
    { icon: Settings, label: "Preferences", description: "Playback and display settings" },
  ];

  return (
    <MainLayout>
      <div className="pt-24 px-4 sm:px-8 lg:px-12 min-h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-muted text-2xl">
                {user.name?.charAt(0) || <User className="h-10 w-10" />}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
              <div className="flex flex-col sm:flex-row items-center gap-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {memberSince}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">Premium Plan</h2>
                <p className="text-sm text-muted-foreground">
                  4K Ultra HD • 4 screens • Downloads included
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </div>

          {/* Settings List */}
          <div className="space-y-2 mb-8">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            {settingsItems.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-4 p-4 rounded-lg bg-card hover:bg-stream-card-hover transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </>
            )}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
