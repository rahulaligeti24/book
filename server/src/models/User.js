import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    preferred_genres: {
      type: [String],
      default: []
    },
    reading_history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
      }
    ],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
      }
    ]
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);

