import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, setDarkMode } = useResumeStore();
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

  const isActive = (href: string) => {
    return location.pathname === href ? 'text-primary font-semibold' : 'text-muted hover:text-light-dark dark:hover:text-white';
  };

  return (
    <nav className="sticky top-0 z-40 frosted-glass border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-sora font-bold text-dark dark:text-white">
            Resume<span className="text-primary">IQ</span>
          </Link>

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

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
