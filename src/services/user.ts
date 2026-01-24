import { API_ENDPOINTS } from "@/config";
import { api } from "./api";
import { Movie, User, WatchHistoryItem, WatchProgress } from "@/types";

export const userService = {
  // ✅ User Profile
  async getProfile(): Promise<User> {
    return api.get<User>(API_ENDPOINTS.USER.ME);
  },

  // ✅ Watchlist
  async getWatchlist(): Promise<Movie[]> {
    return api.get<Movie[]>(API_ENDPOINTS.USER.WATCHLIST);
  },

  async addToWatchlist(movie: Movie): Promise<void> {
    await api.post(API_ENDPOINTS.USER.WATCHLIST_ITEM(movie.id));
  },

  async removeFromWatchlist(movieId: string): Promise<void> {
    await api.delete(API_ENDPOINTS.USER.WATCHLIST_ITEM(movieId));
  },

  // ✅ Watchlist check (backend)
  async isInWatchlist(movieId: string): Promise<boolean> {
    const list = await api.get<Movie[]>(API_ENDPOINTS.USER.WATCHLIST);
    return list.some((m) => m.id === movieId);
  },

  // ✅ Watch history
  async getWatchHistory(): Promise<WatchHistoryItem[]> {
    return api.get<WatchHistoryItem[]>(API_ENDPOINTS.USER.HISTORY);
  },

  // ✅ Watch progress update
  async updateWatchProgress(progress: WatchProgress): Promise<void> {
    await api.post(API_ENDPOINTS.USER.HISTORY_PROGRESS, progress);
  },
};
