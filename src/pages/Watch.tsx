import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { VideoPlayer } from "@/components/movies/VideoPlayer";
import { moviesService } from "@/services/movies";
import { Movie, StreamData } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Watch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!id) {
        setIsLoading(false);
        navigate("/browse");
        return;
      }

      try {
        setIsLoading(true);

        const [movieData, stream] = await Promise.all([
          moviesService.getMovieById(id),
          moviesService.getStreamData(id),
        ]);

        if (!isMounted) return;

        setMovie(movieData);
        setStreamData(stream);
      } catch (err) {
        console.error("Watch page error:", err);

        toast({
          title: "Unable to play video",
          description: "Please try again later",
          variant: "destructive",
        });

        navigate("/browse");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, navigate, toast]);

  // ✅ Loading UI
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // ✅ Safety guard
  if (!movie || !streamData) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black">
      <VideoPlayer movie={movie} streamData={streamData} />
    </div>
  );
}
