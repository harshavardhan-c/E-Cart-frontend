import apiClient from './axiosConfig';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  added_at: string;
  products: any;
}

export interface CartResponse {
  status: string;
  message: string;
  data: {
    items: CartItem[];
    total: number;
    itemCount: number;
  };
}

/**
 * Cart API with Supabase integration
 * All operations require authentication
 */
export const cartApi = {
  // Internal: detect axios/network error
  _isNetworkError(error: any): boolean {
    return (
      !!error && (
        error.code === 'ECONNABORTED' ||
        error.message?.includes('Network Error') ||
        error.message?.includes('timeout') ||
        error.name === 'AxiosError'
      )
    )
  },
  /**
   * Read guest cart (localStorage)
   */
  readGuest: (): CartItem[] => {
    if (typeof window === 'undefined') return [] as any
    try {
      const raw = localStorage.getItem('guestCart')
      return raw ? JSON.parse(raw) : []
    } catch {
      return [] as any
    }
  },

  /**
   * Write guest cart (localStorage)
   */
  writeGuest: (items: any[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('guestCart', JSON.stringify(items))
    try {
      window.dispatchEvent(new Event('guestCartUpdated'))
    } catch {}
  },
  /**
   * Check if user is authenticated (JWT-based)
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      if (typeof window === 'undefined') return false
      const token = localStorage.getItem('accessToken')
      return Boolean(token)
    } catch {
      return false
    }
  },

  /**
   * Get user's cart from Supabase
   */
  getCart: async (): Promise<CartResponse> => {
    try {
      // If not authenticated, use guest cart
      const isAuth = await cartApi.isAuthenticated()
      if (!isAuth) {
        const items = cartApi.readGuest()
        const total = items.reduce((sum: number, it: any) => sum + (it.products?.price || 0) * (it.quantity || 1), 0)
        return { status: 'success', message: 'Cart retrieved', data: { items: items as any, total, itemCount: items.length } }
      }

      // Authenticated path via backend API
      const res = await apiClient.get('/cart')
      const { data } = res.data
      // Ensure guest cart does not resurrect old items once user is authenticated
      try { cartApi.writeGuest([] as any) } catch {}
      return { status: 'success', message: 'Cart retrieved', data }
    } catch (error: any) {
      if (cartApi._isNetworkError(error)) {
        // Backend likely offline; fall back to guest cart silently
        const items = cartApi.readGuest()
        const total = items.reduce((sum: number, it: any) => sum + (it.products?.price || 0) * (it.quantity || 1), 0)
        return { status: 'success', message: 'Cart retrieved (fallback)', data: { items: items as any, total, itemCount: items.length } }
      }
      console.error('Error fetching cart:', error)
      throw error
    }
  },

  /**
   * Add item to cart
   * Properly handles session and cart updates
   */
  addToCart: async (productId: string, quantity: number = 1): Promise<{ data: any }> => {
    const isAuth = await cartApi.isAuthenticated()
    if (!isAuth) {
      // Guest cart path
      const items = cartApi.readGuest()
      const existing = items.find((it: any) => it.id === productId || it.product_id === productId)
      if (existing) {
        existing.quantity = (existing.quantity || 1) + quantity
      } else {
        items.push({ id: productId, product_id: productId, quantity })
      }
      cartApi.writeGuest(items)
      return { data: { ok: true } }
    }

    // Authenticated path via backend API
    const res = await apiClient.post('/cart', { productId, quantity })
    return { data: res.data.data }
  },

  /**
   * Update cart item quantity
   */
  updateQuantity: async (cartId: string, quantity: number): Promise<{ data: any }> => {
    const isAuth = await cartApi.isAuthenticated()
    if (!isAuth) {
      const items = cartApi.readGuest()
      const idx = items.findIndex((it: any) => it.id === cartId)
      if (idx >= 0) {
        items[idx].quantity = quantity
        cartApi.writeGuest(items)
      }
      return { data: { ok: true } }
    }

    const res = await apiClient.put(`/cart/${cartId}`, { quantity })
    return { data: res.data.data }
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (cartId: string): Promise<void> => {
    const isAuth = await cartApi.isAuthenticated()
    if (!isAuth) {
      const items = cartApi.readGuest()
      const next = items.filter((it: any) => it.id !== cartId)
      cartApi.writeGuest(next)
      return
    }
    await apiClient.delete(`/cart/${cartId}`)
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<void> => {
    const isAuth = await cartApi.isAuthenticated()
    if (!isAuth) {
      cartApi.writeGuest([])
      return
    }
    await apiClient.delete('/cart')
  },

  /**
   * Get cart count
   */
  getCartCount: async (): Promise<{ data: { count: number } }> => {
    try {
      const isAuth = await cartApi.isAuthenticated()
      if (!isAuth) {
        const items = cartApi.readGuest()
        return { data: { count: items.reduce((n: number, it: any) => n + (it.quantity || 1), 0) } }
      }
      const res = await apiClient.get('/cart/count')
      return { data: { count: res.data.data.count || 0 } }
    } catch (error: any) {
      if (cartApi._isNetworkError(error)) {
        const items = cartApi.readGuest()
        return { data: { count: items.reduce((n: number, it: any) => n + (it.quantity || 1), 0) } }
      }
      console.error('Error getting cart count:', error)
      return { data: { count: 0 } }
    }
  }
};

export default cartApi;

