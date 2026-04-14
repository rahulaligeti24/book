import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getHighestRatedBooks,
  getPopularBooks,
  getTopAuthorsByGenre
} from '../services/analyticsService.js';

export const popularBooks = asyncHandler(async (req, res) => {
  const books = await getPopularBooks();
  res.json(books);
});

export const topAuthors = asyncHandler(async (req, res) => {
  const authors = await getTopAuthorsByGenre(req.query.genre || '');
  res.json(authors);
});

export const highestRatedBooks = asyncHandler(async (req, res) => {
  const books = await getHighestRatedBooks();
  res.json(books);
});
