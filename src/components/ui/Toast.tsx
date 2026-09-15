import { useEffect, useState } from 'react';
import { CheckCircle2, ShoppingBag, X, ArrowRight } from 'lucide-react';

export interface ToastData {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: number) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 shadow-2xl transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-400" />
      <p className="flex-1 text-sm font-medium text-stone-100">{toast.message}</p>
      {toast.actionLabel && toast.onAction && (
        <button
          onClick={() => {
            toast.onAction?.();
            handleDismiss();
          }}
          className="flex flex-shrink-0 items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 transition-colors hover:bg-brand-400"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          {toast.actionLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 rounded p-1 text-stone-500 transition-colors hover:bg-neutral-700 hover:text-stone-200"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
