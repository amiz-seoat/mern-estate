import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getRange = () => {
    const delta = 1;
    const range = [];
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(pages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    const items = [];
    items.push(1);

    if (range[0] > 2) items.push("...");
    range.forEach((i) => items.push(i));
    if (range[range.length - 1] < pages - 1) items.push("...");

    if (pages > 1) items.push(pages);
    return items;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Previous page"
      >
        <FaChevronLeft className="h-3 w-3" />
      </button>

      {getRange().map((item, idx) =>
        item === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-slate-400 dark:text-slate-500 text-sm">
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              item === page
                ? "bg-estate-800 dark:bg-estate-700 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="p-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Next page"
      >
        <FaChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}
