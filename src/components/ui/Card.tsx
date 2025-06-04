import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white dark:bg-dark-card shadow dark:shadow-dark-lg backdrop-blur-sm dark:backdrop-blur-lg border border-transparent dark:border-dark-border/50',
    bordered: 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border backdrop-blur-sm dark:backdrop-blur-lg',
    elevated: 'bg-white dark:bg-dark-card shadow-lg dark:shadow-dark-lg backdrop-blur-sm dark:backdrop-blur-lg border border-transparent dark:border-dark-border/50',
  };
  
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };
  
  const combinedClassName = `
    rounded-lg 
    transition-all duration-200
    hover:shadow-lg dark:hover:shadow-dark-lg
    dark:hover:border-dark-accent/30
    ${variantStyles[variant]} 
    ${paddingStyles[padding]} 
    ${className}
  `.trim();
  
  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 dark:text-dark-text-primary ${className}`} {...props}>
      {children}
    </h3>
  );
};

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`mt-4 flex items-center ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;