import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="section-shell flex min-h-[70vh] items-center justify-center py-16">
    <div className="glass-panel max-w-xl p-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">404</p>
      <h1 className="mt-4 font-display text-5xl font-bold text-ink">Page not found</h1>
      <p className="mt-4 text-base leading-8 text-slate-600">
        The route you requested does not exist in this book recommendation workspace.
      </p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal">
        Return home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
