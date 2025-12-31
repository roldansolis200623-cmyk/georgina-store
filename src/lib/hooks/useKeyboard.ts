'use client';

import { useEffect, useCallback } from 'react';

export function useKeyboard(shortcut: string, callback: () => void) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Parse shortcut (e.g., "ctrl+shift+a")
      const parts = shortcut.toLowerCase().split('+');
      
      const needsCtrl = parts.includes('ctrl');
      const needsShift = parts.includes('shift');
      const needsAlt = parts.includes('alt');
      const key = parts.filter(p => !['ctrl', 'shift', 'alt'].includes(p))[0];

      if (!key) return;

      const ctrlMatch = needsCtrl ? (event.ctrlKey || event.metaKey) : true;
      const shiftMatch = needsShift ? event.shiftKey : true;
      const altMatch = needsAlt ? event.altKey : true;
      const keyMatch = event.key?.toLowerCase() === key;

      if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        event.preventDefault();
        callback();
      }
    },
    [shortcut, callback]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}