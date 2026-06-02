import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdWarningAmber, MdHelpOutline, MdDeleteOutline } from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { COLORS } from '@/constants';

type Appearance = 'primary' | 'danger' | 'warning';

const CLOSE_THRESHOLD = 80;

const appearanceConfig: Record<Appearance, {
  bg: string;
  iconBg: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}> = {
  primary: {
    bg: COLORS.colorPrimary500,
    iconBg: `${COLORS.colorPrimary500}18`,
    icon: MdHelpOutline,
  },
  danger: {
    bg: COLORS.colorDanger500,
    iconBg: `${COLORS.colorDanger500}18`,
    icon: MdDeleteOutline,
  },
  warning: {
    bg: COLORS.colorWarning500,
    iconBg: `${COLORS.colorWarning500}18`,
    icon: MdWarningAmber,
  },
};

export default function ConfirmDialog({
  visible,
  appearance = 'primary',
  cautionText,
  confirmText = 'Confirm',
  onConfirmed,
  onCancel,
}: {
  visible: boolean;
  appearance?: Appearance;
  cautionText: string;
  confirmText?: string;
  onConfirmed: () => void;
  onCancel: () => void;
}) {
  const theme = useTheme();
  const config = appearanceConfig[appearance];
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startY: number; current: number } | null>(null);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setDragY(0);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setOpen(true));
      });
    } else {
      setOpen(false);
      const timer = setTimeout(() => {
        setMounted(false);
        setDragY(0);
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = { startY: e.clientY, current: 0 };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dy = Math.max(0, e.clientY - dragRef.current.startY);
    dragRef.current.current = dy;
    setDragY(dy);
  };

  const handlePointerUp = () => {
    if (!dragRef.current) return;
    const dy = dragRef.current.current;
    dragRef.current = null;
    setDragging(false);

    if (dy > CLOSE_THRESHOLD) {
      onCancel();
    } else {
      setDragY(0);
    }
  };

  if (!mounted) return null;

  const IconComponent = config.icon;
  const backdropOpacity = dragging ? Math.max(0, 1 - dragY / 300) : open ? 1 : 0;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{
        backgroundColor: theme.backgroundModalBackdropColor,
        opacity: backdropOpacity,
        transition: dragging ? 'none' : 'opacity 300ms',
      }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[430px] rounded-t-3xl pt-3 pb-6 px-5"
        style={{
          backgroundColor: theme.backgroundBasicColor0,
          transform: open
            ? `translateY(${dragY}px)`
            : 'translateY(100%)',
          transition: dragging ? 'none' : 'transform 300ms ease-out',
          touchAction: 'none',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle — drag zone */}
        <div
          className="flex justify-center pb-5 cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className="w-9 h-1 rounded-full"
            style={{ backgroundColor: theme.backgroundBasicColor4 }}
          />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: config.iconBg }}
          >
            <IconComponent size={26} color={config.bg} />
          </div>
        </div>

        {/* Text */}
        <p
          className="text-[15px] text-center leading-relaxed mb-6 px-2"
          style={{ color: theme.textBasicColor }}
        >
          {cautionText}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 py-3.5 rounded-xl text-[14px] font-semibold transition-opacity hover:opacity-80 active:opacity-60"
            style={{
              backgroundColor: theme.backgroundBasicColor3,
              color: theme.textBasicColor,
            }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-3.5 rounded-xl text-[14px] font-semibold text-white transition-opacity hover:opacity-80 active:opacity-60"
            style={{ backgroundColor: config.bg }}
            onClick={onConfirmed}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
