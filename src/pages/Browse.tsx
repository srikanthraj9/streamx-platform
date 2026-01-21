import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { HeroBanner } from "@/components/movies/HeroBanner";
import { MovieRow } from "@/components/movies/MovieRow";
import { MovieModal } from "@/components/movies/MovieModal";
import { moviesService } from "@/services/movies";
import { HomePageData, Movie } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Browse() {
  const [data, setData] = useState<HomePageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeData = await moviesService.getHomePageData();
        setData(homeData);
      } catch {
        toast({
          title: "Error loading content",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Failed to load content</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Banner */}
      <HeroBanner
        movie={data.featured}
        onInfoClick={() => setSelectedMovie(data.featured)}
      />

      {/* Movie Rows */}
      <div className="-mt-32 relative z-10 pb-8">
        {data.categories.map((category) => (
          <MovieRow
            key={category.id}
            title={category.name}
            movies={category.movies}
            onMovieClick={(movie) => setSelectedMovie(movie)}
          />
        ))}
      </div>

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </MainLayout>
  );
}
