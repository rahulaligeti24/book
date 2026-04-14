import { Router } from 'express';
import {
  highestRatedBooks,
  popularBooks,
  topAuthors
} from '../controllers/analyticsController.js';

const router = Router();

router.get('/popular-books', popularBooks);
router.get('/top-authors', topAuthors);
router.get('/highest-rated-books', highestRatedBooks);

export default router;

