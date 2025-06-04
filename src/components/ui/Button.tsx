import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white',
    secondary: 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 dark:text-white',
    outline: 'border border-gray-300 dark:border-dark-border bg-transparent hover:bg-gray-100 dark:hover:bg-dark-hover dark:text-dark-text-primary',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-dark-hover dark:text-dark-text-primary',
    danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 dark:text-white',
  };
  
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 h-8',
    md: 'text-sm px-4 py-2 h-10',
    lg: 'text-base px-6 py-3 h-12',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  const combinedClassName = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${widthStyle} 
    ${className}
  `.trim();
  
  return (
    <button
      className={combinedClassName}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;