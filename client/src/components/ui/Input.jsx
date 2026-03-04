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
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center rounded-xl border-2 transition-colors duration-200 ${
          error
            ? 'border-rose-300 bg-rose-50/50'
            : focused
              ? 'border-estate-500 bg-white ring-4 ring-estate-50'
              : 'border-slate-200 bg-slate-50/80 hover:border-slate-300'
        }`}
      >
        {Icon && (
          <Icon
            className={`absolute left-3.5 h-4 w-4 transition-colors ${
              error
                ? 'text-rose-400'
                : focused
                  ? 'text-estate-600'
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
          className={`w-full px-4 py-3 bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400 rounded-xl ${
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
