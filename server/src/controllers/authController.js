import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken, sanitizeUser } from '../utils/auth.js';

const getNextUserId = async () => {
  const latestUser = await User.findOne().sort({ userId: -1 }).lean();
  return latestUser ? latestUser.userId + 1 : 1001;
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, preferred_genres = [] } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    res.status(409);
    throw new Error('A user with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    userId: await getNextUserId(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    preferred_genres,
    reading_history: [],
    bookmarks: []
  });

  res.status(201).json({
    token: generateToken(user),
    user: sanitizeUser(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.json({
    token: generateToken(user),
    user: sanitizeUser(user)
  });
});

