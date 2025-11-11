import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  iat: number;
  id: string;
  phone: string;
  role: string;
  name: string;
}

/**
 * Decode JWT token and extract payload
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Get token expiry time in milliseconds
 */
export const getTokenExpiryTime = (token: string): number | null => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return decoded.exp * 1000; // Convert to milliseconds
};

/**
 * Get time until token expires in milliseconds
 */
export const getTimeUntilExpiry = (token: string): number | null => {
  const expiryTime = getTokenExpiryTime(token);
  if (!expiryTime) return null;
  
  return expiryTime - Date.now();
};

/**
 * Check if token will expire within specified minutes
 */
export const willTokenExpireSoon = (token: string, minutesThreshold = 5): boolean => {
  const timeUntilExpiry = getTimeUntilExpiry(token);
  if (!timeUntilExpiry) return true;
  
  const thresholdMs = minutesThreshold * 60 * 1000;
  return timeUntilExpiry < thresholdMs;
};

/**
 * Format time remaining until token expires
 */
export const formatTimeUntilExpiry = (token: string): string => {
  const timeUntilExpiry = getTimeUntilExpiry(token);
  if (!timeUntilExpiry) return 'Expired';
  
  const minutes = Math.floor(timeUntilExpiry / (1000 * 60));
  const seconds = Math.floor((timeUntilExpiry % (1000 * 60)) / 1000);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

/**
 * Get user role from token
 */
export const getUserRoleFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

/**
 * Get user ID from token
 */
export const getUserIdFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded?.id || null;
};

/**
 * Check if user has specific role
 */
export const hasRole = (token: string, role: string): boolean => {
  const userRole = getUserRoleFromToken(token);
  return userRole === role;
};

/**
 * Check if user is admin
 */
export const isAdmin = (token: string): boolean => {
  return hasRole(token, 'admin');
};

/**
 * Check if user is customer
 */
export const isCustomer = (token: string): boolean => {
  return hasRole(token, 'customer');
};

export default {
  decodeToken,
  isTokenExpired,
  getTokenExpiryTime,
  getTimeUntilExpiry,
  willTokenExpireSoon,
  formatTimeUntilExpiry,
  getUserRoleFromToken,
  getUserIdFromToken,
  hasRole,
  isAdmin,
  isCustomer,
};
