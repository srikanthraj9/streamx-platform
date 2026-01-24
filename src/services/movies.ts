import { API_ENDPOINTS, API_BASE_URL } from "@/config";
import { api } from "./api";
import { HomePageData, Movie, SearchParams, StreamData } from "@/types";

export const moviesService = {
  // ✅ Home Page Data
  async getHomePageData(): Promise<HomePageData> {
    return api.get<HomePageData>(API_ENDPOINTS.MOVIES.HOME);
  },

  // ✅ Movie Details
  async getMovieById(id: string): Promise<Movie> {
    return api.get<Movie>(API_ENDPOINTS.MOVIES.DETAIL(id));
  },

  // ✅ Search Movies
  async searchMovies(params: SearchParams): Promise<Movie[]> {
    const searchParams: Record<string, string> = {};

    if (params.query && params.query.trim().length > 0) {
      searchParams.q = params.query.trim();
    } else {
      searchParams.q = "";
    }

    if (params.filters?.genre) searchParams.genre = params.filters.genre;
    if (params.filters?.year) searchParams.year = String(params.filters.year);
    if (params.filters?.language)
      searchParams.language = params.filters.language;

    return api.get<Movie[]>(API_ENDPOINTS.MOVIES.SEARCH, searchParams);
  },

  // ✅ Stream Data (FIXED HERE)
  async getStreamData(movieId: string): Promise<StreamData> {
    const data = await api.get<StreamData>(
      API_ENDPOINTS.MOVIES.STREAM(movieId)
    );

    // ✅ Normalize backend relative paths → absolute URLs
    if (data.streamUrl?.startsWith("/uploads")) {
      data.streamUrl = `${API_BASE_URL}${data.streamUrl}`;
    }

    if (data.fallbackUrl?.startsWith("/uploads")) {
      data.fallbackUrl = `${API_BASE_URL}${data.fallbackUrl}`;
    }

    return data;
  },

  // ✅ Optional helper: Fetch genres list
  async getAllGenres(): Promise<string[]> {
    const movies = await api.get<Movie[]>(API_ENDPOINTS.MOVIES.SEARCH, {
      q: "",
    });

    const genres = new Set<string>();
    movies.forEach((m) => m.genres?.forEach((g) => genres.add(g)));

    return Array.from(genres).sort();
  },

  // ✅ Optional helper: Fetch years list
  async getAllYears(): Promise<number[]> {
    const movies = await api.get<Movie[]>(API_ENDPOINTS.MOVIES.SEARCH, {
      q: "",
    });

    const years = new Set<number>();
    movies.forEach((m) => {
      if (m.releaseYear) years.add(m.releaseYear);
    });

    return Array.from(years).sort((a, b) => b - a);
  },
};
