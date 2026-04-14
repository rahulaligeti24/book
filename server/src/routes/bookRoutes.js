import { Router } from 'express';
import {
  getBookById,
  getBooks,
  importBooksDataset,
  getSimilarBooksController,
  rateBook
} from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadBookDataset } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', getBooks);
router.post('/import', protect, uploadBookDataset.single('dataset'), importBooksDataset);
router.get('/:id', getBookById);
router.get('/:id/similar', getSimilarBooksController);
router.post('/:id/rate', protect, rateBook);

export default router;
