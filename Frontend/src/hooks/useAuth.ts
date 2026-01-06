import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import {
  sendOtp,
  verifyOtp,
  logout,
  getProfile,
  updateProfile,
  initializeAuth,
  clearError
} from '../../store/slices/userSlice';
import { isTokenExpired } from '../utils/tokenUtils';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { 
    isAuthenticated, 
    user, 
    accessToken, 
    refreshToken, 
    loading, 
    error, 
    otpSent, 
    email 
  } = useSelector((state: RootState) => state.user);

  // Initialize authentication on app start
  const initialize = useCallback(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Send OTP to email
  const sendOtpToEmail = useCallback(async (emailAddress: string) => {
    try {
      await dispatch(sendOtp(emailAddress)).unwrap();
      localStorage.setItem('otpEmail', emailAddress);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error || 'Failed to send OTP' };
    }
  }, [dispatch]);

  // Verify OTP and login
  const verifyOtpAndLogin = useCallback(async (emailAddress: string, otpCode: string, name?: string) => {
    try {
      await dispatch(verifyOtp({ email: emailAddress, otp: otpCode, name })).unwrap();
      localStorage.removeItem('otpEmail');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error || 'Failed to verify OTP' };
    }
  }, [dispatch]);

  // Logout user
  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  // Get user profile
  const fetchProfile = useCallback(async () => {
    try {
      await dispatch(getProfile()).unwrap();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error || 'Failed to fetch profile' };
    }
  }, [dispatch]);

  // Update user profile
  const updateUserProfile = useCallback(async (name: string) => {
    try {
      await dispatch(updateProfile(name)).unwrap();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error || 'Failed to update profile' };
    }
  }, [dispatch]);

  // Clear error
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Check if token is expired
  const isTokenValid = useCallback(() => {
    if (!accessToken) return false;
    return !isTokenExpired(accessToken);
  }, [accessToken]);

  // Check if user has specific role
  const hasRole = useCallback((role: string) => {
    return user?.role === role;
  }, [user?.role]);

  // Check if user is admin
  const isAdminUser = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  // Check if user is customer
  const isCustomerUser = useCallback(() => {
    return hasRole('customer');
  }, [hasRole]);

  return {
    // State
    isAuthenticated,
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    otpSent,
    email,
    
    // Actions
    initialize,
    sendOtpToEmail,
    verifyOtpAndLogin,
    logoutUser,
    fetchProfile,
    updateUserProfile,
    clearAuthError,
    
    // Utilities
    isTokenValid,
    hasRole,
    isAdminUser,
    isCustomerUser,
  };
};

export default useAuth;
