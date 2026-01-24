import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { API_BASE_URL, STORAGE_KEYS } from "@/config";
import { useToast } from "@/hooks/use-toast";

export default function AdminUpload() {
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("Action");
  const [releaseYear, setReleaseYear] = useState<number>(2025);
  const [durationSeconds, setDurationSeconds] = useState<number>(6000);
  const [rating, setRating] = useState("PG-13");

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const uploadFile = async (endpoint: string, file: File) => {
    const form = new FormData();
    form.append("file", file);

    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      body: form,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail || "Upload failed");
    }

    return res.json() as Promise<{ url: string }>;
  };

  const handlePublish = async () => {
    if (!posterFile || !bannerFile || !videoFile) {
      toast({
        title: "Missing files",
        description: "Upload poster, banner, and video",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Enter movie title",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // ✅ Upload poster/banner/video
      const poster = await uploadFile("/admin/upload/poster", posterFile);
      const banner = await uploadFile("/admin/upload/banner", bannerFile);
      const video = await uploadFile("/admin/upload/video", videoFile);

      // ✅ Save movie in DB
      const payload = {
        title,
        description,
        genre,
        release_year: releaseYear,
        duration_seconds: durationSeconds,
        rating,
        poster_url: poster.url,
        banner_url: banner.url,
        stream_url: video.url,
      };

      await api.post("/admin/movies", payload);

      toast({
        title: "Movie uploaded ✅",
        description: "Now it will appear in Browse page.",
      });

      setTitle("");
      setDescription("");
      setPosterFile(null);
      setBannerFile(null);
      setVideoFile(null);
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err?.message || "Error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-10">
        <h1 className="text-3xl font-bold mb-2">Netflix Studio Upload 🎬</h1>
        <p className="text-muted-foreground mb-8">
          Upload a new movie (admin only)
        </p>

        <div className="grid gap-4">
          <input
            className="p-3 rounded bg-muted"
            placeholder="Movie title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="p-3 rounded bg-muted"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              className="p-3 rounded bg-muted"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
            <input
              className="p-3 rounded bg-muted"
              placeholder="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              className="p-3 rounded bg-muted"
              placeholder="Release Year"
              value={releaseYear}
              onChange={(e) => setReleaseYear(Number(e.target.value))}
            />
            <input
              type="number"
              className="p-3 rounded bg-muted"
              placeholder="Duration Seconds"
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(Number(e.target.value))}
            />
          </div>

          <div className="grid gap-4 pt-4">
            <label className="text-sm">Poster Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
            />

            <label className="text-sm">Banner Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
            />

            <label className="text-sm">Movie Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            />
          </div>

          <Button disabled={loading} onClick={handlePublish} className="mt-4">
            {loading ? "Publishing..." : "Publish Movie"}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
