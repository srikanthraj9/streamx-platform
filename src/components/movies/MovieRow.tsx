import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/types";
import { MovieCard } from "./MovieCard";
import { cn } from "@/lib/utils";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export function MovieRow({ title, movies, onMovieClick }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!movies.length) return null;

  return (
    <div className="relative group/row py-4">
      {/* Title */}
      <h2 className="text-lg sm:text-xl font-semibold mb-3 px-4 sm:px-8 lg:px-12">
        {title}
      </h2>

      {/* Row Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center",
            "bg-gradient-to-r from-background to-transparent",
            "opacity-0 group-hover/row:opacity-100 transition-opacity duration-300",
            !showLeftArrow && "hidden"
          )}
        >
          <ChevronLeft className="h-8 w-8 text-foreground" />
        </button>

        {/* Movies Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="movie-row-scroll px-4 sm:px-8 lg:px-12"
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onInfoClick={onMovieClick ? () => onMovieClick(movie) : undefined}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center",
            "bg-gradient-to-l from-background to-transparent",
            "opacity-0 group-hover/row:opacity-100 transition-opacity duration-300",
            !showRightArrow && "hidden"
          )}
        >
          <ChevronRight className="h-8 w-8 text-foreground" />
        </button>
      </div>
    </div>
  );
}
