import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-ink' : 'text-ink/60 hover:text-ink'
  }`;

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper font-display text-sm">
            CS
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            CampusShare
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/browse" className={navLinkClass}>
            Browse
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/my-listings" className={navLinkClass}>
                My Listings
              </NavLink>
              <NavLink to="/requests" className={navLinkClass}>
                Requests
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/share-item"
                className="hidden rounded-full bg-mustard px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-95 sm:block"
              >
                + Post an item
              </Link>
              <Link
                to="/profile"
                className="hidden text-sm font-medium text-ink/70 hover:text-ink sm:block"
              >
                {user?.name?.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-ink"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-ink/70 hover:text-ink"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-ink/90"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
