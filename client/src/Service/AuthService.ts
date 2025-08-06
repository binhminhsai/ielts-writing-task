// AuthService.ts
const API_BASE_URL = 'https://localhost:7279/api/Auth';

interface LoginResponse {
  token: string;
  message?: string;
}

interface RegisterResponse {
  message: string;
}

interface ProfileResponse {
  userId: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface ErrorResponse {
  message: string;
}

export const AuthService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data: RegisterResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async getProfile(token: string): Promise<ProfileResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      const data: ProfileResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  },

  // Helper function to store token in localStorage
  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  },

  // Helper function to get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  // Helper function to remove token (logout)
  removeToken(): void {
    localStorage.removeItem('authToken');
  },
};