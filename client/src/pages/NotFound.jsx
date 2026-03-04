import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaArrowLeft } from "react-icons/fa";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Page Not Found");

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6">
      <div className="text-center max-w-md animate-fade-in-up">
        <div className="relative mb-8">
          <p className="text-[140px] sm:text-[180px] font-black text-estate-100 dark:text-estate-900/30 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-estate-50 dark:bg-estate-900/30 border-2 border-estate-200 dark:border-estate-700 rounded-2xl px-6 py-3">
              <FaHome className="h-8 w-8 text-estate-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-estate-600">Not Found</p>
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-3">
          This page doesn&apos;t exist
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          The page you&apos;re looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-estate-800 hover:bg-estate-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-estate-800/20 hover:shadow-xl text-sm"
          >
            <FaArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-all duration-200 text-sm"
          >
            <FaSearch className="h-3.5 w-3.5" />
            Browse Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
