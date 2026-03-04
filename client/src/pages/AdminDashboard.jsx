import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaHome,
  FaTag,
  FaKey,
  FaDollarSign,
  FaTrash,
  FaEdit,
  FaExclamationCircle,
  FaRedo,
} from "react-icons/fa";

const STAT_CONFIG = [
  { key: "totalUsers", label: "Total Users", icon: FaUsers, color: "blue" },
  {
    key: "totalListings",
    label: "Total Listings",
    icon: FaHome,
    color: "emerald",
  },
  { key: "offerListings", label: "Offers", icon: FaTag, color: "amber" },
  { key: "rentListings", label: "For Rent", icon: FaKey, color: "violet" },
  {
    key: "saleListings",
    label: "For Sale",
    icon: FaDollarSign,
    color: "rose",
  },
];

const COLOR_MAP = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100" },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    border: "border-emerald-100",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    border: "border-amber-100",
  },
  violet: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
    border: "border-violet-100",
  },
  rose: { bg: "bg-rose-50", icon: "text-rose-600", border: "border-rose-100" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      const [statsRes, usersRes, listingsRes] = await Promise.all([
        fetch("/api/admin/stats", { credentials: "include" }),
        fetch("/api/admin/users", { credentials: "include" }),
        fetch("/api/admin/listings", { credentials: "include" }),
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const listingsData = await listingsRes.json();

      if (statsData.success === false) throw new Error(statsData.message);
      if (usersData.success === false) throw new Error(usersData.message);
      if (listingsData.success === false) throw new Error(listingsData.message);

      setStats(statsData);
      setUsers(usersData);
      setListings(listingsData);
    } catch (err) {
      setError(err.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Delete this user and their listings?");
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) throw new Error(data.message);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      setListings((prev) =>
        prev.filter((listing) => listing.userRef !== userId)
      );
    } catch (err) {
      setError(err.message || "Failed to delete user.");
    }
  };

  const handleDeleteListing = async (listingId) => {
    const confirmed = window.confirm("Delete this listing?");
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) throw new Error(data.message);
      setListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (err) {
      setError(err.message || "Failed to delete listing.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Manage users, listings, and monitor platform activity.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="animate-spin h-8 w-8 text-estate-600"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-slate-500 text-sm">Loading dashboard data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 mb-8 flex items-start gap-3"
          role="alert"
        >
          <FaExclamationCircle className="text-rose-500 h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-rose-800">{error}</p>
            <button
              onClick={fetchAll}
              className="text-sm text-rose-600 hover:text-rose-800 font-medium mt-1.5 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FaRedo className="h-3 w-3" />
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {STAT_CONFIG.map((stat) => {
            const colors = COLOR_MAP[stat.color];
            return (
              <div
                key={stat.key}
                className={`${colors.bg} border ${colors.border} rounded-2xl p-5 transition-shadow hover:shadow-md`}
              >
                <div className={`${colors.icon} mb-3`}>
                  <stat.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {stats[stat.key]}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Users & Listings Panels */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Users</h2>
                <p className="text-sm text-slate-500">
                  {users.length} registered
                </p>
              </div>
              <FaUsers
                className="text-slate-300 h-5 w-5"
                aria-hidden="true"
              />
            </div>
            <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
              {users.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <FaUsers className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No users found.</p>
                </div>
              )}
              {users.map((user) => (
                <div
                  key={user._id}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800 truncate">
                        {user.username}
                      </p>
                      {user.isAdmin && (
                        <span className="px-2 py-0.5 text-[11px] font-semibold bg-violet-100 text-violet-700 rounded-full shrink-0">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                    aria-label={`Delete user ${user.username}`}
                    title="Delete user"
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Listings Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Listings
                </h2>
                <p className="text-sm text-slate-500">
                  {listings.length} total
                </p>
              </div>
              <FaHome
                className="text-slate-300 h-5 w-5"
                aria-hidden="true"
              />
            </div>
            <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
              {listings.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <FaHome className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No listings found.</p>
                </div>
              )}
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate">
                      {listing.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span
                        className={`px-2 py-0.5 text-[11px] font-semibold rounded-full capitalize ${
                          listing.type === "rent"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {listing.type}
                      </span>
                      <span className="text-sm text-slate-500">
                        ${listing.regularPrice.toLocaleString()}
                      </span>
                      {listing.offer && (
                        <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-700 rounded-full">
                          Offer
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      to={`/update-listing/${listing._id}`}
                      className="p-2 rounded-lg text-slate-400 hover:text-estate-600 hover:bg-estate-50 transition-colors"
                      aria-label={`Edit listing ${listing.name}`}
                      title="Edit listing"
                    >
                      <FaEdit className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteListing(listing._id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      aria-label={`Delete listing ${listing.name}`}
                      title="Delete listing"
                    >
                      <FaTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
