import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdChevronLeft } from 'react-icons/md';
import { COLORS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

export default function ScreenLayout({
  title,
  children,
  rightControl,
  showBack = true,
  contentClassName = '',
}: {
  title?: string;
  children: ReactNode;
  rightControl?: ReactNode;
  showBack?: boolean;
  contentClassName?: string;
}) {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <div className="flex flex-col flex-1 min-h-full" style={{ backgroundColor: theme.backgroundBasicColor1 }}>
      {title && (
        <div
          className="sticky top-0 z-30 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${COLORS.colorPrimary500}, ${COLORS.colorPrimary700}, ${COLORS.colorPrimary800})`,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          {/* decorative radial */}
          <div
            className="absolute opacity-10 rounded-full pointer-events-none"
            style={{
              width: 180, height: 180,
              top: -50, right: -30,
              background: `radial-gradient(circle, ${COLORS.colorBasic100} 0%, transparent 70%)`,
            }}
          />

          <div className="flex items-center h-[64px] px-[15px] relative z-10">
            {showBack && (
              <button
                className="w-[35px] h-[35px] flex items-center justify-center -ml-[11px] mr-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
                onClick={() => navigate(-1)}
              >
                <MdChevronLeft size={30} color={COLORS.colorBasic000} />
              </button>
            )}
            <h1
              className="text-[17px] font-bold text-white flex-1"
              style={{ marginLeft: showBack ? -2 : 0 }}
            >
              {title}
            </h1>
            {rightControl}
          </div>
        </div>
      )}
      <div className={`flex-1 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}
