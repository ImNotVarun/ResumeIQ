import { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

let toastId = 0;
const listeners: Array<(toast: ToastMessage) => void> = [];

export function showToast(message: string, type: ToastType = 'info') {
  const id = String(toastId++);
  const toast = { id, message, type };
  listeners.forEach((listener) => listener(toast));
  return id;
}

export function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (toast: ToastMessage) => {
      setToasts((prev) => [...prev, toast]);
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
      return () => clearTimeout(timer);
    };

    listeners.push(handleToast);
    return () => {
      listeners.pop();
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md border shadow-lg animate-slideUp ${
            toast.type === 'success'
              ? 'bg-success/20 border-success text-success'
              : toast.type === 'error'
                ? 'bg-error/20 border-error text-error'
                : 'bg-primary/20 border-primary text-dark'
          }`}
        >
          {toast.type === 'success' && <CheckCircle size={20} />}
          {toast.type === 'error' && <AlertCircle size={20} />}
          {toast.type === 'info' && <Info size={20} />}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="hover:opacity-70 transition-opacity"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
