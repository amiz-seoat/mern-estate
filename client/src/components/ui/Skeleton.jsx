export function Skeleton({ className = "" }) {
  return (
    <div
      className={`bg-slate-200 dark:bg-slate-700 rounded-lg animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 w-full">
      <Skeleton className="h-48 w-full !rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function ListingSectionSkeleton() {
  return (
    <section>
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function SwiperSkeleton() {
  return (
    <div className="relative -mt-6 z-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="w-full h-[300px] sm:h-[400px] lg:h-[500px] !rounded-2xl" />
      </div>
    </div>
  );
}

export function ListingDetailSkeleton() {
  return (
    <main className="animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <Skeleton className="w-full h-[300px] sm:h-[400px] lg:h-[500px] !rounded-2xl" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 !rounded-full" />
              <Skeleton className="h-6 w-24 !rounded-full" />
            </div>
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-48 mt-2" />
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 px-6 sm:px-8 py-6">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full !rounded-xl" />
              ))}
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 px-6 sm:px-8 py-6 space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </main>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
