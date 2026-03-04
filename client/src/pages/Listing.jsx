import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaChair,
  FaParking,
  FaExclamationCircle,
  FaPhone,
} from "react-icons/fa";
import Contact from "../components/Contact";
import Button from "../components/ui/Button";

const AMENITIES = [
  {
    key: "bedrooms",
    icon: FaBed,
    label: (v) => (v > 1 ? `${v} Bedrooms` : `${v} Bedroom`),
  },
  {
    key: "bathrooms",
    icon: FaBath,
    label: (v) => (v > 1 ? `${v} Bathrooms` : `${v} Bathroom`),
  },
  {
    key: "parking",
    icon: FaParking,
    label: (v) => (v ? "Parking Available" : "No Parking"),
    isBool: true,
  },
  {
    key: "furnished",
    icon: FaChair,
    label: (v) => (v ? "Furnished" : "Unfurnished"),
    isBool: true,
  },
];

export default function Listing() {
  SwiperCore.use([Navigation, Autoplay]);
  const currentUser = useSelector((state) => state.user?.currentUser);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [contact, setContact] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  if (loading) {
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
          <p className="text-slate-500 text-sm">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <FaExclamationCircle className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-semibold text-slate-600 mb-1">
          Something went wrong
        </h2>
        <p className="text-sm text-slate-400">
          We couldn&apos;t load this property. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <main className="animate-fade-in-up">
      {listing && (
        <>
          {/* Image Gallery */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
            <Swiper
              navigation
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div className="relative">
                    <img
                      src={url}
                      alt={listing.name}
                      className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Property Info */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 sm:p-8">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      listing.type === "rent"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {listing.type === "rent" ? "For Rent" : "For Sale"}
                  </span>
                  {listing.offer && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      Special Offer
                    </span>
                  )}
                </div>

                {/* Name */}
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                  {listing.name}
                </h1>

                {/* Address */}
                <div className="flex items-center gap-2 mt-3 text-slate-500">
                  <FaMapMarkerAlt
                    className="h-4 w-4 text-estate-500 shrink-0"
                    aria-hidden="true"
                  />
                  <p className="text-sm sm:text-base">{listing.address}</p>
                </div>

                {/* Price */}
                <div className="mt-5 flex items-baseline gap-3">
                  <p className="text-3xl sm:text-4xl font-bold text-estate-800">
                    $
                    {listing.offer
                      ? listing.discountPrice.toLocaleString("en-US")
                      : listing.regularPrice.toLocaleString("en-US")}
                    {listing.type === "rent" && (
                      <span className="text-lg font-normal text-slate-400">
                        /mo
                      </span>
                    )}
                  </p>
                  {listing.offer && (
                    <p className="text-lg text-slate-400 line-through">
                      ${listing.regularPrice.toLocaleString("en-US")}
                    </p>
                  )}
                </div>
                {listing.offer && (
                  <p className="text-sm text-emerald-600 font-medium mt-1">
                    You save $
                    {(
                      +listing.regularPrice - +listing.discountPrice
                    ).toLocaleString("en-US")}
                  </p>
                )}
              </div>

              {/* Amenities Grid */}
              <div className="border-t border-slate-100 px-6 sm:px-8 py-6">
                <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">
                  Property Details
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {AMENITIES.map((amenity) => {
                    const value = listing[amenity.key];
                    const isPositive = amenity.isBool ? value : true;
                    return (
                      <div
                        key={amenity.key}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                          isPositive
                            ? "border-estate-100 bg-estate-50/50"
                            : "border-slate-100 bg-slate-50/50"
                        }`}
                      >
                        <amenity.icon
                          className={`h-4 w-4 shrink-0 ${
                            isPositive ? "text-estate-600" : "text-slate-400"
                          }`}
                          aria-hidden="true"
                        />
                        <span
                          className={`text-sm font-medium ${
                            isPositive ? "text-estate-700" : "text-slate-500"
                          }`}
                        >
                          {amenity.label(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-slate-100 px-6 sm:px-8 py-6">
                <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">
                  Description
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Contact Info */}
              {listing.contact && (
                <div className="border-t border-slate-100 px-6 sm:px-8 py-6">
                  <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">
                    Contact Information
                  </h2>
                  <div className="flex items-center gap-2 text-slate-600">
                    <FaPhone
                      className="h-3.5 w-3.5 text-estate-500"
                      aria-hidden="true"
                    />
                    <p>{listing.contact}</p>
                  </div>
                </div>
              )}

              {/* Contact Landlord */}
              {currentUser &&
                listing.userRef !== currentUser._id &&
                !contact && (
                  <div className="border-t border-slate-100 px-6 sm:px-8 py-6">
                    <Button onClick={() => setContact(true)} fullWidth={false}>
                      Contact Landlord
                    </Button>
                  </div>
                )}
              {contact && (
                <div className="border-t border-slate-100 px-6 sm:px-8 py-6">
                  <Contact listing={listing} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
