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
} from "react-icons/fa";
import ListingItem from "../components/ListingItem";
import Button from "../components/ui/Button";

const TYPE_OPTIONS = [
  { id: "all", label: "All", icon: FaHome },
  { id: "rent", label: "Rent", icon: FaHome },
  { id: "sale", label: "Sale", icon: FaDollarSign },
];

const SORT_OPTIONS = [
  { value: "regularPrice_desc", label: "Price: High to Low" },
  { value: "regularPrice_asc", label: "Price: Low to High" },
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
];

export default function Search() {
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
      const res = await fetch(`/api/listing/get?${urlParams}`);
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

  const visibleListings = showAll ? listings : listings.slice(0, 8);

  const filterContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Search Input */}
      <div>
        <label
          htmlFor="searchTerm"
          className="text-sm font-medium text-slate-700 mb-1.5 block"
        >
          Search
        </label>
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            id="searchTerm"
            value={filters.searchTerm}
            onChange={handleChange}
            placeholder="Keywords..."
            className="w-full border-2 border-slate-200 bg-slate-50/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-estate-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Property Type */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Property Type</p>
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((t) => (
            <label
              key={t.id}
              htmlFor={t.id}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                filters.type === t.id
                  ? "border-estate-500 bg-estate-50 text-estate-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <input
                type="checkbox"
                id={t.id}
                className="sr-only"
                onChange={handleChange}
                checked={filters.type === t.id}
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Features</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "offer", label: "Offers", icon: FaTag },
            { id: "parking", label: "Parking", icon: FaParking },
            { id: "furnished", label: "Furnished", icon: FaChair },
          ].map((f) => (
            <label
              key={f.id}
              htmlFor={f.id}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                filters[f.id]
                  ? "border-estate-500 bg-estate-50 text-estate-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <input
                type="checkbox"
                id={f.id}
                className="sr-only"
                onChange={handleChange}
                checked={filters[f.id]}
              />
              <f.icon className="h-3 w-3" aria-hidden="true" />
              {f.label}
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label
          htmlFor="sort_order"
          className="text-sm font-medium text-slate-700 mb-1.5 block"
        >
          Sort By
        </label>
        <select
          id="sort_order"
          className="w-full border-2 border-slate-200 bg-slate-50/80 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-estate-500 focus:bg-white transition-colors cursor-pointer appearance-auto"
          value={`${filters.sort}_${filters.order}`}
          onChange={handleChange}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="!py-2.5">
        <FaSearch className="h-3.5 w-3.5" />
        Search
      </Button>
    </form>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
      {/* Mobile filter toggle */}
      <div className="lg:hidden border-b border-slate-200 bg-white px-4 py-3">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer"
          aria-expanded={mobileFiltersOpen}
        >
          <FaSlidersH className="h-4 w-4" />
          {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Mobile filters panel */}
      {mobileFiltersOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 animate-fade-in">
          {filterContent}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-80 shrink-0 bg-white border-r border-slate-200">
        <div className="p-6 sticky top-16">{filterContent}</div>
      </aside>

      {/* Results */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Search Results
          </h1>
          {!loading && (
            <p className="text-sm text-slate-500">
              {listings.length} {listings.length === 1 ? "property" : "properties"} found
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
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
              <p className="text-slate-500 text-sm">Searching properties...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && visibleListings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <FaHome className="h-16 w-16 text-slate-200 mb-4" />
            <h2 className="text-lg font-semibold text-slate-600 mb-1">
              No properties found
            </h2>
            <p className="text-sm text-slate-400">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && visibleListings.length > 0 && (
          <div className="flex flex-wrap gap-6 animate-fade-in">
            {visibleListings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          </div>
        )}

        {/* Show More */}
        {!loading && hasMore && !showAll && (
          <div className="mt-10 text-center">
            <button
              onClick={handleShowMore}
              className="px-6 py-2.5 rounded-xl border-2 border-estate-200 text-estate-700 font-semibold text-sm hover:bg-estate-50 transition-colors cursor-pointer"
            >
              Show more results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
