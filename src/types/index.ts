// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

// Movie Types
export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  releaseYear: number;
  duration: number; // in minutes
  rating: number;
  genres: string[];
  cast?: string[];
  director?: string;
  language?: string;
  maturityRating?: string;
  trailerUrl?: string;
}

export interface MovieCategory {
  id: string;
  name: string;
  movies: Movie[];
}

export interface HomePageData {
  featured: Movie;
  categories: MovieCategory[];
}

export interface StreamData {
  type: "hls" | "mp4";
  streamUrl: string;
  fallbackUrl?: string;
}

export interface WatchProgress {
  movieId: string;
  progressSeconds: number;
  durationSeconds: number;
}

export interface WatchHistoryItem {
  movie: Movie;
  progressSeconds: number;
  durationSeconds: number;
  lastWatchedAt: string;
}

// Search Types
export interface SearchFilters {
  genre?: string;
  year?: number;
  language?: string;
}

export interface SearchParams {
  query: string;
  filters?: SearchFilters;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
