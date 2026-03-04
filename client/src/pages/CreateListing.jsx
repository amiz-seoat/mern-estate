import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ListingForm from "../components/ui/ListingForm";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    if (formData.imageUrls.length < 1)
      return setError("You must upload at least one image");
    if (+formData.regularPrice < +formData.discountPrice)
      return setError("Discount price must be lower than regular price");

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
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
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
