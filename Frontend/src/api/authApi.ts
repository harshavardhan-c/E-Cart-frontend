import apiClient from './axiosConfig';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface OtpResponse {
  status: string;
  message: string;
  data: {
    email: string;
    expiresIn: string;
  };
}

// Auth API functions
export const authApi = {
  // Send OTP to email
  sendOtp: async (email: string): Promise<OtpResponse> => {
    const response = await apiClient.post('/auth/send-otp', { email });
    return response.data;
  },

  // Verify OTP and login
  verifyOtp: async (email: string, otp: string, name?: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/verify-otp', { email, otp, name });
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<{ data: { accessToken: string } }> => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  // Logout user
  logout: async (): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<{ data: { user: User } }> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (name: string): Promise<{ data: { user: User } }> => {
    const response = await apiClient.put('/auth/profile', { name });
    return response.data;
  },
};

export default authApi;



