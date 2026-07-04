import { createContext, type ReactNode, useContext, useMemo, useRef, useState } from 'react';

import { Toast, type ToastVariant } from '@/components/ui/Toast';

type ToastOptions = {
  variant?: ToastVariant;
  duration?: number;
};

type ToastState = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (message: string, options?: ToastOptions) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function hideToast() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setToast(null);
  }

  const value = useMemo<ToastContextValue>(() => ({
    showToast(message, options) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setToast({
        id: Date.now(),
        message,
        variant: options?.variant ?? 'info',
      });

      timeoutRef.current = setTimeout(() => {
        setToast(null);
        timeoutRef.current = null;
      }, options?.duration ?? 3000);
    },
    hideToast,
  }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Toast key={toast.id} message={toast.message} variant={toast.variant} />
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider.');
  }

  return context;
}
