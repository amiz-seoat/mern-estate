import { useEffect, useState, useMemo } from "react";
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
  FaArrowRight,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";

const STAT_CONFIG = [
  { key: "totalUsers", label: "Total Users", icon: FaUsers, color: "blue" },
  {
    key: "totalListings",
    label: "Total Listings",
    icon: FaHome,
    color: "emerald",
    linkTo: "/search",
  },
  {
    key: "offerListings",
    label: "Offers",
    icon: FaTag,
    color: "amber",
    linkTo: "/search?offer=true",
  },
  {
    key: "rentListings",
    label: "For Rent",
    icon: FaKey,
    color: "violet",
    linkTo: "/search?type=rent",
  },
  {
    key: "saleListings",
    label: "For Sale",
    icon: FaDollarSign,
    color: "rose",
    linkTo: "/search?type=sale",
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
  const [userSearch, setUserSearch] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);

  const usersMap = useMemo(() => {
    const map = {};
    users.forEach((u) => { map[u._id] = u; });
    return map;
  }, [users]);

  const userListingsMap = useMemo(() => {
    const map = {};
    listings.forEach((l) => {
      if (!map[l.userRef]) map[l.userRef] = [];
      map[l.userRef].push(l);
    });
    return map;
  }, [listings]);

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const q = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

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
            const content = (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className={colors.icon}>
                    <stat.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  {stat.linkTo && (
                    <FaArrowRight className={`h-3 w-3 ${colors.icon} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200`} />
                  )}
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {stats[stat.key]}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
              </>
            );

            const cardClass = `${colors.bg} border ${colors.border} rounded-2xl p-5 transition-all duration-200 hover:shadow-md group ${stat.linkTo ? "cursor-pointer hover:-translate-y-0.5" : ""}`;

            return stat.linkTo ? (
              <Link
                key={stat.key}
                to={stat.linkTo}
                className={cardClass}
                aria-label={`View all ${stat.label.toLowerCase()}`}
              >
                {content}
              </Link>
            ) : (
              <div key={stat.key} className={cardClass}>
                {content}
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
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Users</h2>
                  <p className="text-sm text-slate-500">
                    {filteredUsers.length === users.length
                      ? `${users.length} registered`
                      : `${filteredUsers.length} of ${users.length} shown`}
                  </p>
                </div>
                <FaUsers className="text-slate-300 h-5 w-5" aria-hidden="true" />
              </div>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by username or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-estate-400 focus:ring-2 focus:ring-estate-100 outline-none transition-all placeholder:text-slate-400"
                  aria-label="Search users"
                />
              </div>
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filteredUsers.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <FaUsers className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">
                    {userSearch ? "No users match your search." : "No users found."}
                  </p>
                </div>
              )}
              {filteredUsers.map((user) => {
                const isExpanded = expandedUserId === user._id;
                const userListings = userListingsMap[user._id] || [];
                return (
                  <div key={user._id}>
                    <div className={`px-6 py-4 flex items-center justify-between gap-3 transition-colors cursor-pointer ${isExpanded ? "bg-estate-50/50" : "hover:bg-slate-50/80"}`}>
                      <div
                        className="flex items-center gap-3 min-w-0 flex-1"
                        onClick={() => setExpandedUserId(isExpanded ? null : user._id)}
                      >
                        <img
                          src={user.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                          alt={user.username}
                          className="h-10 w-10 rounded-full object-cover border-2 border-slate-100 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-slate-800 truncate">
                              {user.username}
                            </p>
                            {user.isAdmin && (
                              <span className="px-2 py-0.5 text-[11px] font-semibold bg-violet-100 text-violet-700 rounded-full shrink-0">
                                Admin
                              </span>
                            )}
                            <span className="px-2 py-0.5 text-[11px] font-semibold bg-estate-100 text-estate-700 rounded-full shrink-0">
                              {userListings.length} {userListings.length === 1 ? "listing" : "listings"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 truncate">{user.email}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setExpandedUserId(isExpanded ? null : user._id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-estate-600 hover:bg-estate-50 transition-colors cursor-pointer"
                          aria-label={isExpanded ? "Collapse user listings" : "Expand user listings"}
                          title={isExpanded ? "Collapse" : "Show listings"}
                        >
                          {isExpanded ? <FaChevronUp className="h-3 w-3" /> : <FaChevronDown className="h-3 w-3" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          aria-label={`Delete user ${user.username}`}
                          title="Delete user"
                        >
                          <FaTrash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="bg-slate-50/80 border-t border-slate-100 px-6 py-3 animate-fade-in">
                        {userListings.length === 0 ? (
                          <p className="text-sm text-slate-400 py-3 text-center">
                            This user has no listings.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                              Listings by {user.username}
                            </p>
                            {userListings.map((listing) => (
                              <Link
                                key={listing._id}
                                to={`/listing/${listing._id}`}
                                className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-100 hover:border-estate-200 hover:shadow-sm transition-all group"
                              >
                                <img
                                  src={listing.imageUrls?.[0] || ""}
                                  alt={listing.name}
                                  className="h-12 w-12 rounded-lg object-cover shrink-0"
                                  loading="lazy"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-slate-800 truncate group-hover:text-estate-700 transition-colors">
                                    {listing.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full capitalize ${listing.type === "rent" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                                      {listing.type}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      ${listing.regularPrice?.toLocaleString()}
                                    </span>
                                    {listing.offer && (
                                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 rounded-full">
                                        Offer
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <FaExternalLinkAlt className="h-3 w-3 text-slate-300 group-hover:text-estate-500 shrink-0 transition-colors" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Listings Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Listings</h2>
                <p className="text-sm text-slate-500">{listings.length} total</p>
              </div>
              <FaHome className="text-slate-300 h-5 w-5" aria-hidden="true" />
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {listings.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <FaHome className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No listings found.</p>
                </div>
              )}
              {listings.map((listing) => {
                const creator = usersMap[listing.userRef];
                return (
                  <div
                    key={listing._id}
                    className="px-6 py-4 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Link
                        to={`/listing/${listing._id}`}
                        className="shrink-0 overflow-hidden rounded-lg"
                      >
                        <img
                          src={listing.imageUrls?.[0] || ""}
                          alt={listing.name}
                          className="h-16 w-16 object-cover hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/listing/${listing._id}`}
                          className="font-medium text-slate-800 truncate block hover:text-estate-700 transition-colors"
                        >
                          {listing.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full capitalize ${listing.type === "rent" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                            {listing.type}
                          </span>
                          <span className="text-sm text-slate-500">
                            ${listing.regularPrice?.toLocaleString()}
                          </span>
                          {listing.offer && (
                            <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-700 rounded-full">
                              Offer
                            </span>
                          )}
                        </div>
                        {creator ? (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <img
                              src={creator.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                              alt={creator.username}
                              className="h-4 w-4 rounded-full object-cover"
                            />
                            <span className="text-xs text-slate-500">
                              by <span className="font-medium text-slate-600">{creator.username}</span>
                            </span>
                            <span className="text-xs text-slate-300">|</span>
                            <span className="text-xs text-slate-400">{creator.email}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <FaUser className="h-3 w-3 text-slate-300" />
                            <span className="text-xs text-slate-400 italic">Unknown user</span>
                          </div>
                        )}
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Link
                          to={`/listing/${listing._id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-estate-600 hover:bg-estate-50 transition-colors"
                          aria-label={`View listing ${listing.name}`}
                          title="View detail"
                        >
                          <FaExternalLinkAlt className="h-3 w-3" />
                        </Link>
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
