import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getUserRecommendations } from '../services/recommendationService.js';
import { sanitizeUser } from '../utils/auth.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ userId: Number(req.params.id) })
    .populate('reading_history')
    .populate('bookmarks');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    user: sanitizeUser(user),
    reading_history: user.reading_history,
    bookmarks: user.bookmarks
  });
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const result = await getUserRecommendations(Number(req.params.id));

  if (!result) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(result);
});

export const addBookmark = asyncHandler(async (req, res) => {
  const user = await User.findOne({ userId: Number(req.params.id) });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.bookId)) {
    res.status(400);
    throw new Error('Invalid book id');
  }

  const bookId = req.params.bookId;

  if (!user.bookmarks.some((bookmarkId) => bookmarkId.toString() === bookId)) {
    user.bookmarks.push(bookId);
    await user.save();
  }

  const populatedUser = await User.findById(user._id).populate('bookmarks');

  res.json({
    message: 'Book added to bookmarks',
    bookmarks: populatedUser.bookmarks
  });
});

export const removeBookmark = asyncHandler(async (req, res) => {
  const user = await User.findOne({ userId: Number(req.params.id) });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.bookmarks = user.bookmarks.filter((bookmarkId) => bookmarkId.toString() !== req.params.bookId);
  await user.save();

  const populatedUser = await User.findById(user._id).populate('bookmarks');

  res.json({
    message: 'Book removed from bookmarks',
    bookmarks: populatedUser.bookmarks
  });
});

