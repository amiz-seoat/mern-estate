import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { account, storage } from "../appwrite/appwriteconfig.js";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice.js";
import { ID } from "appwrite";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaPlus,
  FaSignOutAlt,
  FaTrash,
  FaEdit,
  FaHome,
  FaChevronDown,
  FaChevronUp,
  FaExclamationCircle,
} from "react-icons/fa";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import useDocumentTitle from "../hooks/useDocumentTitle";
import toast from "react-hot-toast";
import { apiUrl } from "../utils/api";

export default function Profile() {
  useDocumentTitle("My Profile");
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [imageUrl, setImageUrl] = useState("");
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listingsVisible, setListingsVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (imageUrl) {
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
    }
  }, [imageUrl]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    try {
      const fileId = ID.unique();
      const response = await storage.createFile(
        "67fcceb30033ff389be2",
        fileId,
        file
      );
      console.log("Upload successful:", response);

      const imageUrl = storage.getFileView(
        "67fcceb30033ff389be2",
        response.$id
      );
      setImageUrl(imageUrl);
      console.log(imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(apiUrl(`/api/user/update/${currentUser._id}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      toast.success("Profile updated successfully.");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error.message || "Failed to update profile.");
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(apiUrl(`/api/user/delete/${currentUser._id}`), {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("Account deleted.");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error.message || "Failed to delete account.");
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(apiUrl("/api/auth/signout"), { credentials: "include" });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      toast.success("Signed out successfully.");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      toast.error("Failed to sign out.");
    }
  };

  const handleShowListings = async () => {
    if (listingsVisible) {
      setListingsVisible(false);
      return;
    }
    try {
      setShowListingsError(false);
      const res = await fetch(apiUrl(`/api/user/listings/${currentUser._id}`), {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
      setListingsVisible(true);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(apiUrl(`/api/listing/delete/${listingId}`), {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      toast.success("Listing deleted.");
    } catch (error) {
      toast.error("Failed to delete listing.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in-up">
      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Gradient Header */}
        <div className="h-28 sm:h-32 bg-gradient-to-r from-estate-900 via-estate-800 to-estate-600 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(240,192,64,0.15),transparent_60%)]" />
        </div>

        {/* Avatar */}
        <div className="px-6 -mt-14 relative z-10">
          <div className="relative inline-block">
            <input
              onChange={handleFileChange}
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
            />
            <img
              onClick={() => fileRef.current.click()}
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
              src={imageUrl || currentUser.avatar}
              alt="Profile"
            />
            <button
              onClick={() => fileRef.current.click()}
              className="absolute bottom-1.5 right-1.5 bg-estate-800 hover:bg-estate-700 text-white p-2 rounded-full shadow-md transition-colors cursor-pointer"
              aria-label="Change profile photo"
              type="button"
            >
              <FaCamera className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 pt-4">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
            Profile Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Update your personal information and account details.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="username"
              type="text"
              label="Username"
              placeholder="Username"
              icon={FaUser}
              defaultValue={currentUser.username}
              onChange={handleChange}
            />
            <Input
              id="email"
              type="email"
              label="Email address"
              placeholder="Email"
              icon={FaEnvelope}
              defaultValue={currentUser.email}
              onChange={handleChange}
            />
            <Input
              id="password"
              type="password"
              label="New password"
              placeholder="Leave blank to keep current"
              icon={FaLock}
              onChange={handleChange}
            />

            <Button type="submit" loading={loading} className="mt-1">
              Update Profile
            </Button>
          </form>
        </div>
      </div>

      {/* Actions Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mt-6">
        <Link
          to="/create-listing"
          className="flex items-center justify-center gap-2.5 w-full px-6 py-3.5 rounded-xl font-semibold text-sm tracking-wide bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:shadow-xl transition-all duration-200"
        >
          <FaPlus className="h-3.5 w-3.5" />
          Create New Listing
        </Link>

        <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleDeleteUser}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FaTrash className="h-3 w-3" />
            Delete account
          </button>
          <button
            onClick={handleSignOut}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FaSignOutAlt className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>

      {/* Listings Section */}
      <div className="mt-6">
        <button
          onClick={handleShowListings}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-estate-700 dark:text-estate-300 hover:text-estate-600 dark:hover:text-estate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <FaHome className="h-3.5 w-3.5" />
          {listingsVisible ? "Hide My Listings" : "Show My Listings"}
          {listingsVisible ? (
            <FaChevronUp className="h-3 w-3" />
          ) : (
            <FaChevronDown className="h-3 w-3" />
          )}
        </button>

        {showListingsError && (
          <div
            className="mt-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-3 flex items-center gap-2"
            role="alert"
          >
            <FaExclamationCircle className="text-rose-500 h-4 w-4 shrink-0" />
            <p className="text-sm text-rose-600">
              Error loading listings. Please try again.
            </p>
          </div>
        )}

        {listingsVisible && userListings && userListings.length > 0 && (
          <div className="mt-4 space-y-3 animate-fade-in">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              Your Listings ({userListings.length})
            </h2>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
              >
                <Link
                  to={`/listing/${listing._id}`}
                  className="shrink-0 overflow-hidden rounded-lg"
                >
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className="h-16 w-16 object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>
                <Link
                  to={`/listing/${listing._id}`}
                  className="flex-1 min-w-0"
                >
                  <p className="font-medium text-slate-800 dark:text-slate-100 truncate hover:text-estate-700 transition-colors">
                    {listing.name}
                  </p>
                </Link>
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    to={`/update-listing/${listing._id}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-estate-600 hover:bg-estate-50 dark:hover:bg-estate-900/30 transition-colors"
                    aria-label={`Edit ${listing.name}`}
                    title="Edit"
                  >
                    <FaEdit className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    aria-label={`Delete ${listing.name}`}
                    title="Delete"
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {listingsVisible && userListings && userListings.length === 0 && (
          <div className="mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center animate-fade-in">
            <FaHome className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              You haven&apos;t created any listings yet.
            </p>
            <Link
              to="/create-listing"
              className="inline-flex items-center gap-1.5 mt-3 text-estate-700 hover:text-estate-600 font-semibold text-sm transition-colors"
            >
              <FaPlus className="h-3 w-3" />
              Create your first listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
