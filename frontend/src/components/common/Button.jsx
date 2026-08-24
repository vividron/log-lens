import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary', // 'primary', 'secondary', 'ghost', 'danger', 'outline'
  size = 'md', // 'sm', 'md', 'lg'
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-4 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm shadow-sky-950 border border-sky-500/50 active:bg-sky-700',
    secondary: 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 active:bg-slate-800',
    outline: 'bg-transparent hover:bg-slate-800/50 text-slate-300 border border-slate-700/80 active:bg-slate-800',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-slate-100 border border-transparent',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-950 border border-rose-500/50 active:bg-rose-700',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 text-current" />
      )}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 text-current" />}
    </button>
  );
}
