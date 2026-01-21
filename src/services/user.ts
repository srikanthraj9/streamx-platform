import { API_ENDPOINTS } from "@/config";
import { api } from "./api";
import { Movie, User, WatchHistoryItem, WatchProgress } from "@/types";

// Mock data for development
let MOCK_WATCHLIST: Movie[] = [];
let MOCK_HISTORY: WatchHistoryItem[] = [];

const USE_MOCK = true;

export const userService = {
  async getProfile(): Promise<User> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const storedUser = localStorage.getItem("streamx_user");
      if (storedUser) return JSON.parse(storedUser);
      throw { message: "User not found", statusCode: 404 };
    }

    return api.get<User>(API_ENDPOINTS.USER.ME);
  },

  async getWatchlist(): Promise<Movie[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_WATCHLIST;
    }

    return api.get<Movie[]>(API_ENDPOINTS.USER.WATCHLIST);
  },

  async addToWatchlist(movie: Movie): Promise<void> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (!MOCK_WATCHLIST.find((m) => m.id === movie.id)) {
        MOCK_WATCHLIST.push(movie);
      }
      return;
    }

    await api.post(API_ENDPOINTS.USER.WATCHLIST_ITEM(movie.id));
  },

  async removeFromWatchlist(movieId: string): Promise<void> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      MOCK_WATCHLIST = MOCK_WATCHLIST.filter((m) => m.id !== movieId);
      return;
    }

    await api.delete(API_ENDPOINTS.USER.WATCHLIST_ITEM(movieId));
  },

  isInWatchlist(movieId: string): boolean {
    return MOCK_WATCHLIST.some((m) => m.id === movieId);
  },

  async getWatchHistory(): Promise<WatchHistoryItem[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_HISTORY;
    }

    return api.get<WatchHistoryItem[]>(API_ENDPOINTS.USER.HISTORY);
  },

  async updateWatchProgress(progress: WatchProgress): Promise<void> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      const existingIndex = MOCK_HISTORY.findIndex(
        (h) => h.movie.id === progress.movieId
      );
      
      // We'd need the movie data here - in real app, this comes from server
      if (existingIndex >= 0) {
        MOCK_HISTORY[existingIndex].progressSeconds = progress.progressSeconds;
        MOCK_HISTORY[existingIndex].durationSeconds = progress.durationSeconds;
        MOCK_HISTORY[existingIndex].lastWatchedAt = new Date().toISOString();
      }
      return;
    }

    await api.post(API_ENDPOINTS.USER.HISTORY_PROGRESS, progress);
  },
};
