'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-[#1A1A1A] mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`
            w-full px-4 py-3
            bg-white
            border-2 border-[#E5E5E5]
            rounded-xl
            text-[#1A1A1A]
            placeholder:text-[#6B7280]
            transition-all duration-200
            focus:outline-none focus:border-[#FFF012] focus:ring-2 focus:ring-[#FFF012]/20
            ${error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-[#EF4444]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
