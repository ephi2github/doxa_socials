"use client";

import { createContext, useContext, useRef, useState } from "react";

type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastApi = {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const toastStyles: Record<ToastVariant, { dot: string; ring: string }> = {
  success: { dot: "bg-emerald-500", ring: "ring-emerald-500/15" },
  error: { dot: "bg-rose-500", ring: "ring-rose-500/15" },
  info: { dot: "bg-sky-500", ring: "ring-sky-500/15" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const pushToast = (variant: ToastVariant, title: string, description?: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, title, description, variant }]);
    window.setTimeout(() => removeToast(id), 4000);
  };

  const api: ToastApi = {
    success: (title, description) => pushToast("success", title, description),
    error: (title, description) => pushToast("error", title, description),
    info: (title, description) => pushToast("info", title, description),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] mx-auto flex w-full max-w-xl flex-col gap-3 px-4">
        {toasts.map((toast) => {
          const style = toastStyles[toast.variant];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto ml-auto w-full max-w-sm rounded-[22px] border border-[var(--border)] bg-white px-4 py-4 text-[var(--text)] shadow-2xl ring-1 ${style.ring}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold">{toast.title}</p>
                  {toast.description ? (
                    <p className="mt-1 text-sm text-[var(--muted)]">{toast.description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="rounded-full p-1 text-slate-300 transition-colors hover:text-slate-500"
                  aria-label="Dismiss notification"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
