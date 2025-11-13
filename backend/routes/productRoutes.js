import express from 'express';
import {
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  searchProducts,
  updateStock
} from '../controllers/productController.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/search', optionalAuth, searchProducts);
router.get('/:category', optionalAuth, getProductsByCategory);
router.get('/:category/:id', optionalAuth, getProductById);

// Admin routes
router.use(authenticateToken); // All routes below require authentication

router.get('/', requireAdmin, getAllProducts);
router.post('/:category', requireAdmin, createProduct);
router.put('/:category/:id', requireAdmin, updateProduct);
router.delete('/:category/:id', requireAdmin, deleteProduct);
router.put('/:id/stock', requireAdmin, updateStock);

export default router;









