import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ListingForm from "../components/ui/ListingForm";
import useDocumentTitle from "../hooks/useDocumentTitle";
import toast from "react-hot-toast";
import { apiUrl } from "../utils/api";

export default function UpdateListing() {
  useDocumentTitle("Update Listing");
  const { currentUser } = useSelector((state) => state.user);
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(apiUrl(`/api/listing/get/${listingId}`), { credentials: "include" });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        setPageLoading(false);
        return;
      }
      setInitialData(data);
      setPageLoading(false);
    };
    fetchListing();
  }, [params.listingId]);

  const handleSubmit = async (formData) => {
    if (formData.imageUrls.length < 1) {
      toast.error("You must upload at least one image");
      return setError("You must upload at least one image");
    }
    if (+formData.regularPrice < +formData.discountPrice) {
      toast.error("Discount price must be lower than regular price");
      return setError("Discount price must be lower than regular price");
    }

    try {
      setLoading(true);
      setError(false);
      const res = await fetch(apiUrl(`/api/listing/update/${params.listingId}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message || "Something went wrong.");
        toast.error(data.message || "Something went wrong.");
        return;
      }

      toast.success("Listing updated successfully!");
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to update listing.");
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
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
          <p className="text-slate-500 text-sm">Loading listing data...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex justify-center py-24">
        <p className="text-slate-500">Listing not found.</p>
      </div>
    );
  }

  return (
    <ListingForm
      title="Update Listing"
      subtitle="Modify the details of your property listing."
      submitLabel="Update Listing"
      loadingLabel="Updating..."
      initialData={initialData}
      onFormSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
