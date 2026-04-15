import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  children, 
  disabled, 
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/25 focus:ring-primary-500',
    secondary: 'bg-surface-lighter text-gray-100 hover:bg-surface-lighter/80 border border-gray-700 focus:ring-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25 focus:ring-red-500',
    ghost: 'text-gray-300 hover:text-white hover:bg-surface-lighter focus:ring-gray-400',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
    icon: 'h-10 w-10',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
