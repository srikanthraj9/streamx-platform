import { useState } from "react";
import { Play, Plus, Check, Info } from "lucide-react";
import { Movie } from "@/types";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/user";
import { useToast } from "@/hooks/use-toast";

interface MovieCardProps {
  movie: Movie;
  onInfoClick?: () => void;
  className?: string;
}

export function MovieCard({ movie, onInfoClick, className }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInList, setIsInList] = useState(userService.isInWatchlist(movie.id));
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/watch/${movie.id}`);
  };

  const handleToggleWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInfoClick) {
      onInfoClick();
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  return (
    <div
      className={cn(
        "relative flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] rounded-md overflow-hidden cursor-pointer group",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleInfo}
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] bg-muted">
        {!isImageLoaded && <div className="absolute inset-0 shimmer" />}
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-300",
            isHovered && "scale-105",
            isImageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsImageLoaded(true)}
        />

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Hover Content */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-3 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {/* Action Buttons */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handlePlay}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              <Play className="h-4 w-4 fill-current" />
            </button>
            <button
              onClick={handleToggleWatchlist}
              className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-muted-foreground/50 hover:border-foreground text-foreground transition-colors"
            >
              {isInList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
            <button
              onClick={handleInfo}
              className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-muted-foreground/50 hover:border-foreground text-foreground transition-colors ml-auto"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>

          {/* Title & Info */}
          <h3 className="font-semibold text-sm line-clamp-1">{movie.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span className="text-green-500 font-medium">{Math.round(movie.rating * 10)}% Match</span>
            <span>{movie.releaseYear}</span>
            <span className="px-1 border border-muted-foreground/50 text-[10px]">
              {movie.maturityRating || "PG-13"}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {movie.genres.slice(0, 2).map((genre) => (
              <span key={genre} className="text-[10px] text-muted-foreground">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
