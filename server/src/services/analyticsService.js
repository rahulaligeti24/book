import { Rating } from '../models/Rating.js';
import { Book } from '../models/Book.js';

export const getPopularBooks = async () =>
  Rating.aggregate([
    {
      $group: {
        _id: '$bookId',
        ratingsCount: { $sum: 1 },
        averageUserRating: { $avg: '$rating' }
      }
    },
    {
      $lookup: {
        from: 'books',
        localField: '_id',
        foreignField: '_id',
        as: 'book'
      }
    },
    { $unwind: '$book' },
    {
      $project: {
        _id: '$book._id',
        title: '$book.title',
        author: '$book.author',
        coverImage: '$book.coverImage',
        average_rating: '$book.average_rating',
        ratingsCount: 1,
        averageUserRating: { $round: ['$averageUserRating', 2] }
      }
    },
    {
      $sort: {
        ratingsCount: -1,
        average_rating: -1,
        title: 1
      }
    },
    { $limit: 10 }
  ]);

export const getTopAuthorsByGenre = async (genre) => {
  const matchStage = genre ? { genres: genre } : {};

  return Book.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$author',
        booksCount: { $sum: 1 },
        averageBookRating: { $avg: '$average_rating' }
      }
    },
    {
      $project: {
        _id: 0,
        author: '$_id',
        booksCount: 1,
        averageBookRating: { $round: ['$averageBookRating', 2] }
      }
    },
    {
      $sort: {
        averageBookRating: -1,
        booksCount: -1,
        author: 1
      }
    },
    { $limit: 8 }
  ]);
};

export const getHighestRatedBooks = async () =>
  Book.aggregate([
    {
      $lookup: {
        from: 'ratings',
        localField: '_id',
        foreignField: 'bookId',
        as: 'ratings'
      }
    },
    {
      $addFields: {
        ratingsCount: { $size: '$ratings' }
      }
    },
    {
      $match: {
        ratingsCount: { $gte: 2 }
      }
    },
    {
      $sort: {
        average_rating: -1,
        ratingsCount: -1,
        title: 1
      }
    },
    { $limit: 10 },
    {
      $project: {
        ratings: 0
      }
    }
  ]);
