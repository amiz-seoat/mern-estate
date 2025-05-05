import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // Parse URL parameters and fetch listings
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const updatedFilters = {
      searchTerm: urlParams.get("searchTerm") || "",
      type: urlParams.get("type") || "all",
      parking: urlParams.get("parking") === "true",
      furnished: urlParams.get("furnished") === "true",
      offer: urlParams.get("offer") === "true",
      sort: urlParams.get("sort") || "created_at",
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
    const params = new URLSearchParams({
      searchTerm: filters.searchTerm,
      type: filters.type,
      parking: filters.parking,
      furnished: filters.furnished,
      offer: filters.offer,
      sort: filters.sort,
      order: filters.order,
    });
    navigate(`search?${params}`);
  };

  const handleShowMore = () => {
    setShowAll(true);
  };

  const visibleListings = showAll ? listings : listings.slice(0, 8);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar filter form */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen border-gray-400 border-solid">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Search term */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term</label>
            <input
              type="text"
              id="searchTerm"
              value={filters.searchTerm}
              onChange={handleChange}
              placeholder="Search..."
              className="border rounded-lg bg-white p-3 w-full"
            />
          </div>

          {/* Type */}
          <div className="flex flex-wrap gap-2">
            <label className="font-semibold">Type:</label>
            {["all", "rent", "sale"].map((type) => (
              <div key={type} className="flex gap-2">
                <input
                  type="checkbox"
                  id={type}
                  className="w-5"
                  onChange={handleChange}
                  checked={filters.type === type}
                />
                <span className="capitalize">{type}</span>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={filters.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={filters.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={filters.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              className="bg-white rounded-lg p-2"
              value={`${filters.sort}_${filters.order}`}
              onChange={handleChange}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="created_at_desc">Latest</option>
              <option value="created_at_asc">Oldest</option>
            </select>
          </div>

          {/* Submit */}
          <button className="p-3 rounded-lg bg-slate-700 text-white uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      {/* Listing display */}
      <div className="font-semibold text-2xl text-center mt-7 text-slate-700 flex-1">
        <h1>Listing Results</h1>
        <div className="p-7 flex flex-wrap gap-4">
          {loading && <p className="text-xl text-slate-700">Loading...</p>}
          {!loading && visibleListings.length === 0 && (
            <p className="text-xl text-slate-700">No listings found!</p>
          )}
          {!loading &&
            visibleListings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {!loading && hasMore && !showAll && (
            <button
              onClick={handleShowMore}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
