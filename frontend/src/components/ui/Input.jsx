import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({ className, type, label, error, icon: Icon, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-surface-dark px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-50",
            Icon && "pl-10",
            error ? "border-red-500 focus:ring-red-500/50 focus:border-red-500" : "border-gray-700",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-400 animate-slide-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
