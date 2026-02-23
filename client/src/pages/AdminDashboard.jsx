import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
        prev.filter((listing) => listing.userRef !== userId),
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
        prev.filter((listing) => listing._id !== listingId),
      );
    } catch (err) {
      setError(err.message || "Failed to delete listing.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center my-6">
        Admin Dashboard
      </h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-700 text-center mb-4">{error}</p>}

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="border rounded-lg p-4 text-center bg-white">
            <p className="text-gray-500">Users</p>
            <p className="text-2xl font-semibold">{stats.totalUsers}</p>
          </div>
          <div className="border rounded-lg p-4 text-center bg-white">
            <p className="text-gray-500">Listings</p>
            <p className="text-2xl font-semibold">{stats.totalListings}</p>
          </div>
          <div className="border rounded-lg p-4 text-center bg-white">
            <p className="text-gray-500">Offers</p>
            <p className="text-2xl font-semibold">{stats.offerListings}</p>
          </div>
          <div className="border rounded-lg p-4 text-center bg-white">
            <p className="text-gray-500">Rent</p>
            <p className="text-2xl font-semibold">{stats.rentListings}</p>
          </div>
          <div className="border rounded-lg p-4 text-center bg-white">
            <p className="text-gray-500">Sale</p>
            <p className="text-2xl font-semibold">{stats.saleListings}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <div className="space-y-3">
            {users.length === 0 && !loading && (
              <p className="text-gray-500">No users found.</p>
            )}
            {users.map((user) => (
              <div
                key={user._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded-lg p-3"
              >
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                    {user.isAdmin ? " • Admin" : ""}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="text-red-700 uppercase text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Listings</h2>
          <div className="space-y-3">
            {listings.length === 0 && !loading && (
              <p className="text-gray-500">No listings found.</p>
            )}
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded-lg p-3"
              >
                <div>
                  <p className="font-semibold">{listing.name}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {listing.type} • ${listing.regularPrice}
                    {listing.offer ? " • Offer" : ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    className="text-green-700 uppercase text-sm"
                    to={`/update-listing/${listing._id}`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    className="text-red-700 uppercase text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
