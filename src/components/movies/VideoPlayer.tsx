import { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  ArrowLeft,
  Settings,
} from "lucide-react";
import { StreamData, Movie } from "@/types";
import { cn } from "@/lib/utils";
import { userService } from "@/services/user";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";

interface VideoPlayerProps {
  movie: Movie;
  streamData: StreamData;
}

export function VideoPlayer({ movie, streamData }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressSaveInterval = useRef<NodeJS.Timeout | null>(null);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  const navigate = useNavigate();

  // Format time helper
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Save progress
  const saveProgress = useCallback(() => {
    if (videoRef.current && duration > 0) {
      userService.updateWatchProgress({
        movieId: movie.id,
        progressSeconds: Math.floor(currentTime),
        durationSeconds: Math.floor(duration),
      });
    }
  }, [movie.id, currentTime, duration]);

  // Auto-save progress every 10 seconds
  useEffect(() => {
    if (isPlaying) {
      progressSaveInterval.current = setInterval(saveProgress, 10000);
    }
    return () => {
      if (progressSaveInterval.current) {
        clearInterval(progressSaveInterval.current);
      }
    };
  }, [isPlaying, saveProgress]);

  // Save on unmount
  useEffect(() => {
    return () => {
      saveProgress();
    };
  }, [saveProgress]);

  // Controls visibility
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    if (isPlaying) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  // Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // Mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Volume
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // Seek
  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Skip
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(duration, videoRef.current.currentTime + seconds)
      );
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "ArrowLeft":
          skip(-10);
          break;
        case "ArrowRight":
          skip(10);
          break;
        case "Escape":
          if (isFullscreen) {
            document.exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={streamData.streamUrl}
        onClick={togglePlay}
        playsInline
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-between transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-background/80 to-transparent">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="text-lg font-medium">{movie.title}</span>
          </button>
        </div>

        {/* Center Play Button */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-background/30 hover:bg-background/50 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-12 w-12 fill-current" />
            ) : (
              <Play className="h-12 w-12 fill-current" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="p-4 bg-gradient-to-t from-background/80 to-transparent">
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="text-foreground hover:text-primary transition-colors">
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
              </button>

              {/* Skip Backward */}
              <button onClick={() => skip(-10)} className="text-foreground hover:text-primary transition-colors">
                <SkipBack className="h-6 w-6" />
              </button>

              {/* Skip Forward */}
              <button onClick={() => skip(10)} className="text-foreground hover:text-primary transition-colors">
                <SkipForward className="h-6 w-6" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="text-foreground hover:text-primary transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </button>
                <div className="w-24 hidden sm:block">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                  />
                </div>
              </div>

              {/* Time */}
              <span className="text-sm text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Settings */}
              <button className="text-foreground hover:text-primary transition-colors">
                <Settings className="h-6 w-6" />
              </button>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="text-foreground hover:text-primary transition-colors">
                {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
