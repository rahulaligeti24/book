import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SectionHeader from '../components/SectionHeader';
import StatCard from '../components/StatCard';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    if (!user?.userId) return;

    setLoading(true);
    try {
      const [profileResponse, recommendationsResponse] = await Promise.all([
        api.get(`/users/${user.userId}/profile`),
        api.get(`/users/${user.userId}/recommendations`)
      ]);

      setProfile(profileResponse.data);
      setRecommendations(recommendationsResponse.data.recommendations);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user?.userId]);

  const handleBookmarkToggle = async (bookId) => {
    const isBookmarked = profile?.bookmarks?.some((book) => book._id === bookId);

    if (isBookmarked) {
      await api.delete(`/users/${user.userId}/bookmarks/${bookId}`);
    } else {
      await api.post(`/users/${user.userId}/bookmarks/${bookId}`);
    }

    await loadDashboard();
  };

  const bookmarkIds = useMemo(
    () => new Set(profile?.bookmarks?.map((book) => book._id) || []),
    [profile?.bookmarks]
  );

  useEffect(() => {
    if (profile?.user) {
      setUser((current) => (current ? { ...current, bookmarks: profile.user.bookmarks } : current));
    }
  }, [profile?.user, setUser]);

  if (loading) {
    return (
      <div className="section-shell py-16">
        <LoadingSpinner label="Building your dashboard..." />
      </div>
    );
  }

  return (
    <div className="section-shell py-16">
      <section className="rounded-[32px] bg-hero p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">Personalized Dashboard</p>
        <h1 className="mt-4 font-display text-5xl font-bold text-ink">Welcome back, {profile?.user?.name?.split(' ')[0]}</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
          Your recommendation feed excludes books in your reading history and boosts matches based on preferred genres and keywords from prior reads.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <StatCard label="Preferred Genres" value={profile?.user?.preferred_genres?.length ?? 0} />
        <StatCard label="Reading History" value={profile?.reading_history?.length ?? 0} tone="coral" />
        <StatCard label="Bookmarks" value={profile?.bookmarks?.length ?? 0} />
      </section>

      <section className="mt-14">
        <SectionHeader
          eyebrow="Recommended For You"
          title="Unread books ranked by personalized score"
          description="This list uses MongoDB aggregation to combine preferred genre overlap, reading-history keyword overlap, rating strength, and popularity."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onBookmark={handleBookmarkToggle}
              bookmarked={bookmarkIds.has(book._id)}
              showScore
              scoreKey="personalizedScore"
            />
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-10 xl:grid-cols-2">
        <div>
          <SectionHeader
            eyebrow="Reading History"
            title="Books shaping your profile"
            description="Previously read titles influence personalized keyword matching."
          />
          <div className="grid gap-6">
            {profile?.reading_history?.map((book) => (
              <div key={book._id} className="glass-panel flex gap-4 p-4">
                <img src={book.coverImage} alt={book.title} className="h-28 w-24 rounded-2xl object-cover" />
                <div>
                  <h3 className="font-display text-2xl font-bold text-ink">{book.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{book.author}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{book.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader
            eyebrow="Bookmarks"
            title="Saved for later"
            description="Keep standout recommendations close and revisit them quickly."
          />
          <div className="grid gap-6">
            {profile?.bookmarks?.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onBookmark={handleBookmarkToggle}
                bookmarked={bookmarkIds.has(book._id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;

