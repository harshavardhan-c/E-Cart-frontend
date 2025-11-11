import { CartModel } from '../models/cartModel.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Get user's cart
 */
export const getCart = asyncHandler(async (req, res) => {
  const customerId = req.user.id;

  try {
    const cartItems = await CartModel.getCartByCustomerId(customerId);
    const total = await CartModel.getCartTotal(customerId);
    const itemCount = await CartModel.getCartCount(customerId);

    res.status(200).json({
      status: 'success',
      message: 'Cart retrieved successfully',
      data: {
        items: cartItems,
        total: total,
        itemCount: itemCount
      }
    });
  } catch (error) {
    console.error('❌ Error getting cart:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve cart'
    });
  }
});

/**
 * Add item to cart
 */
export const addToCart = asyncHandler(async (req, res) => {
  const customerId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({
      status: 'error',
      message: 'Product ID is required'
    });
  }

  try {
    const cartItem = await CartModel.addToCart(customerId, productId, quantity || 1);

    res.status(201).json({
      status: 'success',
      message: 'Item added to cart',
      data: cartItem
    });
  } catch (error) {
    console.error('❌ Error adding to cart:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add item to cart'
    });
  }
});

/**
 * Update cart item quantity
 */
export const updateCartItem = asyncHandler(async (req, res) => {
  const { cartId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({
      status: 'error',
      message: 'Valid quantity is required'
    });
  }

  try {
    const cartItem = await CartModel.updateQuantity(cartId, quantity);

    res.status(200).json({
      status: 'success',
      message: 'Cart item updated',
      data: cartItem
    });
  } catch (error) {
    console.error('❌ Error updating cart:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update cart item'
    });
  }
});

/**
 * Remove item from cart
 */
export const removeFromCart = asyncHandler(async (req, res) => {
  const { cartId } = req.params;

  try {
    await CartModel.removeFromCart(cartId);

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('❌ Error removing from cart:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove item from cart'
    });
  }
});

/**
 * Clear cart
 */
export const clearCart = asyncHandler(async (req, res) => {
  const customerId = req.user.id;

  try {
    await CartModel.clearCart(customerId);

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('❌ Error clearing cart:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to clear cart'
    });
  }
});

/**
 * Get cart count
 */
export const getCartCount = asyncHandler(async (req, res) => {
  const customerId = req.user.id;

  try {
    const count = await CartModel.getCartCount(customerId);

    res.status(200).json({
      status: 'success',
      message: 'Cart count retrieved',
      data: { count }
    });
  } catch (error) {
    console.error('❌ Error getting cart count:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get cart count'
    });
  }
});

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
};


