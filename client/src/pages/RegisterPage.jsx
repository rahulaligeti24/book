import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    preferred_genres: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const genres = ['Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 'Drama', 'Literary Fiction'];

  const toggleGenre = (genre) => {
    setFormData((current) => ({
      ...current,
      preferred_genres: current.preferred_genres.includes(genre)
        ? current.preferred_genres.filter((item) => item !== genre)
        : [...current.preferred_genres, genre]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell flex min-h-[75vh] items-center justify-center py-16">
      <div className="glass-panel w-full max-w-2xl p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">Create account</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-ink">Start your personalized book journey</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Full name"
              value={formData.name}
              onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-teal"
            />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-teal"
            />
          </div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-teal"
          />
          <div>
            <p className="text-sm font-semibold text-slate-600">Preferred genres</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    formData.preferred_genres.includes(genre)
                      ? 'bg-ink text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
          {error ? <p className="text-sm font-medium text-coral">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-teal">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

