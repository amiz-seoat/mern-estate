import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ListingForm from "../components/ui/ListingForm";
import useDocumentTitle from "../hooks/useDocumentTitle";
import toast from "react-hot-toast";

export default function CreateListing() {
  useDocumentTitle("Create Listing");
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      const res = await fetch("/api/listing/create", {
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

      toast.success("Listing created successfully!");
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to create listing.");
      setLoading(false);
    }
  };

  return (
    <ListingForm
      title="Create a Listing"
      subtitle="Add a new property to the marketplace."
      submitLabel="Create Listing"
      loadingLabel="Creating..."
      onFormSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
