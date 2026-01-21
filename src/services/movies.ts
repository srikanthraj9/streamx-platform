import { API_ENDPOINTS } from "@/config";
import { api } from "./api";
import { HomePageData, Movie, MovieCategory, SearchParams, StreamData } from "@/types";

// Mock movie data for development
const MOCK_MOVIES: Movie[] = [
  {
    id: "1",
    title: "The Dark Horizon",
    description: "In a world where shadows reign supreme, one hero must rise to challenge the darkness that threatens to consume everything. An epic journey of courage, sacrifice, and redemption awaits.",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
    releaseYear: 2024,
    duration: 142,
    rating: 8.5,
    genres: ["Action", "Sci-Fi", "Drama"],
    cast: ["John Smith", "Emma Davis", "Michael Chen"],
    director: "Christopher Nolan",
    language: "English",
    maturityRating: "PG-13",
  },
  {
    id: "2",
    title: "Ocean's Mystery",
    description: "Deep beneath the waves lies a secret that could change humanity forever. A team of marine scientists discovers an ancient civilization with technology beyond our imagination.",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop",
    releaseYear: 2024,
    duration: 128,
    rating: 7.9,
    genres: ["Adventure", "Mystery", "Thriller"],
    cast: ["Sarah Johnson", "David Park", "Lisa Wong"],
    director: "James Cameron",
    language: "English",
    maturityRating: "PG-13",
  },
  {
    id: "3",
    title: "Midnight Run",
    description: "A retired assassin is forced back into the game when his family is threatened. One night. One mission. No second chances.",
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 118,
    rating: 8.2,
    genres: ["Action", "Thriller"],
    cast: ["Ryan Brooks", "Jennifer Lee", "Marcus Williams"],
    director: "Chad Stahelski",
    language: "English",
    maturityRating: "R",
  },
  {
    id: "4",
    title: "Love in Paris",
    description: "Two strangers meet by chance in the city of lights. What begins as a single magical evening becomes a love story that spans decades.",
    posterUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&h=1080&fit=crop",
    releaseYear: 2024,
    duration: 125,
    rating: 7.5,
    genres: ["Romance", "Drama"],
    cast: ["Emily Stone", "Pierre Dupont", "Marie Claire"],
    director: "Nancy Meyers",
    language: "English",
    maturityRating: "PG",
  },
  {
    id: "5",
    title: "The Last Frontier",
    description: "In the final days of Earth, humanity's last hope lies in colonizing a distant planet. But the journey there is more dangerous than anyone imagined.",
    posterUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&h=1080&fit=crop",
    releaseYear: 2024,
    duration: 155,
    rating: 8.8,
    genres: ["Sci-Fi", "Drama", "Adventure"],
    cast: ["Tom Hardy", "Jessica Chen", "Oscar Isaac"],
    director: "Denis Villeneuve",
    language: "English",
    maturityRating: "PG-13",
  },
  {
    id: "6",
    title: "Haunted Manor",
    description: "A family inherits an old Victorian mansion, only to discover they share it with vengeful spirits from its dark past.",
    posterUrl: "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 112,
    rating: 7.1,
    genres: ["Horror", "Mystery"],
    cast: ["Vera Farmiga", "Patrick Wilson", "Mckenna Grace"],
    director: "Mike Flanagan",
    language: "English",
    maturityRating: "R",
  },
  {
    id: "7",
    title: "Comedy Night",
    description: "A struggling stand-up comedian gets one chance to perform at the biggest comedy festival. Can he overcome his stage fright and make the world laugh?",
    posterUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=1920&h=1080&fit=crop",
    releaseYear: 2024,
    duration: 98,
    rating: 7.8,
    genres: ["Comedy", "Drama"],
    cast: ["Kevin Hart", "Tiffany Haddish", "Pete Davidson"],
    director: "Judd Apatow",
    language: "English",
    maturityRating: "PG-13",
  },
  {
    id: "8",
    title: "Warriors of Time",
    description: "An ancient warrior is transported to modern-day New York. To find his way home, he must team up with an unlikely ally and battle enemies across centuries.",
    posterUrl: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=1920&h=1080&fit=crop",
    releaseYear: 2024,
    duration: 132,
    rating: 7.6,
    genres: ["Action", "Fantasy", "Adventure"],
    cast: ["Chris Hemsworth", "Awkwafina", "Idris Elba"],
    director: "Taika Waititi",
    language: "English",
    maturityRating: "PG-13",
  },
  {
    id: "9",
    title: "Mountain Peak",
    description: "A documentary following elite climbers as they attempt to summit the world's most dangerous peaks without oxygen or ropes.",
    posterUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop",
    releaseYear: 2023,
    duration: 95,
    rating: 8.4,
    genres: ["Documentary", "Adventure"],
    cast: ["Alex Honnold", "Jimmy Chin"],
    director: "Elizabeth Chai Vasarhelyi",
    language: "English",
    maturityRating: "PG",
  },
  {
    id: "10",
    title: "Neon Streets",
    description: "In a cyberpunk future, a hacker uncovers a conspiracy that threatens to plunge the city into eternal darkness. Trust no one. Hack everything.",
    posterUrl: "https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=1920&h=1080&fit=crop",
    releaseYear: 2024,
    duration: 138,
    rating: 8.1,
    genres: ["Sci-Fi", "Thriller", "Action"],
    cast: ["Keanu Reeves", "Ana de Armas", "Jared Leto"],
    director: "Ridley Scott",
    language: "English",
    maturityRating: "R",
  },
];

const MOCK_CATEGORIES: MovieCategory[] = [
  { id: "trending", name: "Trending Now", movies: MOCK_MOVIES.slice(0, 5) },
  { id: "top-rated", name: "Top Rated", movies: MOCK_MOVIES.slice(3, 8) },
  { id: "action", name: "Action & Adventure", movies: MOCK_MOVIES.filter(m => m.genres.includes("Action")) },
  { id: "scifi", name: "Sci-Fi & Fantasy", movies: MOCK_MOVIES.filter(m => m.genres.includes("Sci-Fi") || m.genres.includes("Fantasy")) },
  { id: "drama", name: "Drama", movies: MOCK_MOVIES.filter(m => m.genres.includes("Drama")) },
  { id: "thriller", name: "Thrillers", movies: MOCK_MOVIES.filter(m => m.genres.includes("Thriller") || m.genres.includes("Horror")) },
  { id: "comedy", name: "Comedy", movies: MOCK_MOVIES.filter(m => m.genres.includes("Comedy")) },
  { id: "recently-added", name: "Recently Added", movies: [...MOCK_MOVIES].reverse().slice(0, 6) },
];

const USE_MOCK = true;

export const moviesService = {
  async getHomePageData(): Promise<HomePageData> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        featured: MOCK_MOVIES[4], // The Last Frontier as featured
        categories: MOCK_CATEGORIES,
      };
    }

    return api.get<HomePageData>(API_ENDPOINTS.MOVIES.HOME);
  },

  async getMovieById(id: string): Promise<Movie> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const movie = MOCK_MOVIES.find((m) => m.id === id);
      if (!movie) throw { message: "Movie not found", statusCode: 404 };
      return movie;
    }

    return api.get<Movie>(API_ENDPOINTS.MOVIES.DETAIL(id));
  },

  async searchMovies(params: SearchParams): Promise<Movie[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      let results = MOCK_MOVIES;
      
      if (params.query) {
        const query = params.query.toLowerCase();
        results = results.filter(
          (m) =>
            m.title.toLowerCase().includes(query) ||
            m.description.toLowerCase().includes(query) ||
            m.genres.some((g) => g.toLowerCase().includes(query))
        );
      }
      
      if (params.filters?.genre) {
        results = results.filter((m) =>
          m.genres.includes(params.filters!.genre!)
        );
      }
      
      if (params.filters?.year) {
        results = results.filter((m) => m.releaseYear === params.filters!.year);
      }
      
      return results;
    }

    const searchParams: Record<string, string> = { q: params.query };
    if (params.filters?.genre) searchParams.genre = params.filters.genre;
    if (params.filters?.year) searchParams.year = String(params.filters.year);
    if (params.filters?.language) searchParams.language = params.filters.language;

    return api.get<Movie[]>(API_ENDPOINTS.MOVIES.SEARCH, searchParams);
  },

  async getStreamData(movieId: string): Promise<StreamData> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        type: "mp4",
        streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        fallbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      };
    }

    return api.get<StreamData>(API_ENDPOINTS.MOVIES.STREAM(movieId));
  },

  getAllGenres(): string[] {
    const genres = new Set<string>();
    MOCK_MOVIES.forEach((m) => m.genres.forEach((g) => genres.add(g)));
    return Array.from(genres).sort();
  },

  getAllYears(): number[] {
    const years = new Set<number>();
    MOCK_MOVIES.forEach((m) => years.add(m.releaseYear));
    return Array.from(years).sort((a, b) => b - a);
  },
};
