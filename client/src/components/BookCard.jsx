import { Bookmark, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { formatGenres, truncateText } from '../utils/formatters';

const BookCard = ({ book, onBookmark, bookmarked = false, showScore = false, scoreKey = 'similarityScore' }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
    <div className="relative h-56 overflow-hidden">
      <img
        src={book.coverImage}
        alt={book.title}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      {showScore && book[scoreKey] ? (
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">
          <Sparkles size={14} className="text-coral" />
          Score {book[scoreKey].toFixed(1)}
        </div>
      ) : null}
      {onBookmark ? (
        <button
          type="button"
          onClick={() => onBookmark(book._id)}
          className={`absolute right-4 top-4 rounded-full p-3 transition ${
            bookmarked ? 'bg-coral text-white' : 'bg-white/90 text-ink hover:bg-teal hover:text-white'
          }`}
        >
          <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
      ) : null}
    </div>

    <div className="flex flex-1 flex-col p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-coral">{formatGenres(book.genres)}</p>
      <h3 className="mt-3 font-display text-2xl font-bold text-ink">{book.title}</h3>
      <p className="mt-2 text-sm font-medium text-slate-500">by {book.author}</p>
      <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{truncateText(book.description, 128)}</p>
      <div className="mt-5 flex items-center justify-between">
        <RatingStars value={book.average_rating} />
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {book.average_rating?.toFixed(1) ?? '0.0'}
        </span>
      </div>
      <Link
        to={`/books/${book._id}`}
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal"
      >
        View Details
      </Link>
    </div>
  </article>
);

export default BookCard;
