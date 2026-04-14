import { BookOpenText, ChartColumnBig, LayoutDashboard, LogOut, Menu, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-ink text-white' : 'text-slate-600 hover:bg-white hover:text-ink'
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-mist/80 backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-ink p-3 text-white">
            <BookOpenText size={20} />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-ink">Book Engine</p>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">MongoDB Aggregations</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/analytics" className={navClass}>
            Analytics
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
          ) : null}
          {isAuthenticated ? (
            <NavLink to="/import" className={navClass}>
              Import
            </NavLink>
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
                {user?.name}
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-2xl bg-white p-3 lg:hidden">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="section-shell pb-4 lg:hidden">
          <div className="glass-panel flex flex-col gap-3 p-4">
            <NavLink to="/" onClick={() => setOpen(false)} className={navClass}>
              <span className="inline-flex items-center gap-2">
                <BookOpenText size={16} />
                Home
              </span>
            </NavLink>
            <NavLink to="/analytics" onClick={() => setOpen(false)} className={navClass}>
              <span className="inline-flex items-center gap-2">
                <ChartColumnBig size={16} />
                Analytics
              </span>
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" onClick={() => setOpen(false)} className={navClass}>
                  <span className="inline-flex items-center gap-2">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </span>
                </NavLink>
                <NavLink to="/import" onClick={() => setOpen(false)} className={navClass}>
                  <span className="inline-flex items-center gap-2">
                    <Upload size={16} />
                    Import
                  </span>
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-ink">
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-ink px-4 py-2 text-center text-sm font-semibold text-white">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
