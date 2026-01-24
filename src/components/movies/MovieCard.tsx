import React, { useMemo, useState } from "react";
import { Play, Plus, Check, Info } from "lucide-react";
import { Movie } from "@/types";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/user";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config";

interface MovieCardProps {
  movie: Movie;
  onInfoClick?: () => void;
  className?: string;
}

export function MovieCard({ movie, onInfoClick, className }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ Normalize backend data → frontend safe values
  const normalized = useMemo(() => {
    // ✅ ALWAYS use poster_url only (DON'T fallback to banner_url)
    let posterUrl =
      (movie as any).posterUrl ||
      (movie as any).poster_url ||
      "https://placehold.co/400x600?text=No+Image";

    // ✅ FIX: prefix backend uploads with API_BASE_URL
    if (typeof posterUrl === "string" && posterUrl.startsWith("/uploads")) {
      posterUrl = `${API_BASE_URL}${posterUrl}`;
    }

    const maturityRating =
      (movie as any).maturityRating || (movie as any).rating || "PG-13";

    const releaseYear =
      (movie as any).releaseYear || (movie as any).release_year || "";

    // ✅ backend gives genre:string but UI expects genres:string[]
    const genres: string[] =
      (movie as any).genres ??
      ((movie as any).genre ? [(movie as any).genre] : []);

    // ✅ match percent (fallback safe)
    const matchPercent =
      typeof (movie as any).match === "number"
        ? Math.round((movie as any).match)
        : typeof (movie as any).rating === "number"
          ? Math.round((movie as any).rating * 10)
          : 90;

    return { posterUrl, maturityRating, releaseYear, genres, matchPercent };
  }, [movie]);

  const [isInList, setIsInList] = useState(userService.isInWatchlist(movie.id));

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
    if (onInfoClick) onInfoClick();
    else navigate(`/movie/${movie.id}`);
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
          src={normalized.posterUrl}
          alt={movie.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-300",
            isHovered && "scale-105",
            isImageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageLoaded(true)} // ✅ FIX GREY PERMANENT ISSUE
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
              {isInList ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
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
            <span className="text-green-500 font-medium">
              {normalized.matchPercent}% Match
            </span>

            {normalized.releaseYear && <span>{normalized.releaseYear}</span>}

            <span className="px-1 border border-muted-foreground/50 text-[10px]">
              {normalized.maturityRating}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mt-1">
            {normalized.genres.slice(0, 2).length > 0 ? (
              normalized.genres.slice(0, 2).map((genre) => (
                <span key={genre} className="text-[10px] text-muted-foreground">
                  {genre}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-muted-foreground">Movie</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
