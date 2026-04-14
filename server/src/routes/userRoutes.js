import { Router } from 'express';
import {
  addBookmark,
  getProfile,
  getRecommendations,
  removeBookmark
} from '../controllers/userController.js';
import { ensureOwnership, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:id/profile', protect, ensureOwnership, getProfile);
router.get('/:id/recommendations', protect, ensureOwnership, getRecommendations);
router.post('/:id/bookmarks/:bookId', protect, ensureOwnership, addBookmark);
router.delete('/:id/bookmarks/:bookId', protect, ensureOwnership, removeBookmark);

export default router;

