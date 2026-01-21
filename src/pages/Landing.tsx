import { Link } from "react-router-dom";
import { Play, ChevronRight, Monitor, Download, Users, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE } from "@/config";
import { Footer } from "@/components/layout/Footer";

export default function Landing() {
  const features = [
    {
      icon: Monitor,
      title: "Watch on any device",
      description: "Stream on your phone, tablet, laptop, and TV without paying more.",
    },
    {
      icon: Download,
      title: "Download and go",
      description: "Save your favorites and always have something to watch offline.",
    },
    {
      icon: Users,
      title: "Create profiles",
      description: "Create up to 5 profiles for different members of your household.",
    },
    {
      icon: Tv,
      title: "4K Ultra HD",
      description: "Enjoy stunning picture and sound quality with 4K Ultra HD streaming.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background z-10" />
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop"
            alt="Hero background"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <span className="text-3xl sm:text-4xl font-bold text-gradient">{APP_NAME}</span>
            <Link to="/login">
              <Button variant="outline" size="sm" className="bg-primary/10 border-primary/30 hover:bg-primary/20">
                Sign In
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
            {APP_TAGLINE}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Watch anywhere. Cancel anytime. Ready to watch? Enter your email to create or restart your membership.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-red gap-2 px-8">
                Get Started
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="gap-2 bg-muted/30 border-muted-foreground/30">
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stream-darker">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Why choose <span className="text-gradient">{APP_NAME}</span>?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience the best streaming platform with features designed for you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl glass-card hover:bg-stream-card-hover transition-all duration-300 fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Enjoy on your TV
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.
              </p>
              <Link to="/signup">
                <Button className="bg-primary hover:bg-primary/90 glow-red-sm gap-2">
                  Start watching
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden border border-border shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=450&fit=crop"
                  alt="TV streaming"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-primary/20 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stream-darker">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to start streaming?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join millions of viewers today. First month free, cancel anytime.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90 glow-red gap-2 px-12">
              Get Started
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
