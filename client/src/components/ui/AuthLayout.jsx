import { FaHome } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function AuthLayout({ children, title, subtitle }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/listing/stats")
      .then((r) => r.json())
      .then((d) => { if (d.totalListings !== undefined) setStats(d); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-estate-950 via-estate-800 to-estate-700 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-10 w-52 h-52 bg-gold-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-estate-400/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-gold-400 p-2.5 rounded-xl">
              <FaHome className="h-6 w-6 text-estate-900" />
            </div>
            <span className="text-2xl font-bold tracking-tight">AmizEstate</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold leading-tight mb-4">
            Find Your Perfect
            <br />
            Place to Call Home
          </h2>
          <p className="text-estate-200 text-base leading-relaxed max-w-sm">
            Discover premium properties, connect with trusted agents, and make
            your real estate journey seamless.
          </p>

          <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold text-gold-400">{stats ? stats.totalListings.toLocaleString() : "—"}</div>
              <div className="text-estate-300 text-sm mt-1">Properties</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold-400">{stats ? stats.totalUsers.toLocaleString() : "—"}</div>
              <div className="text-estate-300 text-sm mt-1">Happy Clients</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold-400">{stats ? stats.totalCities.toLocaleString() : "—"}</div>
              <div className="text-estate-300 text-sm mt-1">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-slate-900 transition-colors">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile-only branding */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <div className="bg-estate-800 dark:bg-estate-700 p-2 rounded-lg">
              <FaHome className="h-5 w-5 text-gold-400" />
            </div>
            <span className="text-xl font-bold text-estate-900 dark:text-white tracking-tight">
              AmizEstate
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-2">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
