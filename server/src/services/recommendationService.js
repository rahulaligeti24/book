import mongoose from 'mongoose';
import { Book } from '../models/Book.js';
import { User } from '../models/User.js';

export const getSimilarBooks = async (bookId) => {
  const targetBook = await Book.findById(bookId).lean();

  if (!targetBook) {
    return null;
  }

  const recommendations = await Book.aggregate([
    {
      $match: {
        _id: { $ne: new mongoose.Types.ObjectId(bookId) }
      }
    },
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
        genreOverlap: {
          $size: {
            $setIntersection: ['$genres', targetBook.genres]
          }
        },
        keywordOverlap: {
          $size: {
            $setIntersection: ['$keywords', targetBook.keywords]
          }
        },
        authorMatch: {
          $cond: [{ $eq: ['$author', targetBook.author] }, 1, 0]
        },
        ratingsCount: { $size: '$ratings' }
      }
    },
    {
      $addFields: {
        similarityScore: {
          $add: [
            { $multiply: ['$genreOverlap', 3] },
            { $multiply: ['$keywordOverlap', 2] },
            { $multiply: ['$authorMatch', 4] },
            { $multiply: ['$average_rating', 0.4] },
            { $multiply: ['$ratingsCount', 0.15] }
          ]
        }
      }
    },
    {
      $sort: {
        similarityScore: -1,
        average_rating: -1,
        title: 1
      }
    },
    { $limit: 5 },
    {
      $project: {
        ratings: 0
      }
    }
  ]);

  return { targetBook, recommendations };
};

export const getUserRecommendations = async (userId) => {
  const user = await User.findOne({ userId }).populate('reading_history').lean();

  if (!user) {
    return null;
  }

  const excludedIds = user.reading_history.map((book) => book._id);
  const historyKeywords = [...new Set(user.reading_history.flatMap((book) => book.keywords || []))];

  const recommendations = await Book.aggregate([
    {
      $match: {
        _id: { $nin: excludedIds }
      }
    },
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
        genreMatches: {
          $size: {
            $setIntersection: ['$genres', user.preferred_genres]
          }
        },
        keywordMatches: {
          $size: {
            $setIntersection: ['$keywords', historyKeywords]
          }
        },
        ratingsCount: { $size: '$ratings' }
      }
    },
    {
      $addFields: {
        personalizedScore: {
          $add: [
            { $multiply: ['$genreMatches', 3] },
            { $multiply: ['$keywordMatches', 2] },
            { $multiply: ['$average_rating', 0.4] },
            { $multiply: ['$ratingsCount', 0.15] }
          ]
        }
      }
    },
    {
      $match: {
        $or: [{ genreMatches: { $gt: 0 } }, { keywordMatches: { $gt: 0 } }]
      }
    },
    {
      $sort: {
        personalizedScore: -1,
        average_rating: -1,
        title: 1
      }
    },
    { $limit: 8 },
    {
      $project: {
        ratings: 0
      }
    }
  ]);

  return {
    user,
    recommendations
  };
};

