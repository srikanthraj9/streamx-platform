// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// App Configuration
export const APP_NAME = "StreamX";
export const APP_TAGLINE = "Unlimited movies, TV shows, and more";

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "streamx_access_token",
  REFRESH_TOKEN: "streamx_refresh_token",
  USER: "streamx_user",
} as const;

// Route Paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  BROWSE: "/browse",
  MOVIE: "/movie/:id",
  WATCH: "/watch/:id",
  SEARCH: "/search",
  WATCHLIST: "/watchlist",
  PROFILE: "/profile",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  MOVIES: {
    HOME: "/movies/home",
    DETAIL: (id: string) => `/movies/${id}`,
    SEARCH: "/movies/search",
    STREAM: (id: string) => `/movies/${id}/stream`,
  },
  USER: {
    ME: "/user/me",
    WATCHLIST: "/user/watchlist",
    WATCHLIST_ITEM: (movieId: string) => `/user/watchlist/${movieId}`,
    HISTORY: "/user/history",
    HISTORY_PROGRESS: "/user/history/progress",
  },
} as const;
