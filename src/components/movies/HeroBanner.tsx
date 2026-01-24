import { useMemo, useState } from "react";
import { Play, Info, VolumeX, Volume2 } from "lucide-react";
import { Movie } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/config";

interface HeroBannerProps {
  movie: Movie;
  onInfoClick?: () => void;
}

export function HeroBanner({ movie, onInfoClick }: HeroBannerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();

  // ✅ Safe normalize (backend -> frontend)
  const normalized = useMemo(() => {
    const base = API_BASE_URL.replace(/\/$/, ""); // ✅ remove trailing slash

    // ✅ backdrop/banner image
    let backdropUrl =
      (movie as any).backdropUrl ||
      (movie as any).bannerUrl ||
      (movie as any).banner_url ||
      (movie as any).posterUrl ||
      (movie as any).poster_url ||
      "";

    // ✅ prefix /uploads
    if (typeof backdropUrl === "string" && backdropUrl.startsWith("/uploads")) {
      backdropUrl = `${base}${backdropUrl}`;
    }

    // ✅ genres array
    const genres: string[] =
      (movie as any).genres ??
      ((movie as any).genre ? [(movie as any).genre] : []);

    // ✅ release year
    const releaseYear =
      (movie as any).releaseYear ?? (movie as any).release_year ?? "";

    // ✅ maturity rating
    const maturityRating =
      (movie as any).maturityRating || (movie as any).rating || "PG-13";

    // ✅ duration minutes
    const durationSeconds =
      (movie as any).durationSeconds ?? (movie as any).duration_seconds ?? null;

    const durationMin =
      typeof (movie as any).duration === "number"
        ? (movie as any).duration
        : typeof durationSeconds === "number"
          ? Math.max(1, Math.round(durationSeconds / 60))
          : "";

    // ✅ match percent
    const matchPercent =
      typeof (movie as any).match === "number"
        ? Math.round((movie as any).match)
        : typeof (movie as any).rating === "number"
          ? Math.round((movie as any).rating * 10)
          : 90;

    return {
      backdropUrl,
      genres,
      releaseYear,
      maturityRating,
      durationMin,
      matchPercent,
    };
  }, [movie]);

  const handlePlay = () => {
    navigate(`/watch/${movie.id}`);
  };

  const handleInfo = () => {
    if (onInfoClick) onInfoClick();
    else navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {!isImageLoaded && <div className="absolute inset-0 shimmer" />}

        {normalized.backdropUrl ? (
          <img
            src={normalized.backdropUrl}
            alt={movie.title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-500",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)} // ✅ avoid grey forever
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 hero-gradient-bottom" />

      {/* Content */}
      <div className="absolute bottom-[20%] left-0 right-0 px-4 sm:px-8 lg:px-12 max-w-3xl">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
          {movie.title}
        </h1>

        {/* Meta Info */}
        <div
          className="flex items-center gap-3 text-sm text-muted-foreground mb-4 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="text-green-500 font-semibold">
            {normalized.matchPercent}% Match
          </span>

          {normalized.releaseYear && <span>{normalized.releaseYear}</span>}

          <span className="px-1.5 py-0.5 border border-muted-foreground/50 text-xs">
            {normalized.maturityRating}
          </span>

          {normalized.durationMin && <span>{normalized.durationMin} min</span>}
        </div>

        {/* Description */}
        <p
          className="text-sm sm:text-base text-muted-foreground line-clamp-3 mb-6 max-w-xl animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          {movie.description}
        </p>

        {/* Genres */}
        <div
          className="flex flex-wrap gap-2 mb-6 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          {normalized.genres.length > 0 ? (
            normalized.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground"
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="px-3 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground">
              Movie
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className="flex items-center gap-3 animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Button
            onClick={handlePlay}
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 glow-red-sm gap-2"
          >
            <Play className="h-5 w-5 fill-current" />
            Play
          </Button>

          <Button
            onClick={handleInfo}
            variant="outline"
            size="lg"
            className="bg-muted/50 border-muted-foreground/30 hover:bg-muted gap-2"
          >
            <Info className="h-5 w-5" />
            More Info
          </Button>
        </div>
      </div>

      {/* Mute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-[20%] right-4 sm:right-8 lg:right-12 p-2 rounded-full border border-muted-foreground/50 text-foreground hover:bg-muted/50 transition-colors"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>

      {/* Maturity Rating Badge */}
      <div className="absolute bottom-[20%] right-4 sm:right-8 lg:right-12 translate-y-14 flex items-center gap-2">
        <span className="px-3 py-1 bg-muted/80 border-l-2 border-muted-foreground text-sm">
          {normalized.maturityRating}
        </span>
      </div>
    </div>
  );
}
