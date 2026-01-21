import { useState, useEffect } from "react";
import { Loader2, Bookmark, Film } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MovieCard } from "@/components/movies/MovieCard";
import { MovieModal } from "@/components/movies/MovieModal";
import { userService } from "@/services/user";
import { Movie } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Watchlist() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const watchlist = await userService.getWatchlist();
        setMovies(watchlist);
      } catch {
        toast({
          title: "Failed to load watchlist",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, [toast]);

  // Refresh when modal closes (in case item was removed)
  const handleModalClose = async () => {
    setSelectedMovie(null);
    const watchlist = await userService.getWatchlist();
    setMovies(watchlist);
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

  return (
    <MainLayout>
      <div className="pt-24 px-4 sm:px-8 lg:px-12 min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Bookmark className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My List</h1>
        </div>

        {/* Content */}
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-12">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onInfoClick={() => setSelectedMovie(movie)}
                className="w-full"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Film className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your list is empty</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Browse movies and add them to your list to watch later.
            </p>
            <Link to="/browse">
              <Button>Browse Movies</Button>
            </Link>
          </div>
        )}

        {/* Movie Modal */}
        <MovieModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={handleModalClose}
        />
      </div>
    </MainLayout>
  );
}
