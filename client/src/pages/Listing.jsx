import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaChair,
  FaParking,
} from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
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

  if (loading) return <p className="text-center my-7 text-2xl">Loading...</p>;
  if (error) return <p className="text-center my-7 text-2xl text-red-600">Something went wrong.</p>;

  return (
    <main>
      {listing && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${url})` }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="bg-white shadow-md shadow-amber-600 rounded-lg items-center mx-auto max-w-2xl p-4 mt-8">
            <h1 className="text-xl font-semibold text-gray-800">
              {listing.name} {" - $"}
              {listing.offer
                ? +listing.regularPrice - listing.discountPrice
                : listing.regularPrice}
              /month
            </h1>
            <p className="mt-5 text-md text-gray-600 flex">
              <FaMapMarkerAlt className="text-green-600 mr-2" />
              {listing.address}
            </p>
            <div className="flex justify-center items-center ">
              <div className="max-w-2xl w-full">
                <div className="flex justify-start  items-center mt-4">
                  <div className="text-center">
                    {listing.type === "rent" ? (
                      <p className="text-lg text-blue-600 font-semibold">
                        For Rent
                      </p>
                    ) : (
                      <div className="flex justify-between gap-2">
                        <p className="mt-3 bg-red-600 max-w-[200px] rounded-md text-white text-center py-2 px-3">
                          For Sale
                        </p>
                        {listing.offer && (
                          <p className="mt-3 bg-green-600 max-w-[200px] rounded-md text-white text-center py-2 px-3">
                            ${listing.discountPrice} Discount
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-gray-700 max-w-2xl mx-auto text-center text-sm sm:text-base">
              <span className="text-black font-semibold">Description :- </span>
              {listing.description}
            </p>

            <ul className="mt-6 justify-center text-green-700 font-semibold text-sm sm:text-base flex gap-x-6 gap-y-3 items-center sm:gap-8 flex-wrap">
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} Bed`}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Bathrooms`
                  : `${listing.bathrooms} Bathroom`}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking" : "No Parking"}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Not Furnished"}
              </li>
            </ul>

            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-4"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
}
