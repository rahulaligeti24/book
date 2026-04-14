import { useEffect, useState } from 'react';
import { Bookmark, BookOpen, Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import RatingStars from '../components/RatingStars';
import SectionHeader from '../components/SectionHeader';
import { useAuth } from '../hooks/useAuth';

const BookDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  const loadDetails = async () => {
    setLoading(true);
    try {
      const requests = [api.get(`/books/${id}`), api.get(`/books/${id}/similar`)];

      if (isAuthenticated && user?.userId) {
        requests.push(api.get(`/users/${user.userId}/profile`));
      }

      const responses = await Promise.all(requests);
      setBook(responses[0].data);
      setSimilarBooks(responses[1].data.recommendations);

      if (responses[2]) {
        setProfile(responses[2].data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id, isAuthenticated, user?.userId]);

  const handleBookmark = async () => {
    if (!isAuthenticated || !user?.userId) return;

    await api.post(`/users/${user.userId}/bookmarks/${book._id}`);
    setStatusMessage('Book saved to bookmarks.');
    await loadDetails();
  };

  const handleRating = async (rating) => {
    if (!isAuthenticated) return;

    await api.post(`/books/${book._id}/rate`, { rating });
    setStatusMessage(`You rated this book ${rating} stars.`);
    await loadDetails();
  };

  const bookmarked = profile?.bookmarks?.some((item) => item._id === book?._id);

  if (loading) {
    return (
      <div className="section-shell py-16">
        <LoadingSpinner label="Loading book details..." />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="section-shell py-16">
        <div className="glass-panel p-10 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">Book not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell py-16">
      <section className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="overflow-hidden rounded-[32px] bg-white shadow-soft">
          <img src={book.coverImage} alt={book.title} className="h-full min-h-[520px] w-full object-cover" />
        </div>

        <div className="glass-panel p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">{book.genres.join(' • ')}</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-ink">{book.title}</h1>
          <p className="mt-4 text-lg text-slate-500">by {book.author}</p>
          <p className="mt-6 text-base leading-8 text-slate-600">{book.description}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Average rating</p>
              <p className="mt-3 font-display text-4xl font-bold text-ink">{book.average_rating?.toFixed(1)}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Ratings count</p>
              <p className="mt-3 font-display text-4xl font-bold text-ink">{book.ratingsCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Keywords</p>
              <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{book.keywords.join(', ')}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-white">
              <BookOpen size={18} />
              Detailed recommendation profile
            </div>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleBookmark}
                className={`inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold transition ${
                  bookmarked ? 'bg-coral text-white' : 'bg-white text-ink hover:bg-teal hover:text-white'
                }`}
              >
                <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
                {bookmarked ? 'Saved' : 'Save book'}
              </button>
            ) : null}
          </div>

          <div className="mt-8 rounded-[28px] border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <Star className="text-gold" size={18} />
              <h2 className="font-display text-2xl font-bold text-ink">Rate this book</h2>
            </div>
            <p className="mt-2 text-sm text-slate-500">Submitting a rating updates the book average and analytics in MongoDB.</p>
            <div className="mt-4">
              <RatingStars value={book.average_rating} interactive={isAuthenticated} onRate={handleRating} />
            </div>
            {!isAuthenticated ? <p className="mt-3 text-sm text-coral">Log in to rate or bookmark books.</p> : null}
            {statusMessage ? <p className="mt-3 text-sm font-medium text-teal">{statusMessage}</p> : null}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionHeader
          eyebrow="Similar Books"
          title="Top 5 content-based matches"
          description="These recommendations come from MongoDB aggregation scoring across genre overlap, keyword overlap, author similarity, ratings, and sorting."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {similarBooks.map((item) => (
            <BookCard key={item._id} book={item} showScore scoreKey="similarityScore" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default BookDetailsPage;
