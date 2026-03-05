import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { updateUserSuccess } from "../redux/user/userSlice";
import toast from "react-hot-toast";
import { apiUrl } from "../utils/api";

export default function FavoriteButton({ listingId, className = "", size = "md" }) {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [toggling, setToggling] = useState(false);

  if (!currentUser) return null;

  const isFav = currentUser.favorites?.includes(listingId);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (toggling) return;
    setToggling(true);

    try {
      const res = await fetch(apiUrl(`/api/user/favorites/${listingId}`), {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message || "Failed to update favorites.");
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success(isFav ? "Removed from favorites" : "Added to favorites");
    } catch {
      toast.error("Failed to update favorites.");
    } finally {
      setToggling(false);
    }
  };

  const iconSize = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <button
      onClick={handleToggle}
      disabled={toggling}
      className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
        isFav
          ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
          : "bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white"
      } shadow-sm backdrop-blur-sm disabled:opacity-50 ${className}`}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      title={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      {isFav ? (
        <FaHeart className={iconSize} />
      ) : (
        <FaRegHeart className={iconSize} />
      )}
    </button>
  );
}
