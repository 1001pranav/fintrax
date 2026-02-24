"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span className="text-white font-bold text-lg md:text-xl">F</span>
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Fintrax
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              How It Works
            </Link>
            <Link
              href="#about"
              className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              About Us
            </Link>
            <Link
              href="#contact"
              className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-gray-900 dark:text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="#features"
              className="block text-slate-300 hover:text-white transition-colors duration-200 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block text-slate-300 hover:text-white transition-colors duration-200 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#about"
              className="block text-slate-300 hover:text-white transition-colors duration-200 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="#contact"
              className="block text-slate-300 hover:text-white transition-colors duration-200 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 border-t  border-gray-200 dark:border-white/10 space-y-3">
              <Link
                href="/login"
                className="block w-full text-center px-4 py-2.5 text-slate-300 hover:text-white transition-colors duration-200 font-medium border  border-gray-300 dark:border-white/20 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-gray-900 dark:text-white font-semibold rounded-lg shadow-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
