import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
} from '../controllers/cartController.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Routes
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:cartId', updateCartItem);
router.delete('/:cartId', removeFromCart);
router.delete('/', clearCart);
router.get('/count', getCartCount);

export default router;







