import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaBed, FaBath } from "react-icons/fa";
import FavoriteButton from "./FavoriteButton";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23e2e8f0'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function ListingItem({ listing }) {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-slate-900/50 hover:-translate-y-1 transition-all duration-300 w-full border border-slate-100 dark:border-slate-800">
      <Link to={`/listing/${listing._id}`} aria-label={`View ${listing.name}`}>
        <div className="relative overflow-hidden">
          <img
            src={listing.imageUrls[0] || PLACEHOLDER_IMAGE}
            alt={listing.name}
            className="h-[220px] w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm ${
                listing.type === "rent"
                  ? "bg-blue-500 text-white"
                  : "bg-emerald-500 text-white"
              }`}
            >
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </span>
          </div>
          {listing.offer && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-amber-900 shadow-sm">
                Special Offer
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 right-3 z-10">
            <FavoriteButton listingId={listing._id} />
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg leading-snug truncate">
            {listing.name}
          </h3>

          <div className="flex items-center gap-1.5">
            <MdLocationOn
              className="h-4 w-4 text-estate-500 shrink-0"
              aria-hidden="true"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{listing.address}</p>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-lg font-bold text-estate-800 dark:text-estate-300">
                $
                {listing.offer
                  ? listing.discountPrice.toLocaleString("en-US")
                  : listing.regularPrice.toLocaleString("en-US")}
                {listing.type === "rent" && (
                  <span className="text-sm font-normal text-slate-400">
                    /mo
                  </span>
                )}
              </p>
              {listing.offer && (
                <p className="text-xs text-slate-400 line-through">
                  ${listing.regularPrice.toLocaleString("en-US")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1" title="Bedrooms">
                <FaBed className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="text-xs font-medium">{listing.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1" title="Bathrooms">
                <FaBath className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="text-xs font-medium">{listing.bathrooms}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
