import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  email: string | null;
  sendOtpToEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtpAndLogin: (email: string, otp: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;
  fetchProfile: () => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (name: string) => Promise<{ success: boolean; error?: string }>;
  clearAuthError: () => void;
  isTokenValid: () => boolean;
  hasRole: (role: string) => boolean;
  isAdminUser: () => boolean;
  isCustomerUser: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  // Initialize authentication on mount
  useEffect(() => {
    auth.initialize();
  }, []);

  // Auto-refresh token if it's about to expire
  useEffect(() => {
    if (auth.accessToken && auth.isTokenValid()) {
      const checkTokenExpiry = () => {
        if (!auth.isTokenValid()) {
          auth.logoutUser();
        }
      };

      // Check token every 5 minutes
      const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [auth.accessToken, auth.isTokenValid, auth.logoutUser]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;



