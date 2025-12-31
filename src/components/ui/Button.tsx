import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none',
          {
            // Variants - Rosa theme
            'bg-secondary text-white hover:bg-accent hover:scale-105 rounded-full uppercase tracking-wide shadow-md hover:shadow-lg':
              variant === 'default',
            'bg-primary dark:bg-white text-white dark:text-primary hover:bg-grey dark:hover:bg-gray-200 hover:scale-105 rounded-full uppercase tracking-wide':
              variant === 'secondary',
            'bg-red-500 text-white hover:bg-red-600 hover:scale-105 rounded-full':
              variant === 'destructive',
            'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white rounded-full dark:border-accent dark:text-accent dark:hover:bg-accent dark:hover:text-white':
              variant === 'outline',
            'hover:bg-light-grey dark:hover:bg-dark-card rounded-lg text-primary dark:text-white':
              variant === 'ghost',
            'bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white hover:scale-105 rounded-full shadow-lg':
              variant === 'whatsapp',
            // Sizes
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
            'p-2 aspect-square': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
