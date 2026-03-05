import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  SwiperSkeleton,
  ListingSectionSkeleton,
} from "../components/ui/Skeleton";
import {
  FaSearch,
  FaArrowRight,
  FaHome,
  FaBuilding,
  FaHandshake,
  FaShieldAlt,
} from "react-icons/fa";
import { apiUrl } from "../utils/api";

export default function Home() {
  useDocumentTitle("Find Your Dream Property");
  SwiperCore.use([Navigation, Autoplay]);
  const [offerListing, setOfferListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(apiUrl("/api/listing/stats"), { credentials: "include" });
        const data = await res.json();
        if (data.totalListings !== undefined) setPlatformStats(data);
      } catch { /* silent */ }
    };
    fetchStats();
  }, []);

  const stats = [
    { icon: FaHome, value: platformStats ? platformStats.totalListings.toLocaleString() : "—", label: "Properties Listed" },
    { icon: FaBuilding, value: platformStats ? platformStats.totalCities.toLocaleString() : "—", label: "Cities Covered" },
    { icon: FaHandshake, value: platformStats ? platformStats.totalUsers.toLocaleString() : "—", label: "Happy Clients" },
    { icon: FaShieldAlt, value: "99%", label: "Satisfaction Rate" },
  ];

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch(apiUrl("/api/listing/get?offer=true&limit=4"), { credentials: "include" });
        const data = await res.json();
        setOfferListing(data);
        fetchRentListing();
      } catch (err) {
        console.log(err);
      }
    };
    const fetchRentListing = async () => {
      try {
        const res = await fetch(apiUrl("/api/listing/get?type=rent&limit=4"), { credentials: "include" });
        const data = await res.json();
        setRentListing(data);
        fetchSaleListing();
      } catch (err) {
        console.log(err);
      }
    };
    const fetchSaleListing = async () => {
      try {
        const res = await fetch(apiUrl("/api/listing/get?type=sale&limit=4"), { credentials: "include" });
        const data = await res.json();
        setSaleListing(data);
      } catch (err) {
        console.log(err);
      } finally {
        setListingsLoading(false);
      }
    };
    fetchOfferListing();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-estate-950 via-estate-900 to-estate-800 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-estate-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gold-400/5 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 bg-gold-400/10 border border-gold-400/20 rounded-full text-gold-400 text-sm font-medium mb-6">
              #1 Real Estate Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Discover Your
              <span className="block text-gold-400 mt-1">Dream Property</span>
            </h1>
            <p className="text-estate-200 text-lg mt-6 leading-relaxed max-w-lg">
              Browse thousands of premium properties. Whether you&apos;re
              buying, selling, or renting — we make real estate simple.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gold-400 hover:bg-gold-300 text-estate-950 font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-gold-400/20 hover:shadow-xl hover:shadow-gold-400/30"
              >
                <FaSearch className="h-4 w-4" />
                Browse Properties
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200 border border-white/10"
              >
                Learn More
                <FaArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-10 border-t border-white/10">
            {stats.map((stat, i) => (
              <div key={i} className="text-center sm:text-left">
                <stat.icon className="h-5 w-5 text-gold-400 mx-auto sm:mx-0 mb-2" />
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-estate-300 text-sm mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Swiper */}
      {listingsLoading && <SwiperSkeleton />}
      {!listingsLoading && offerListing && offerListing.length > 0 && (
        <section className="relative -mt-6 z-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <Swiper
              navigation
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              {offerListing.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <div className="relative">
                    <img
                      src={listing.imageUrls[0]}
                      alt={listing.name}
                      className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-xl sm:text-2xl font-bold truncate">
                        {listing.name}
                      </h3>
                      <p className="text-white/80 text-sm mt-1 truncate">
                        {listing.address}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Listing Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {listingsLoading && (
          <>
            <ListingSectionSkeleton />
            <ListingSectionSkeleton />
          </>
        )}

        {!listingsLoading && offerListing && offerListing.length > 0 && (
          <ListingSection
            title="Recent Offers"
            subtitle="Exclusive deals you won't want to miss"
            linkTo="/search?offer=true"
            listings={offerListing}
          />
        )}

        {!listingsLoading && rentListing && rentListing.length > 0 && (
          <ListingSection
            title="Places for Rent"
            subtitle="Find your next rental home"
            linkTo="/search?type=rent"
            listings={rentListing}
          />
        )}

        {!listingsLoading && saleListing && saleListing.length > 0 && (
          <ListingSection
            title="Places for Sale"
            subtitle="Properties available for purchase"
            linkTo="/search?type=sale"
            listings={saleListing}
          />
        )}
      </div>
    </div>
  );
}

function ListingSection({ title, subtitle, linkTo, listings }) {
  return (
    <section className="animate-fade-in">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
            {title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
        </div>
        <Link
          to={linkTo}
          className="hidden sm:inline-flex items-center gap-1.5 text-estate-700 dark:text-estate-300 hover:text-estate-600 dark:hover:text-estate-200 font-semibold text-sm transition-colors group"
        >
          View all
          <FaArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
      <Link
        to={linkTo}
        className="sm:hidden inline-flex items-center gap-1.5 mt-6 text-estate-700 dark:text-estate-300 hover:text-estate-600 dark:hover:text-estate-200 font-semibold text-sm transition-colors"
      >
        View all
        <FaArrowRight className="h-3 w-3" />
      </Link>
    </section>
  );
}
