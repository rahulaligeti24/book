import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line
} from 'recharts';
import api from '../api/client';
import ChartPanel from '../components/ChartPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import SectionHeader from '../components/SectionHeader';

const AnalyticsPage = () => {
  const [popularBooks, setPopularBooks] = useState([]);
  const [topAuthors, setTopAuthors] = useState([]);
  const [highestRatedBooks, setHighestRatedBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('Science Fiction');
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async (genre = selectedGenre) => {
    setLoading(true);
    try {
      const [popularResponse, authorsResponse, highestRatedResponse] = await Promise.all([
        api.get('/analytics/popular-books'),
        api.get('/analytics/top-authors', { params: { genre } }),
        api.get('/analytics/highest-rated-books')
      ]);

      setPopularBooks(popularResponse.data);
      setTopAuthors(authorsResponse.data);
      setHighestRatedBooks(highestRatedResponse.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics(selectedGenre);
  }, [selectedGenre]);

  if (loading) {
    return (
      <div className="section-shell py-16">
        <LoadingSpinner label="Crunching analytics..." />
      </div>
    );
  }

  return (
    <div className="section-shell py-16">
      <SectionHeader
        eyebrow="Analytics Dashboard"
        title="Recommendation engine insights"
        description="MongoDB aggregation results rendered into responsive charts for popularity, author performance, and top-rated titles."
        action={
          <select
            value={selectedGenre}
            onChange={(event) => setSelectedGenre(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 outline-none"
          >
            {['Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Drama'].map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        }
      />

      <div className="grid gap-8 xl:grid-cols-2">
        <ChartPanel title="Most popular books" description="Ranked by total ratings count using `$group`, `$lookup`, `$sort`, and `$limit`.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={popularBooks.slice(0, 6)} margin={{ top: 10, right: 10, left: -20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="title" angle={-25} textAnchor="end" interval={0} height={90} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ratingsCount" fill="#14b8a6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title={`Top authors in ${selectedGenre}`} description="Grouped by author and sorted by average book rating and count.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topAuthors} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="author" angle={-15} textAnchor="end" interval={0} height={70} tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="averageBookRating" fill="#f97316" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <div className="xl:col-span-2">
          <ChartPanel title="Highest rated books" description="Books with at least two ratings, ordered by average rating and supporting count.">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={highestRatedBooks.slice(0, 8)} margin={{ top: 10, right: 10, left: -20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="title" angle={-20} textAnchor="end" interval={0} height={80} tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="average_rating" stroke="#0f172a" strokeWidth={3} dot={{ fill: '#14b8a6', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
