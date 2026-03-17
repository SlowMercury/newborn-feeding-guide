import { useEffect, useState } from "react";

export interface ToastData {
  id: number;
  message: string;
  type: "success" | "info" | "celebration";
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: number) => void;
}

function Toast({ toast, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    // Auto dismiss after 3 seconds
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, toast.type === "celebration" ? 5000 : 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.type, onDismiss]);

  const icons: Record<string, string> = {
    success: "✅",
    info: "💡",
    celebration: "🎉",
  };

  const bgStyles: Record<string, string> = {
    success: "bg-green-light border-green/30",
    info: "bg-blue/10 border-blue/30",
    celebration: "bg-accent/10 border-accent/30",
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md
        transition-all duration-300 ease-out cursor-pointer max-w-sm w-full
        ${bgStyles[toast.type]}
        ${isVisible && !isExiting ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
      `}
      onClick={() => {
        setIsExiting(true);
        setTimeout(() => onDismiss(toast.id), 300);
      }}
      role="status"
      aria-live="polite"
    >
      <span className="text-lg flex-shrink-0">{icons[toast.type]}</span>
      <p className="text-sm font-heading font-medium text-text flex-1">
        {toast.message}
      </p>
      <button
        className="w-6 h-6 rounded-full hover:bg-black/5 flex items-center justify-center flex-shrink-0 transition-colors"
        aria-label="Закрыть"
      >
        <svg className="w-3 h-3 text-mid-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] flex flex-col gap-2 items-end no-print">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
