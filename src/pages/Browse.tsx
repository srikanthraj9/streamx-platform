import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";
import { HeroBanner } from "@/components/movies/HeroBanner";
import { MovieRow } from "@/components/movies/MovieRow";
import { MovieModal } from "@/components/movies/MovieModal";

import { moviesService } from "@/services/movies";
import { Movie } from "@/types";
import { useToast } from "@/hooks/use-toast";

type CategoryRow = {
  id: string;
  name: string;
  movies: Movie[];
};

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Browse() {
  const { toast } = useToast();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [featured, setFeatured] = useState<Movie | null>(null);
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const homeData = await moviesService.getHomePageData();

        // ✅ Backend returns: { featured, rows }
        const featuredMovie: Movie | null = (homeData as any)?.featured || null;
        const backendRows = (homeData as any)?.rows || [];

        // ✅ Convert backend rows -> frontend CategoryRow format
        const parsedRows: CategoryRow[] = Array.isArray(backendRows)
          ? backendRows.map((r: any, idx: number) => ({
              id: `row-${idx}-${r?.title || "category"}`,
              name: r?.title || "Movies",
              movies: Array.isArray(r?.items) ? r.items : [],
            }))
          : [];

        // ✅ Flatten all movies (optional)
        const allMovies: Movie[] = parsedRows.flatMap((r) => r.movies);

        if (isMounted) {
          setFeatured(featuredMovie);
          setRows(parsedRows);
          setMovies(allMovies);
        }
      } catch (err: any) {
        console.error("Browse page load error:", err);

        toast({
          title: "Error loading content",
          description:
            err?.message || "Failed to load movies. Please try again later.",
          variant: "destructive",
        });

        if (isMounted) {
          setFeatured(null);
          setRows([]);
          setMovies([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMovies();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  // ✅ Featured movie (prefer backend featured)
  const featuredMovie = useMemo(() => {
    if (featured) return featured;
    if (!movies.length) return null;
    return shuffle(movies)[0];
  }, [featured, movies]);

  // ✅ Categories (use backend rows directly)
  const categories: CategoryRow[] = useMemo(() => {
    return rows;
  }, [rows]);

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
      {/* ✅ Hero Banner */}
      {featuredMovie ? (
        <HeroBanner
          movie={featuredMovie}
          onInfoClick={() => setSelectedMovie(featuredMovie)}
        />
      ) : (
        <div className="pt-28 pb-12 text-center text-muted-foreground">
          No movies available
        </div>
      )}

      {/* ✅ Movie Rows */}
      <div className="-mt-32 relative z-10 pb-8">
        {categories.length > 0 ? (
          categories.map((category) => (
            <MovieRow
              key={category.id}
              title={category.name}
              movies={category.movies}
              onMovieClick={(movie) => setSelectedMovie(movie)}
            />
          ))
        ) : (
          <div className="pt-20 text-center text-muted-foreground">
            No categories available
          </div>
        )}
      </div>

      {/* ✅ Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </MainLayout>
  );
}
