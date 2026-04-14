import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/db.js';
import { Book } from '../models/Book.js';
import { User } from '../models/User.js';
import { Rating } from '../models/Rating.js';
import { books, ratings, users } from './data.js';
import { recalculateAverageRating } from '../services/ratingService.js';

dotenv.config();

const seedDatabase = async () => {
  await connectDatabase();

  await Promise.all([Book.deleteMany({}), User.deleteMany({}), Rating.deleteMany({})]);

  const createdBooks = await Book.insertMany(books);
  const bookMap = new Map(createdBooks.map((book) => [book.title, book]));

  const createdUsers = [];

  for (const [index, user] of users.entries()) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const createdUser = await User.create({
      userId: 1001 + index,
      name: user.name,
      email: user.email,
      passwordHash,
      preferred_genres: user.preferred_genres,
      reading_history: user.reading_history_titles.map((title) => bookMap.get(title)._id),
      bookmarks: user.bookmark_titles.map((title) => bookMap.get(title)._id)
    });

    createdUsers.push(createdUser);
  }

  const userMap = new Map(createdUsers.map((user) => [user.email, user]));

  await Rating.insertMany(
    ratings.map((rating) => ({
      userId: userMap.get(rating.email).userId,
      bookId: bookMap.get(rating.bookTitle)._id,
      rating: rating.rating
    }))
  );

  for (const book of createdBooks) {
    await recalculateAverageRating(book._id);
  }

  console.log('Database seeded successfully');
  process.exit(0);
};

seedDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});
