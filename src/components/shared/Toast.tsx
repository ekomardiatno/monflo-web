import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdCheckCircle, MdError } from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { COLORS } from '@/constants';

type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<((message: string, type?: ToastType) => void) | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const typeConfig: Record<ToastType, {
  bg: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}> = {
  success: { bg: COLORS.colorSuccess500, icon: MdCheckCircle },
  error: { bg: COLORS.colorDanger500, icon: MdError },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const config = typeConfig[toast.type];
  const Icon = config.icon;
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  return (
    <div
      role="alert"
      onClick={handleDismiss}
      className="w-full max-w-[430px] mx-auto px-4 cursor-pointer"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 300ms ease-out, opacity 300ms ease-out',
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
        style={{ backgroundColor: theme.backgroundBasicColor0, border: `1px solid ${theme.borderBasicColor3}` }}
      >
        <Icon size={20} color={config.bg} />
        <span className="text-[14px] leading-snug flex-1" style={{ color: theme.textBasicColor }}>
          {toast.message}
        </span>
      </div>
    </div>
  );
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToasts(prev => [...prev, { id: ++nextId, message, type }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toasts.length > 0 && createPortal(
        <div className="fixed top-0 left-0 right-0 z-[60] pt-3 flex flex-col gap-2 pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <ToastItem toast={toast} onDismiss={dismiss} />
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
