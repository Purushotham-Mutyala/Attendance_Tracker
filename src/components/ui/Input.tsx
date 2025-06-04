import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, fullWidth = true, ...props }, ref) => {
    const inputStyles = `
      px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
      ${error ? 'border-red-500' : 'border-gray-300'}
      ${fullWidth ? 'w-full' : ''}
      ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
      ${className}
    `.trim();

    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input ref={ref} className={inputStyles} {...props} />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;