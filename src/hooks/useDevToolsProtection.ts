import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';

function isDevToolsShortcut(event: KeyboardEvent): boolean {
  const key = event.key;

  if (key === 'F12') return true;

  if (event.ctrlKey && event.shiftKey && ['I', 'J', 'C', 'K'].includes(key.toUpperCase())) {
    return true;
  }

  if (event.ctrlKey && ['U', 'S'].includes(key.toUpperCase())) {
    return true;
  }

  if (event.metaKey && event.altKey && ['I', 'J', 'C', 'U'].includes(key.toUpperCase())) {
    return true;
  }

  return false;
}

export function useDevToolsProtection() {
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    if (loading || isAdmin) return;

    const blockContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const blockDevToolsShortcuts = (event: KeyboardEvent) => {
      if (isDevToolsShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockDevToolsShortcuts);

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockDevToolsShortcuts);
    };
  }, [isAdmin, loading]);
}
