import { useState } from 'react';

export default function Input({
  id,
  type = 'text',
  label,
  placeholder,
  icon: Icon,
  error,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center rounded-xl border-2 transition-colors duration-200 ${
          error
            ? 'border-rose-300 bg-rose-50/50 dark:border-rose-500/50 dark:bg-rose-950/30'
            : focused
              ? 'border-estate-500 bg-white dark:bg-slate-800 ring-4 ring-estate-50 dark:ring-estate-900/30'
              : 'border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        {Icon && (
          <Icon
            className={`absolute left-3.5 h-4 w-4 transition-colors ${
              error
                ? 'text-rose-400'
                : focused
                  ? 'text-estate-600 dark:text-estate-400'
                  : 'text-slate-400'
            }`}
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full px-4 py-3 bg-transparent focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 rounded-xl ${
            Icon ? 'pl-11' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-rose-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
