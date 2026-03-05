import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaHome,
  FaDollarSign,
  FaTag,
  FaParking,
  FaChair,
  FaSlidersH,
  FaTimes,
  FaSortAmountDown,
  FaChevronDown,
  FaMapMarkerAlt,
} from "react-icons/fa";
import ListingItem from "../components/ListingItem";
import Button from "../components/ui/Button";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { SearchResultsSkeleton } from "../components/ui/Skeleton";
import { apiUrl } from "../utils/api";

const TYPE_OPTIONS = [
  { id: "all", label: "All Types", icon: FaHome },
  { id: "rent", label: "For Rent", icon: FaHome },
  { id: "sale", label: "For Sale", icon: FaDollarSign },
];

const FEATURE_OPTIONS = [
  { id: "offer", label: "Offers", icon: FaTag },
  { id: "parking", label: "Parking", icon: FaParking },
  { id: "furnished", label: "Furnished", icon: FaChair },
];

const SORT_OPTIONS = [
  { value: "regularPrice_desc", label: "Price: High to Low" },
  { value: "regularPrice_asc", label: "Price: Low to High" },
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
];

export default function Search() {
  useDocumentTitle("Search Properties");
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const updatedFilters = {
      searchTerm: urlParams.get("searchTerm") || "",
      type: urlParams.get("type") || "all",
      parking: urlParams.get("parking") === "true",
      furnished: urlParams.get("furnished") === "true",
      offer: urlParams.get("offer") === "true",
      sort: urlParams.get("sort") || "createdAt",
      order: urlParams.get("order") || "desc",
    };
    setFilters(updatedFilters);

    const fetchListings = async () => {
      setLoading(true);
      setShowAll(false);
      const res = await fetch(apiUrl(`/api/listing/get?${urlParams}`), { credentials: "include" });
      const data = await res.json();
      setListings(data);
      setHasMore(data.length > 8);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "searchTerm") {
      setFilters({ ...filters, searchTerm: value });
    } else if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setFilters({ ...filters, sort, order });
    } else if (["all", "rent", "sale"].includes(id)) {
      setFilters({ ...filters, type: id });
    } else {
      setFilters({ ...filters, [id]: checked });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const typeParam = filters.type === "all" ? "false" : filters.type;
    const params = new URLSearchParams({
      searchTerm: filters.searchTerm,
      type: typeParam,
      parking: filters.parking,
      furnished: filters.furnished,
      offer: filters.offer,
      sort: filters.sort,
      order: filters.order,
    });
    navigate(`/search?${params}`);
    setMobileFiltersOpen(false);
  };

  const handleShowMore = () => {
    setShowAll(true);
  };

  const activeFilterCount = [
    filters.type !== "all",
    filters.offer,
    filters.parking,
    filters.furnished,
  ].filter(Boolean).length;

  const visibleListings = showAll ? listings : listings.slice(0, 8);

  const filterPanel = (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Search Input */}
      <div>
        <label
          htmlFor="searchTerm"
          className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block"
        >
          Search
        </label>
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            id="searchTerm"
            value={filters.searchTerm}
            onChange={handleChange}
            placeholder="Search by name, location..."
            className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-estate-500/30 focus:border-estate-500 transition-all"
          />
        </div>
      </div>

      {/* Property Type */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Property Type
        </p>
        <div className="grid grid-cols-3 gap-2">
          {TYPE_OPTIONS.map((t) => (
            <label
              key={t.id}
              htmlFor={t.id}
              className={`relative flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border cursor-pointer transition-all text-center ${
                filters.type === t.id
                  ? "border-estate-500 bg-estate-50 dark:bg-estate-900/40 text-estate-700 dark:text-estate-300 shadow-sm shadow-estate-500/10"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <input
                type="checkbox"
                id={t.id}
                className="sr-only"
                onChange={handleChange}
                checked={filters.type === t.id}
              />
              <t.icon
                className={`h-4 w-4 ${
                  filters.type === t.id
                    ? "text-estate-600 dark:text-estate-400"
                    : "text-slate-400 dark:text-slate-500"
                }`}
                aria-hidden="true"
              />
              <span className="text-xs font-semibold">{t.label}</span>
              {filters.type === t.id && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-estate-500 rounded-full border-2 border-white dark:border-slate-900" />
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800" />

      {/* Features */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Features
        </p>
        <div className="space-y-2">
          {FEATURE_OPTIONS.map((f) => (
            <label
              key={f.id}
              htmlFor={f.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                filters[f.id]
                  ? "border-estate-500 bg-estate-50 dark:bg-estate-900/40 shadow-sm shadow-estate-500/10"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  filters[f.id]
                    ? "border-estate-500 bg-estate-500"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {filters[f.id] && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <f.icon
                className={`h-3.5 w-3.5 ${
                  filters[f.id]
                    ? "text-estate-600 dark:text-estate-400"
                    : "text-slate-400 dark:text-slate-500"
                }`}
                aria-hidden="true"
              />
              <span
                className={`text-sm font-medium ${
                  filters[f.id]
                    ? "text-estate-700 dark:text-estate-300"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {f.label}
              </span>
              <input
                type="checkbox"
                id={f.id}
                className="sr-only"
                onChange={handleChange}
                checked={filters[f.id]}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800" />

      {/* Sort */}
      <div>
        <label
          htmlFor="sort_order"
          className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block"
        >
          Sort By
        </label>
        <div className="relative">
          <FaSortAmountDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <select
            id="sort_order"
            className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-estate-500/30 focus:border-estate-500 transition-all cursor-pointer appearance-none"
            value={`${filters.sort}_${filters.order}`}
            onChange={handleChange}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 dark:text-slate-500 pointer-events-none" />
        </div>
      </div>

      <Button type="submit" className="!py-3 !rounded-xl w-full">
        <FaSearch className="h-3.5 w-3.5" />
        Search Properties
      </Button>
    </form>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950">
      {/* Search Hero Header */}
      <div className="bg-gradient-to-br from-estate-900 via-estate-800 to-estate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-estate-400/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <FaMapMarkerAlt className="h-4 w-4 text-gold-400" />
              <span className="text-estate-200 text-sm font-medium">
                Browse all locations
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Find Your Perfect Property
            </h1>
            <p className="text-estate-200 mt-2 text-base max-w-lg">
              Use filters to narrow down your search and discover properties that match your needs.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Mobile filter toggle bar */}
        <div className="lg:hidden sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-estate-50 dark:bg-estate-900/40 text-estate-700 dark:text-estate-300 text-sm font-semibold border border-estate-200 dark:border-estate-800 transition-colors cursor-pointer"
              aria-expanded={mobileFiltersOpen}
            >
              <FaSlidersH className="h-3.5 w-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-estate-600 text-white text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {!loading && (
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {listings.length} {listings.length === 1 ? "result" : "results"}
              </span>
            )}
          </div>
        </div>

        {/* Mobile filters overlay */}
        {mobileFiltersOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-fade-in-up">
              <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                  Filters
                </h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors cursor-pointer"
                  aria-label="Close filters"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6">{filterPanel}</div>
            </div>
          </>
        )}

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[320px] shrink-0 -mt-6 relative z-20">
          <div className="sticky top-20 mx-4 mb-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-estate-800 to-estate-700">
                <div className="flex items-center gap-2">
                  <FaSlidersH className="h-4 w-4 text-gold-400" />
                  <h2 className="text-base font-bold text-white">
                    Filter Properties
                  </h2>
                </div>
                {activeFilterCount > 0 && (
                  <p className="text-estate-200 text-xs mt-1">
                    {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                  </p>
                )}
              </div>
              <div className="p-6">{filterPanel}</div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                {filters.searchTerm
                  ? `Results for "${filters.searchTerm}"`
                  : "All Properties"}
              </h2>
              {!loading && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Showing{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {visibleListings.length}
                  </span>
                  {visibleListings.length < listings.length && (
                    <>
                      {" "}of{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {listings.length}
                      </span>
                    </>
                  )}
                  {" "}{listings.length === 1 ? "property" : "properties"}
                </p>
              )}
            </div>

            {/* Active filters chips — desktop */}
            {activeFilterCount > 0 && !loading && (
              <div className="hidden sm:flex items-center gap-2 flex-wrap">
                {filters.type !== "all" && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-estate-50 dark:bg-estate-900/40 text-estate-700 dark:text-estate-300 border border-estate-200 dark:border-estate-800">
                    {filters.type === "rent" ? "For Rent" : "For Sale"}
                  </span>
                )}
                {filters.offer && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Offers
                  </span>
                )}
                {filters.parking && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Parking
                  </span>
                )}
                {filters.furnished && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Furnished
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Loading Skeleton */}
          {loading && <SearchResultsSkeleton />}

          {/* Empty State */}
          {!loading && visibleListings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 px-6">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                <FaHome className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2 text-center">
                No properties found
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6">
                We couldn&apos;t find any properties matching your current filters. Try adjusting your search criteria.
              </p>
              <button
                onClick={() => navigate("/search")}
                className="px-6 py-2.5 rounded-xl bg-estate-600 hover:bg-estate-500 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Results Grid */}
          {!loading && visibleListings.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
              {visibleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}

          {/* Show More */}
          {!loading && hasMore && !showAll && (
            <div className="mt-12 text-center">
              <button
                onClick={handleShowMore}
                className="group inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-estate-700 dark:text-estate-300 font-semibold text-sm shadow-sm hover:shadow-md hover:border-estate-300 dark:hover:border-estate-700 transition-all cursor-pointer"
              >
                Show more results
                <FaChevronDown className="h-3 w-3 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
