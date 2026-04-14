import jwt from 'jsonwebtoken';

export const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      userId: user.userId,
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

export const sanitizeUser = (user) => ({
  id: user._id,
  userId: user.userId,
  name: user.name,
  email: user.email,
  preferred_genres: user.preferred_genres,
  reading_history: user.reading_history,
  bookmarks: user.bookmarks
});

