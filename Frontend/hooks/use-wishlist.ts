"use client"

import { useEffect, useMemo, useRef, useCallback } from "react"
import { useAppDispatch } from "@/hooks/use-app-dispatch"
import { useAppSelector } from "@/hooks/use-app-selector"
import { useToast } from "@/hooks/use-toast"
import { 
  fetchWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist,
  resetWishlist
} from "@/store/slices/wishlistSlice"

export function useWishlist() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  
  // Single source of truth: Redux user state
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)
  
  // Get wishlist state from Redux
  const { items, loading, error } = useAppSelector(
    (state) => state.wishlist
  )

  // Track if wishlist has been fetched for current auth state
  const hasFetchedWishlist = useRef(false)
  const lastAuthState = useRef(isAuthenticated)

  // Fetch wishlist on mount and when auth state changes
  useEffect(() => {
    // If auth state changed, reset fetch flag
    if (lastAuthState.current !== isAuthenticated) {
      hasFetchedWishlist.current = false
      lastAuthState.current = isAuthenticated
    }

    // Skip if already fetched for this auth state
    if (hasFetchedWishlist.current) {
      return
    }

    hasFetchedWishlist.current = true

    if (isAuthenticated) {
      dispatch(fetchWishlist())
    } else {
      dispatch(resetWishlist())
    }
  }, [isAuthenticated, dispatch])

  /**
   * Add product to wishlist
   */
  const handleAddToWishlist = useCallback(async (product: any) => {
    try {
      if (!isAuthenticated) {
        toast({
          title: "Login Required",
          description: "Please login to add items to your wishlist",
          variant: "destructive"
        })
        return
      }

      const result = await dispatch(addToWishlist(product.id))

      if (addToWishlist.fulfilled.match(result)) {
        // Refetch wishlist to get updated state - await to ensure it completes
        await dispatch(fetchWishlist())
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist`,
        })
      } else if (addToWishlist.rejected.match(result)) {
        const errorMsg = result.payload as string
        toast({
          title: "Error adding to wishlist",
          description: errorMsg || "Failed to add item to wishlist",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to wishlist",
        variant: "destructive"
      })
    }
  }, [isAuthenticated, dispatch, toast])

  /**
   * Remove item from wishlist
   */
  const handleRemoveFromWishlist = useCallback(async (productId: string) => {
    try {
      const result = await dispatch(removeFromWishlist(productId))
      
      if (removeFromWishlist.fulfilled.match(result)) {
        // State is already updated by the reducer, no need to refetch
        toast({
          title: "Item removed",
          description: "Item has been removed from your wishlist",
        })
      } else if (removeFromWishlist.rejected.match(result)) {
        toast({
          title: "Error",
          description: result.payload as string,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive"
      })
    }
  }, [dispatch, toast])

  /**
   * Toggle wishlist (add if not present, remove if present)
   */
  const toggleWishlist = useCallback(async (product: any) => {
    const isInWishlist = items.some((item: any) => item.product_id === product.id)
    
    if (isInWishlist) {
      await handleRemoveFromWishlist(product.id)
    } else {
      await handleAddToWishlist(product)
    }
  }, [items, handleAddToWishlist, handleRemoveFromWishlist])

  /**
   * Clear entire wishlist
   */
  const handleClearWishlist = useCallback(async () => {
    try {
      const result = await dispatch(clearWishlist())
      
      if (clearWishlist.fulfilled.match(result)) {
        // Refetch wishlist to ensure state is in sync (though reducer already clears it)
        await dispatch(fetchWishlist())
        toast({
          title: "Wishlist cleared",
          description: "Your wishlist has been cleared",
        })
      } else if (clearWishlist.rejected.match(result)) {
        toast({
          title: "Error",
          description: result.payload as string,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
        variant: "destructive"
      })
    }
  }, [dispatch, toast])

  // Memoize return value to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    wishlist: items,
    wishlistCount: items.length,
    loading,
    error,
    isAuthenticated,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    toggleWishlist,
    clearWishlist: handleClearWishlist,
  }), [items, loading, error, isAuthenticated, handleAddToWishlist, handleRemoveFromWishlist, toggleWishlist, handleClearWishlist])

  return returnValue
}
