import { useState, useEffect } from "react";
import { X, Play, Plus, Check, ThumbsUp, Share2 } from "lucide-react";
import { Movie } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/user";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieModal({ movie, isOpen, onClose }: MovieModalProps) {
  const [isInList, setIsInList] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (movie) {
      setIsInList(userService.isInWatchlist(movie.id));
    }
  }, [movie]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  const handlePlay = () => {
    onClose();
    navigate(`/watch/${movie.id}`);
  };

  const handleToggleWatchlist = async () => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl mx-4 mb-8 rounded-lg overflow-hidden bg-card shadow-2xl animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Backdrop Image */}
        <div className="relative aspect-video">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={handlePlay}
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 glow-red gap-2"
            >
              <Play className="h-6 w-6 fill-current" />
              Play
            </Button>
          </div>

          {/* Title at Bottom */}
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-2xl sm:text-3xl font-bold">{movie.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              onClick={handlePlay}
              className="bg-foreground text-background hover:bg-foreground/90 gap-2"
            >
              <Play className="h-4 w-4 fill-current" />
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
              {isInList ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </button>
            <button className="p-3 rounded-full border-2 border-muted-foreground/50 hover:border-foreground transition-colors">
              <ThumbsUp className="h-5 w-5" />
            </button>
            <button className="p-3 rounded-full border-2 border-muted-foreground/50 hover:border-foreground transition-colors ml-auto">
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
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

          {/* Description */}
          <p className="text-muted-foreground mb-6">{movie.description}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Genres: </span>
              <span>{movie.genres.join(", ")}</span>
            </div>
            {movie.cast && (
              <div>
                <span className="text-muted-foreground">Cast: </span>
                <span>{movie.cast.join(", ")}</span>
              </div>
            )}
            {movie.director && (
              <div>
                <span className="text-muted-foreground">Director: </span>
                <span>{movie.director}</span>
              </div>
            )}
            {movie.language && (
              <div>
                <span className="text-muted-foreground">Language: </span>
                <span>{movie.language}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
