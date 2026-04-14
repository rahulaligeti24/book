import mongoose from 'mongoose';
import { Book } from '../models/Book.js';
import { Rating } from '../models/Rating.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getSimilarBooks } from '../services/recommendationService.js';
import { recalculateAverageRating } from '../services/ratingService.js';
import { parseBooksDataset } from '../utils/datasetParser.js';

export const getBooks = asyncHandler(async (req, res) => {
  const { q = '', genre = '', limit = 20 } = req.query;
  const filters = [];

  if (q) {
    const regex = new RegExp(q, 'i');
    filters.push({
      $or: [
        { title: regex },
        { author: regex },
        { genres: regex },
        { keywords: regex }
      ]
    });
  }

  if (genre) {
    filters.push({ genres: genre });
  }

  const books = await Book.find(filters.length ? { $and: filters } : {})
    .sort({ average_rating: -1, title: 1 })
    .limit(Number(limit));

  res.json(books);
});

export const getBookById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid book id');
  }

  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  const ratingsCount = await Rating.countDocuments({ bookId: book._id });

  res.json({
    ...book.toObject(),
    ratingsCount
  });
});

export const getSimilarBooksController = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid book id');
  }

  const result = await getSimilarBooks(req.params.id);

  if (!result) {
    res.status(404);
    throw new Error('Book not found');
  }

  res.json(result);
});

export const rateBook = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid book id');
  }

  const ratingValue = Number(req.body.rating);

  if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  await Rating.findOneAndUpdate(
    {
      userId: req.user.userId,
      bookId: book._id
    },
    {
      userId: req.user.userId,
      bookId: book._id,
      rating: ratingValue
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  if (!req.user.reading_history.some((readBookId) => readBookId.toString() === book._id.toString())) {
    req.user.reading_history.push(book._id);
    await req.user.save();
  }

  await recalculateAverageRating(book._id);

  const updatedBook = await Book.findById(book._id);

  res.json({
    message: 'Rating saved successfully',
    book: updatedBook
  });
});

export const importBooksDataset = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a CSV or Excel file');
  }

  const importedBooks = parseBooksDataset(req.file.buffer, req.file.originalname);
  const replaceExisting = String(req.body.replaceExisting || 'false').toLowerCase() === 'true';

  if (replaceExisting) {
    await Book.deleteMany({});
    await Rating.deleteMany({});
    await User.updateMany({}, { $set: { reading_history: [], bookmarks: [] } });
  }

  const operations = importedBooks.map((book) => ({
    updateOne: {
      filter: {
        title: book.title,
        author: book.author
      },
      update: {
        $set: book
      },
      upsert: true
    }
  }));

  const result = await Book.bulkWrite(operations, { ordered: false });
  const totalBooks = await Book.countDocuments();

  res.status(201).json({
    message: 'Dataset imported successfully',
    replaceExisting,
    importedRows: importedBooks.length,
    insertedCount: result.upsertedCount || 0,
    updatedCount: result.modifiedCount || 0,
    totalBooks
  });
});
