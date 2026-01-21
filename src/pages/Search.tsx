import { useState, useEffect, useCallback } from "react";
import { Search as SearchIcon, X, Loader2, Film } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MovieCard } from "@/components/movies/MovieCard";
import { MovieModal } from "@/components/movies/MovieModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { moviesService } from "@/services/movies";
import { Movie, SearchFilters } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const { toast } = useToast();

  const genres = moviesService.getAllGenres();
  const years = moviesService.getAllYears();

  const searchMovies = useCallback(async () => {
    if (!query.trim() && !filters.genre && !filters.year) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const searchResults = await moviesService.searchMovies({
        query: query.trim(),
        filters,
      });
      setResults(searchResults);
    } catch {
      toast({
        title: "Search failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, toast]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchMovies();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchMovies]);

  const clearSearch = () => {
    setQuery("");
    setFilters({});
    setResults([]);
    setHasSearched(false);
  };

  return (
    <MainLayout>
      <div className="pt-24 px-4 sm:px-8 lg:px-12 min-h-screen">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-6">Search</h1>

          {/* Search Input */}
          <div className="relative mb-4">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search movies, TV shows, genres..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-10 py-6 text-lg bg-muted/50 border-muted-foreground/30"
            />
            {(query || filters.genre || filters.year) && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select
              value={filters.genre || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  genre: value === "all" ? undefined : value,
                }))
              }
            >
              <SelectTrigger className="w-40 bg-muted/50 border-muted-foreground/30">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.year?.toString() || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  year: value === "all" ? undefined : parseInt(value),
                }))
              }
            >
              <SelectTrigger className="w-32 bg-muted/50 border-muted-foreground/30">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="pb-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : hasSearched ? (
            results.length > 0 ? (
              <div>
                <p className="text-muted-foreground mb-6">
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {results.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onInfoClick={() => setSelectedMovie(movie)}
                      className="w-full"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Film className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No results found</h2>
                <p className="text-muted-foreground max-w-md">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Search for movies</h2>
              <p className="text-muted-foreground max-w-md">
                Enter a title, genre, or keyword to find your next favorite movie.
              </p>
            </div>
          )}
        </div>

        {/* Movie Modal */}
        <MovieModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      </div>
    </MainLayout>
  );
}
