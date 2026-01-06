import apiClient from './axiosConfig';

export interface WishlistItem {
  id: string;
  product_id: string;
  added_at: string;
  products: any;
}

export interface WishlistResponse {
  status: string;
  message: string;
  data: {
    items: WishlistItem[];
    count: number;
  };
}

/**
 * Wishlist API with authentication
 * All operations require authentication
 */
export const wishlistApi = {
  /**
   * Check if user is authenticated (JWT-based)
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      if (typeof window === 'undefined') return false;
      const token = localStorage.getItem('accessToken');
      
      // Additional check: verify token is not expired or malformed
      if (!token) return false;
      
      try {
        // Basic JWT structure check (should have 3 parts)
        const parts = token.split('.');
        if (parts.length !== 3) {
          localStorage.removeItem('accessToken');
          return false;
        }
        
        // Check if token is expired (basic check)
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
          localStorage.removeItem('accessToken');
          return false;
        }
        
        return true;
      } catch (tokenError) {
        localStorage.removeItem('accessToken');
        return false;
      }
    } catch {
      return false;
    }
  },

  /**
   * Get user's wishlist
   */
  getWishlist: async (): Promise<WishlistResponse> => {
    try {
      const isAuth = await wishlistApi.isAuthenticated();
      
      if (!isAuth) {
        // Return empty wishlist for unauthenticated users
        return { 
          status: 'success', 
          message: 'Wishlist retrieved (guest)', 
          data: { items: [], count: 0 } 
        };
      }

      const res = await apiClient.get('/wishlist');
      return res.data;
    } catch (error: any) {
      // Handle authentication errors gracefully
      if (error.response?.status === 401 || error.response?.status === 403) {
        return { 
          status: 'success', 
          message: 'Wishlist retrieved (guest)', 
          data: { items: [], count: 0 } 
        };
      }
      
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  /**
   * Add item to wishlist
   */
  addToWishlist: async (productId: string): Promise<{ data: any }> => {
    const isAuth = await wishlistApi.isAuthenticated();
    if (!isAuth) {
      throw new Error('Please login to add items to wishlist');
    }

    const res = await apiClient.post('/wishlist', { productId });
    return { data: res.data.data };
  },

  /**
   * Remove item from wishlist
   */
  removeFromWishlist: async (productId: string): Promise<void> => {
    const isAuth = await wishlistApi.isAuthenticated();
    if (!isAuth) {
      throw new Error('Please login to manage wishlist');
    }
    
    await apiClient.delete(`/wishlist/${productId}`);
  },

  /**
   * Clear entire wishlist
   */
  clearWishlist: async (): Promise<void> => {
    const isAuth = await wishlistApi.isAuthenticated();
    if (!isAuth) {
      throw new Error('Please login to manage wishlist');
    }
    
    await apiClient.delete('/wishlist');
  },

  /**
   * Get wishlist count
   */
  getWishlistCount: async (): Promise<{ data: { count: number } }> => {
    try {
      const isAuth = await wishlistApi.isAuthenticated();
      if (!isAuth) {
        return { data: { count: 0 } };
      }
      
      const res = await apiClient.get('/wishlist/count');
      return { data: { count: res.data.data.count || 0 } };
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return { data: { count: 0 } };
      }
      console.error('Error getting wishlist count:', error);
      return { data: { count: 0 } };
    }
  }
};

export default wishlistApi;