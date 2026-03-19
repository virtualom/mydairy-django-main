import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navLinks = [
    { to: '/', label: 'Entries', icon: '📝' },
    { to: '/new', label: 'Write', icon: '✍️' },
    { to: '/calendar', label: 'Calendar', icon: '📅' },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-amber-900/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">📔</span>
            <span className="font-serif text-xl font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
              MyDiary
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'bg-amber-900/30 text-amber-300 shadow-glow'
                    : 'text-cream-200/60 hover:text-cream-100 hover:bg-dark-400/50'
                }`}
              >
                <span>{link.icon}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-cream-200/50 hidden sm:block">
              👋 {user.username}
            </span>
            <button
              onClick={logout}
              className="text-sm text-red-400/70 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
