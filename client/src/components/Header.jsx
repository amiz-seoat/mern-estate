import React, { useEffect, useState } from "react";
import { FaSearch, FaHome, FaBars, FaTimes, FaHeart, FaMoon, FaSun } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useTheme from "../hooks/useTheme";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`search?${searchQuery}`);
    setMenuOpen(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    ...(currentUser ? [{ to: "/favorites", label: "Favorites" }] : []),
    ...(currentUser?.isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="flex justify-between items-center mx-auto max-w-6xl px-4 sm:px-6 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-estate-800 dark:bg-estate-700 p-1.5 rounded-lg">
            <FaHome className="h-4 w-4 text-gold-400" aria-hidden="true" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-estate-800 dark:text-white">Amiz</span>
            <span className="text-estate-500 dark:text-estate-400">Estate</span>
          </span>
        </Link>

        {/* Desktop Search */}
        <form
          onSubmit={handleSubmit}
          className="hidden sm:flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 w-64 lg:w-80 border border-slate-200 dark:border-slate-700 focus-within:border-estate-300 dark:focus-within:border-estate-500 focus-within:bg-white dark:focus-within:bg-slate-700 focus-within:shadow-sm transition-all duration-200"
          role="search"
        >
          <FaSearch className="text-slate-400 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search properties..."
            className="bg-transparent focus:outline-none ml-3 w-full text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search properties"
          />
        </form>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "text-estate-800 dark:text-white bg-estate-50 dark:bg-slate-800"
                  : "text-slate-600 dark:text-slate-300 hover:text-estate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? <FaSun className="h-4 w-4 text-amber-400" /> : <FaMoon className="h-4 w-4" />}
          </button>

          <Link to="/profile" className="ml-1">
            {currentUser ? (
              <img
                className="rounded-full h-8 w-8 object-cover ring-2 ring-estate-100 dark:ring-slate-700 hover:ring-estate-300 dark:hover:ring-estate-500 transition-all"
                src={currentUser.avatar}
                alt="Your profile"
              />
            ) : (
              <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-estate-800 text-white hover:bg-estate-700 transition-colors inline-block">
                Sign in
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile: theme toggle + profile + hamburger */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <FaSun className="h-4 w-4 text-amber-400" /> : <FaMoon className="h-4 w-4" />}
          </button>
          <Link to="/profile" aria-label="Profile">
            {currentUser ? (
              <img
                className="rounded-full h-8 w-8 object-cover ring-2 ring-estate-100 dark:ring-slate-700"
                src={currentUser.avatar}
                alt="Your profile"
              />
            ) : (
              <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-estate-800 text-white">
                Sign in
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 animate-fade-in">
          <div className="px-4 py-3 space-y-3">
            <form
              onSubmit={handleSubmit}
              className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700"
              role="search"
            >
              <FaSearch className="text-slate-400 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search properties..."
                className="bg-transparent focus:outline-none ml-3 w-full text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search properties"
              />
            </form>
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "text-estate-800 dark:text-white bg-estate-50 dark:bg-slate-800"
                      : "text-slate-600 dark:text-slate-300 hover:text-estate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
