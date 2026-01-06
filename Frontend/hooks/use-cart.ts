"use client"

import { useEffect, useMemo, useRef, useCallback } from "react"
import { useAppDispatch } from "@/hooks/use-app-dispatch"
import { useAppSelector } from "@/hooks/use-app-selector"
import { useToast } from "@/hooks/use-toast"
import { 
  fetchCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  syncGuestCartOnLogin
} from "@/store/slices/cartSlice"
import { cartApi } from "@/src/api/cartApi"

export function useCart() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  
  // Single source of truth: Redux user state
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)
  
  // Get cart state from Redux
  const { items, total, itemCount, loading, error } = useAppSelector(
    (state) => state.cart
  )

  // Track if cart has been fetched for current auth state
  const hasFetchedCart = useRef(false)
  const lastAuthState = useRef(isAuthenticated)

  // Initialize cart on mount and when auth state changes
  useEffect(() => {
    // If auth state changed, reset fetch flag
    if (lastAuthState.current !== isAuthenticated) {
      hasFetchedCart.current = false
      lastAuthState.current = isAuthenticated
    }

    // Skip if already fetched for this auth state
    if (hasFetchedCart.current) {
      return
    }

    hasFetchedCart.current = true

    if (isAuthenticated) {
      // Authenticated user - sync guest cart if exists, otherwise just fetch
      const guestItems = cartApi.readGuest()
      if (guestItems.length > 0) {
        // syncGuestCartOnLogin already fetches the cart after syncing
        dispatch(syncGuestCartOnLogin())
      } else {
        dispatch(fetchCart())
      }
    } else {
      // Guest user - load from localStorage via fetchCart thunk
      dispatch(fetchCart())
    }
  }, [isAuthenticated, dispatch])

  // Helper functions for guest cart operations
  const readGuestCart = useCallback((): any[] => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem('guestCart')
      return raw ? JSON.parse(raw) : []
    } catch (error) {
      return []
    }
  }, [])

  const writeGuestCart = useCallback((items: any[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('guestCart', JSON.stringify(items))
  }, [])

  /**
   * Add product to cart
   * Supports both authenticated and guest users
   */
  const handleAddToCart = useCallback(async (product: any) => {
    try {
      if (!isAuthenticated) {
        // Guest path: write to localStorage and update Redux
        const items = readGuestCart()
        const idx = items.findIndex((it: any) => (it.product_id || it.id) === product.id)
        
        if (idx >= 0) {
          items[idx].quantity = (items[idx].quantity || 1) + 1
        } else {
          items.push({
            id: product.id,
            product_id: product.id,
            quantity: 1,
            products: {
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url || product.image || '/placeholder.svg',
              category: product.category
            }
          })
        }
        
        writeGuestCart(items)
        // Refresh cart from Redux (fetchCart reads guest cart)
        await dispatch(fetchCart())
        
        toast({ 
          title: "Item added to cart", 
          description: `${product.name} has been added to your cart` 
        })
        return
      }

      // Authenticated path: use Redux thunk
      const result = await dispatch(addToCart({ 
        productId: product.id, 
        quantity: 1 
      }))

      if (addToCart.fulfilled.match(result)) {
        // Refetch cart to get updated state - await to ensure it completes
        await dispatch(fetchCart())
        toast({
          title: "Item added to cart",
          description: `${product.name} has been added to your cart`,
        })
      } else if (addToCart.rejected.match(result)) {
        const errorMsg = result.payload as string
        toast({
          title: "Error adding to cart",
          description: errorMsg || "Failed to add item to cart",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart",
        variant: "destructive"
      })
    }
  }, [isAuthenticated, readGuestCart, writeGuestCart, dispatch, toast])

  /**
   * Update quantity
   */
  const handleUpdateQuantity = useCallback(async (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      await handleRemoveFromCart(cartId)
      return
    }

    try {
      if (!isAuthenticated) {
        // Guest path: update localStorage
        const items = readGuestCart()
        const idx = items.findIndex((it: any) => it.id === cartId)
        if (idx >= 0) {
          items[idx].quantity = quantity
          writeGuestCart(items)
          await dispatch(fetchCart())
        }
        return
      }

      const result = await dispatch(updateCartItem({ cartId, quantity }))
      
      if (updateCartItem.fulfilled.match(result)) {
        // Refetch cart to get updated state
        await dispatch(fetchCart())
      } else if (updateCartItem.rejected.match(result)) {
        toast({
          title: "Error",
          description: result.payload as string,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      })
    }
  }, [isAuthenticated, readGuestCart, writeGuestCart, dispatch, toast])

  /**
   * Remove item from cart
   */
  const handleRemoveFromCart = useCallback(async (cartId: string) => {
    try {
      if (!isAuthenticated) {
        // Guest path: remove from localStorage
        const items = readGuestCart()
        const filtered = items.filter((it: any) => it.id !== cartId)
        writeGuestCart(filtered)
        await dispatch(fetchCart())
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart",
        })
        return
      }

      const result = await dispatch(removeFromCart(cartId))
      
      if (removeFromCart.fulfilled.match(result)) {
        // State is already updated by the reducer, no need to refetch
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart",
        })
      } else if (removeFromCart.rejected.match(result)) {
        toast({
          title: "Error",
          description: result.payload as string,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive"
      })
    }
  }, [isAuthenticated, readGuestCart, writeGuestCart, dispatch, toast])

  /**
   * Clear entire cart
   */
  const handleClearCart = useCallback(async () => {
    try {
      if (!isAuthenticated) {
        // Guest user - clear localStorage
        writeGuestCart([])
        await dispatch(fetchCart())
        toast({
          title: "Cart cleared",
          description: "Your cart has been cleared",
        })
        return
      }

      // Authenticated user - use Redux
      const result = await dispatch(clearCart())
      
      if (clearCart.fulfilled.match(result)) {
        // State is already updated by the reducer, no need to refetch
        toast({
          title: "Cart cleared",
          description: "Your cart has been cleared",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive"
      })
    }
  }, [isAuthenticated, writeGuestCart, dispatch, toast])

  // Memoize return value to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    cart: items,
    cartCount: itemCount,
    total,
    loading,
    error,
    isAuthenticated,
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
  }), [items, itemCount, total, loading, error, isAuthenticated, handleAddToCart, handleUpdateQuantity, handleRemoveFromCart, handleClearCart])
  
  return returnValue
}
