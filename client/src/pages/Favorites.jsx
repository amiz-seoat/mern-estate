import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaSearch } from "react-icons/fa";
import ListingItem from "../components/ListingItem";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { apiUrl } from "../utils/api";

export default function Favorites() {
  useDocumentTitle("My Favorites");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(apiUrl("/api/user/favorites"), {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setListings(data);
      } catch {
        setError("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-estate-600"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
          <FaHeart className="text-rose-500 h-6 w-6" />
          My Favorites
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Properties you've saved for later.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-3 text-sm text-rose-600 dark:text-rose-400 mb-6">
          {error}
        </div>
      )}

      {!error && listings.length === 0 && (
        <div className="text-center py-20">
          <FaHeart className="h-16 w-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">
            No favorites yet
          </h2>
          <p className="text-slate-400 dark:text-slate-500 mb-6 max-w-md mx-auto">
            Start browsing properties and tap the heart icon to save them here.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-estate-800 text-white rounded-xl font-semibold text-sm hover:bg-estate-700 transition-colors"
          >
            <FaSearch className="h-3.5 w-3.5" />
            Browse Properties
          </Link>
        </div>
      )}

      {listings.length > 0 && (
        <div className="flex flex-wrap gap-6">
          {listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
