'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className={`
            flex items-start gap-3 cursor-pointer group
            ${props.disabled ? 'cursor-not-allowed opacity-50' : ''}
          `}
        >
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={id}
              className={`
                peer
                w-5 h-5
                appearance-none
                border-2 border-[#E5E5E5]
                rounded-md
                bg-white
                transition-all duration-200
                checked:bg-[#FFF012] checked:border-[#FFF012]
                focus:outline-none focus:ring-2 focus:ring-[#FFF012]/20 focus:ring-offset-2
                ${error ? 'border-[#EF4444]' : ''}
                ${className}
              `}
              {...props}
            />
            <svg
              className="absolute top-0.5 left-0.5 w-4 h-4 text-[#1A1A1A] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="text-sm text-[#1A1A1A] leading-relaxed">{label}</span>
        </label>
        {error && (
          <p className="mt-2 text-sm text-[#EF4444]">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
