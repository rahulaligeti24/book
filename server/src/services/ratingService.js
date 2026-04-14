import { Rating } from '../models/Rating.js';
import { Book } from '../models/Book.js';

export const recalculateAverageRating = async (bookId) => {
  const result = await Rating.aggregate([
    {
      $match: { bookId }
    },
    {
      $group: {
        _id: '$bookId',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  const averageRating = result[0]?.averageRating ?? 0;

  await Book.findByIdAndUpdate(bookId, {
    average_rating: Number(averageRating.toFixed(2))
  });
};

