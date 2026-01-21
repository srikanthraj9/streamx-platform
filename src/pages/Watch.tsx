import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { VideoPlayer } from "@/components/movies/VideoPlayer";
import { moviesService } from "@/services/movies";
import { Movie, StreamData } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Watch() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [movieData, stream] = await Promise.all([
          moviesService.getMovieById(id),
          moviesService.getStreamData(id),
        ]);
        setMovie(movieData);
        setStreamData(stream);
      } catch {
        toast({
          title: "Unable to play video",
          description: "Please try again later",
          variant: "destructive",
        });
        navigate("/browse");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, toast]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!movie || !streamData) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black">
      <VideoPlayer movie={movie} streamData={streamData} />
    </div>
  );
}
