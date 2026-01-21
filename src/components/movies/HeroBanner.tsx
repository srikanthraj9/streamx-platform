import { useState } from "react";
import { Play, Info, VolumeX, Volume2 } from "lucide-react";
import { Movie } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeroBannerProps {
  movie: Movie;
  onInfoClick?: () => void;
}

export function HeroBanner({ movie, onInfoClick }: HeroBannerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate(`/watch/${movie.id}`);
  };

  const handleInfo = () => {
    if (onInfoClick) {
      onInfoClick();
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  return (
    <div className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {!isImageLoaded && <div className="absolute inset-0 shimmer" />}
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isImageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsImageLoaded(true)}
        />
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
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <span className="text-green-500 font-semibold">{Math.round(movie.rating * 10)}% Match</span>
          <span>{movie.releaseYear}</span>
          <span className="px-1.5 py-0.5 border border-muted-foreground/50 text-xs">
            {movie.maturityRating || "PG-13"}
          </span>
          <span>{movie.duration} min</span>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 mb-6 max-w-xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {movie.description}
        </p>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {movie.genres.map((genre) => (
            <span
              key={genre}
              className="px-3 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: "0.4s" }}>
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
          {movie.maturityRating || "PG-13"}
        </span>
      </div>
    </div>
  );
}
