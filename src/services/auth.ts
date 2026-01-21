import { API_ENDPOINTS, STORAGE_KEYS } from "@/config";
import { api } from "./api";
import { AuthResponse, LoginCredentials, SignupCredentials, User } from "@/types";

// Mock data for development
const MOCK_USER: User = {
  id: "user-1",
  email: "demo@streamx.com",
  name: "Demo User",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
  createdAt: new Date().toISOString(),
};

const USE_MOCK = true; // Toggle for development

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      if (credentials.email === "demo@streamx.com" && credentials.password === "demo123") {
        const response: AuthResponse = {
          user: MOCK_USER,
          accessToken: "mock-access-token-" + Date.now(),
          refreshToken: "mock-refresh-token-" + Date.now(),
        };
        
        // Store tokens
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken || "");
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        
        return response;
      }
      
      throw { message: "Invalid email or password", statusCode: 401 };
    }

    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    if (response.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    
    return response;
  },

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const newUser: User = {
        id: "user-" + Date.now(),
        email: credentials.email,
        name: credentials.name,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
        createdAt: new Date().toISOString(),
      };
      
      const response: AuthResponse = {
        user: newUser,
        accessToken: "mock-access-token-" + Date.now(),
        refreshToken: "mock-refresh-token-" + Date.now(),
      };
      
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken || "");
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      
      return response;
    }

    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, credentials);
    
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    if (response.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    
    return response;
  },

  async logout(): Promise<void> {
    if (!USE_MOCK) {
      try {
        await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      } catch {
        // Continue with local logout even if API fails
      }
    }
    
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  async getCurrentUser(): Promise<User | null> {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!token) return null;
    
    if (USE_MOCK) {
      return storedUser ? JSON.parse(storedUser) : null;
    }

    try {
      const user = await api.get<User>(API_ENDPOINTS.AUTH.ME);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    } catch {
      return storedUser ? JSON.parse(storedUser) : null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getStoredUser(): User | null {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    return storedUser ? JSON.parse(storedUser) : null;
  },
};
