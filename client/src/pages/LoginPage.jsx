import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell flex min-h-[75vh] items-center justify-center py-16">
      <div className="glass-panel w-full max-w-lg p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">Welcome back</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-ink">Log in to your reading dashboard</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Use a seeded account like <span className="font-semibold">maya@example.com</span> / <span className="font-semibold">password123</span>.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-teal"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-teal"
          />
          {error ? <p className="text-sm font-medium text-coral">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          New here?{' '}
          <Link to="/register" className="font-semibold text-teal">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

