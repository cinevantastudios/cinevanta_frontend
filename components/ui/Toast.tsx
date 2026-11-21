"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  open: boolean;
  message: string;
  onClose?: () => void;
  duration?: number;
  className?: string;
}

export function Toast({
  open,
  message,
  onClose,
  duration = 4000,
  className,
}: ToastProps) {
  useEffect(() => {
    if (!open || !onClose || duration <= 0) return;

    const timer = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, onClose, duration, message]);

  if (!open || !message) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      data-surface="ink"
      className={cn(
        "fixed bottom-6 left-1/2 z-[110] -translate-x-1/2",
        "flex max-w-[calc(100vw-32px)] items-center gap-3 rounded-pill border-2 border-ink bg-ink px-6 py-3 text-[14px] font-medium text-cream",
        "animate-[toast-in_200ms_ease-out] motion-reduce:animate-none",
        className,
      )}
    >
      <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-yellow" />
      <span>{message}</span>
    </div>
  );
}

interface ToastContextValue {
  showToast: (message: string, duration?: number) => void;
  dismissToast: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastState, setToastState] = useState<{
    open: boolean;
    message: string;
    duration: number;
  }>({
    open: false,
    message: "",
    duration: 4000,
  });

  const showToast = useCallback((message: string, duration = 4000) => {
    setToastState({ open: true, message, duration });
  }, []);

  const dismissToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <Toast
        open={toastState.open}
        message={toastState.message}
        duration={toastState.duration}
        onClose={dismissToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

