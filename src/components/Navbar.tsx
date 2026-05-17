import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { useAuthStore } from '../store/authStore';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, setDarkMode } = useResumeStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/analyze', label: 'Analyze' },
    { href: '/keywords', label: 'Keywords' },
    { href: '/format', label: 'Formatter' },
    { href: '/cover-letter', label: 'Cover Letter' },
    { href: '/history', label: 'History' },
  ];

  const isActive = (href: string) =>
    location.pathname === href
      ? 'text-primary font-semibold'
      : 'text-muted hover:text-light-dark dark:hover:text-white';

  return (
    <nav className="sticky top-0 z-40 frosted-glass border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-sora font-bold text-dark dark:text-white">
            Resume<span className="text-primary">IQ</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${isActive(link.href)}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-muted">
                  Hi, <span className="font-semibold text-dark dark:text-white">{user.name.split(' ')[0]}</span>
                </span>
                <button onClick={logout} className="pill-btn-ghost text-sm">
                  Log Out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="pill-btn-ghost text-sm">
                  Log in
                </Link>
                <Link to="/signup" className="pill-btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${isActive(link.href)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
              {user ? (
                <div className="px-4 space-y-2">
                  <p className="text-sm text-muted">
                    Logged in as <span className="font-semibold text-dark dark:text-white">{user.name}</span>
                  </p>
                  <button
                    onClick={logout}
                    className="pill-btn-ghost text-sm w-full text-center"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="px-4 space-y-2">
                  <Link to="/login" className="block pill-btn-ghost text-sm text-center">
                    Log in
                  </Link>
                  <Link to="/signup" className="block pill-btn-primary text-sm text-center">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}