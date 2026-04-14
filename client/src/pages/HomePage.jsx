import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import SectionHeader from '../components/SectionHeader';

const genres = ['Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 'Drama'];

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBooks = async (params = {}) => {
    const { data } = await api.get('/books', { params: { limit: 24, ...params } });
    setBooks(data);
  };

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [booksResponse, popularResponse] = await Promise.all([
          api.get('/books', { params: { limit: 24 } }),
          api.get('/analytics/popular-books')
        ]);

        setBooks(booksResponse.data);
        setPopularBooks(popularResponse.data.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const featuredBooks = useMemo(() => books.slice(0, 6), [books]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      await fetchBooks({ q: search, genre: selectedGenre || undefined });
    } finally {
      setLoading(false);
    }
  };

  const handleGenreSelect = async (genre) => {
    const nextGenre = selectedGenre === genre ? '' : genre;
    setSelectedGenre(nextGenre);
    setLoading(true);
    try {
      await fetchBooks({ q: search, genre: nextGenre || undefined });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden bg-hero py-20">
        <div className="soft-grid absolute inset-0 opacity-40" />
        <div className="section-shell relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-teal shadow-soft">
              <Sparkles size={16} />
              Content-based recommendations with MongoDB aggregations
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-tight text-ink md:text-6xl">
              Discover books through genre, author, keywords, and reader behavior.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Explore a polished recommendation engine that combines content similarity, personalized reading paths, and live analytics for books and authors.
            </p>
            <div className="mt-8">
              <SearchBar value={search} onChange={setSearch} onSubmit={handleSearch} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreSelect(genre)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedGenre === genre ? 'bg-ink text-white' : 'bg-white/80 text-slate-600 hover:bg-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6">
            <div className="rounded-[28px] bg-ink p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70">Trending now</p>
                  <h2 className="mt-3 font-display text-3xl font-bold">Reader favorites</h2>
                </div>
                <TrendingUp className="text-coral" />
              </div>
              <div className="mt-6 space-y-4">
                {popularBooks.map((book, index) => (
                  <div key={book._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal">#{index + 1}</p>
                        <h3 className="mt-2 font-semibold">{book.title}</h3>
                        <p className="mt-1 text-sm text-white/70">{book.author}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{book.ratingsCount} ratings</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/analytics"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-teal hover:text-white"
              >
                Explore analytics
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-16">
        <SectionHeader
          eyebrow="Featured Recommendations"
          title="Handpicked discovery shelf"
          description="A responsive card layout showcasing top titles from the current query and rating mix."
        />
        {loading ? (
          <LoadingSpinner label="Fetching books..." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;

