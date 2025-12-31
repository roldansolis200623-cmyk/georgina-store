'use client';

import { cn } from '@/lib/utils/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <label className={cn(
      'flex items-center gap-3 cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-14 h-8 rounded-full transition-all duration-300',
          checked ? 'bg-green-500' : 'bg-light-grey'
        )}
      >
        <span
          className={cn(
            'absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300',
            checked && 'translate-x-6'
          )}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-grey">{label}</span>
      )}
    </label>
  );
}