import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Plus, Check, ThumbsUp, Share2, Loader2 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { moviesService } from "@/services/movies";
import { userService } from "@/services/user";
import { Movie } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInList, setIsInList] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        const movieData = await moviesService.getMovieById(id);
        setMovie(movieData);
        setIsInList(userService.isInWatchlist(id));
      } catch {
        toast({
          title: "Movie not found",
          variant: "destructive",
        });
        navigate("/browse");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id, navigate, toast]);

  const handleToggleWatchlist = async () => {
    if (!movie) return;

    try {
      if (isInList) {
        await userService.removeFromWatchlist(movie.id);
        setIsInList(false);
        toast({ title: "Removed from My List" });
      } else {
        await userService.addToWatchlist(movie);
        setIsInList(true);
        toast({ title: "Added to My List" });
      }
    } catch {
      toast({ title: "Error updating list", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!movie) return null;

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex items-end">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 hero-gradient-bottom" />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 sm:left-8 z-10 flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        {/* Content */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 pb-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              {movie.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
              <span className="text-green-500 font-semibold">
                {Math.round(movie.rating * 10)}% Match
              </span>
              <span className="text-muted-foreground">{movie.releaseYear}</span>
              <span className="px-1.5 py-0.5 border border-muted-foreground/50 text-xs">
                {movie.maturityRating || "PG-13"}
              </span>
              <span className="text-muted-foreground">{movie.duration} min</span>
              <span className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">
                HD
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 text-sm rounded-full bg-muted/50 text-muted-foreground"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                onClick={() => navigate(`/watch/${movie.id}`)}
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 glow-red-sm gap-2"
              >
                <Play className="h-5 w-5 fill-current" />
                Play
              </Button>
              <button
                onClick={handleToggleWatchlist}
                className={cn(
                  "p-3 rounded-full border-2 transition-colors",
                  isInList
                    ? "border-foreground bg-foreground/10"
                    : "border-muted-foreground/50 hover:border-foreground"
                )}
              >
                {isInList ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
              </button>
              <button className="p-3 rounded-full border-2 border-muted-foreground/50 hover:border-foreground transition-colors">
                <ThumbsUp className="h-6 w-6" />
              </button>
              <button className="p-3 rounded-full border-2 border-muted-foreground/50 hover:border-foreground transition-colors">
                <Share2 className="h-6 w-6" />
              </button>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-2xl">
              {movie.description}
            </p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-4 sm:px-8 lg:px-12 py-12">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-semibold mb-6">Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {movie.director && (
              <div>
                <span className="text-muted-foreground">Director: </span>
                <span>{movie.director}</span>
              </div>
            )}
            {movie.cast && (
              <div>
                <span className="text-muted-foreground">Cast: </span>
                <span>{movie.cast.join(", ")}</span>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Genres: </span>
              <span>{movie.genres.join(", ")}</span>
            </div>
            {movie.language && (
              <div>
                <span className="text-muted-foreground">Language: </span>
                <span>{movie.language}</span>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Release Year: </span>
              <span>{movie.releaseYear}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Runtime: </span>
              <span>{movie.duration} minutes</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
