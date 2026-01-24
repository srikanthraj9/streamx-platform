import { API_ENDPOINTS, STORAGE_KEYS } from "@/config";
import { api } from "./api";
import { AuthResponse, LoginCredentials, SignupCredentials, User } from "@/types";

type BackendLoginResponse = {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
};

export const authService = {
  // ✅ LOGIN (JSON as backend expects)
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const tokenRes = await api.post<BackendLoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // ✅ Store token
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenRes.access_token);
    if (tokenRes.refresh_token) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenRes.refresh_token);
    }

    // ✅ Fetch current user
    const user = await api.get<User>(API_ENDPOINTS.AUTH.ME);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return {
      user,
      accessToken: tokenRes.access_token,
      refreshToken: tokenRes.refresh_token,
    };
  },

  // ✅ SIGNUP (JSON as backend expects)
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    await api.post(API_ENDPOINTS.AUTH.SIGNUP, credentials);

    // ✅ auto login after signup
    return this.login({
      email: credentials.email,
      password: credentials.password,
    });
  },

  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // ignore
    }

    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return null;

    try {
      const user = await api.get<User>(API_ENDPOINTS.AUTH.ME);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    } catch {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
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
