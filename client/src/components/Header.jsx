import React, { useEffect, useState } from "react";
import { FaSearch, FaHome, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    ...(currentUser?.isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="flex justify-between items-center mx-auto max-w-6xl px-4 sm:px-6 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-estate-800 p-1.5 rounded-lg">
            <FaHome className="h-4 w-4 text-gold-400" aria-hidden="true" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-estate-800">Amiz</span>
            <span className="text-estate-500">Estate</span>
          </span>
        </Link>

        {/* Desktop Search */}
        <form
          onSubmit={handleSubmit}
          className="hidden sm:flex items-center bg-slate-50 rounded-xl px-4 py-2 w-64 lg:w-80 border border-slate-200 focus-within:border-estate-300 focus-within:bg-white focus-within:shadow-sm transition-all duration-200"
          role="search"
        >
          <FaSearch
            className="text-slate-400 h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search properties..."
            className="bg-transparent focus:outline-none ml-3 w-full text-sm text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search properties"
          />
        </form>

        {/* Desktop Nav */}
        <nav
          className="hidden sm:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "text-estate-800 bg-estate-50"
                  : "text-slate-600 hover:text-estate-700 hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/profile" className="ml-2">
            {currentUser ? (
              <img
                className="rounded-full h-8 w-8 object-cover ring-2 ring-estate-100 hover:ring-estate-300 transition-all"
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

        {/* Mobile: profile + hamburger */}
        <div className="sm:hidden flex items-center gap-3">
          <Link to="/profile" aria-label="Profile">
            {currentUser ? (
              <img
                className="rounded-full h-8 w-8 object-cover ring-2 ring-estate-100"
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
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <FaTimes className="h-5 w-5" />
            ) : (
              <FaBars className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-3">
            <form
              onSubmit={handleSubmit}
              className="flex items-center bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200"
              role="search"
            >
              <FaSearch
                className="text-slate-400 h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search properties..."
                className="bg-transparent focus:outline-none ml-3 w-full text-sm text-slate-700 placeholder:text-slate-400"
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
                      ? "text-estate-800 bg-estate-50"
                      : "text-slate-600 hover:text-estate-700 hover:bg-slate-50"
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
