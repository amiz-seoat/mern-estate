const variants = {
  primary:
    'bg-estate-800 hover:bg-estate-700 active:bg-estate-900 text-white shadow-lg shadow-estate-900/20 hover:shadow-xl',
  secondary:
    'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300',
  google:
    'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
  danger:
    'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-lg shadow-rose-600/20',
};

export default function Button({
  children,
  loading,
  variant = 'primary',
  type = 'button',
  disabled,
  onClick,
  className = '',
  fullWidth = true,
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${fullWidth ? 'w-full' : ''} px-6 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer ${variants[variant] || variants.primary} ${className}`}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
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
      )}
      {children}
    </button>
  );
}
