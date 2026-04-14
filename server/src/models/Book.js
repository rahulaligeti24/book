import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    genres: {
      type: [String],
      required: true,
      default: []
    },
    keywords: {
      type: [String],
      required: true,
      default: []
    },
    average_rating: {
      type: Number,
      default: 0
    },
    coverImage: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

bookSchema.index({ title: 'text', author: 'text', genres: 'text', keywords: 'text' });

export const Book = mongoose.model('Book', bookSchema);

