import { useMemo, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { COLORS } from '@/constants';
import dayjs from 'dayjs';

const MONTH_MODE = 'MONTH';
const YEAR_MODE = 'YEAR';

export default function MonthPicker({
  value,
  onChange,
}: {
  value?: Date;
  onChange?: (date: Date) => void;
}) {
  const now = value || new Date();
  const [viewedYear, setViewedYear] = useState(now.getFullYear());
  const theme = useTheme();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [displayMode, setDisplayMode] = useState(MONTH_MODE);
  const [yearPointer, setYearPointer] = useState(now.getFullYear());

  const onChangeMode = () => {
    setDisplayMode(displayMode === MONTH_MODE ? YEAR_MODE : MONTH_MODE);
  };

  const onNext = () => {
    if (displayMode === MONTH_MODE) setViewedYear(s => s + 1);
    else setYearPointer(s => s + 9);
  };

  const onPrev = () => {
    if (displayMode === MONTH_MODE) setViewedYear(s => s - 1);
    else setYearPointer(s => s - 9);
  };

  const years = useMemo(() => {
    const arr = [];
    for (let i = yearPointer - 4; i <= yearPointer + 4; i++) arr.push(i);
    return arr;
  }, [yearPointer]);

  return (
    <div className="px-5 pt-4 pb-2">
      {/* Navigation bar */}
      <div
        className="flex items-center mb-3 p-1 rounded-xl"
        style={{ backgroundColor: theme.backgroundBasicColor2 }}
      >
        <button
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:opacity-70 transition-opacity"
          onClick={onPrev}
        >
          <MdChevronLeft size={24} color={theme.textBasicColor} />
        </button>
        <div className="flex-1 text-center">
          {displayMode !== YEAR_MODE && (
            <button
              className="text-[16px] font-semibold hover:opacity-70 transition-opacity"
              style={{ color: theme.textBasicColor }}
              onClick={onChangeMode}
            >
              {dayjs(new Date(viewedYear, 0, 1)).format('YYYY')}
            </button>
          )}
        </div>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:opacity-70 transition-opacity"
          onClick={onNext}
        >
          <MdChevronRight size={24} color={theme.textBasicColor} />
        </button>
      </div>

      {/* Grid */}
      {displayMode === YEAR_MODE ? (
        <div className="grid grid-cols-3 gap-1.5">
          {years.map(year => {
            const sel = year === viewedYear;
            return (
              <button
                key={year}
                className="py-2.5 rounded-xl text-center text-[14px] font-medium transition-colors"
                style={{
                  backgroundColor: sel ? COLORS.colorPrimary500 : theme.backgroundBasicColor2,
                  color: sel ? COLORS.colorBasic100 : theme.textBasicColor,
                }}
                onClick={() => { setViewedYear(year); setDisplayMode(MONTH_MODE); }}
              >
                {year}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-1.5">
          {months.map((month, i) => {
            const isSelected =
              value &&
              new Date(value).getFullYear() === viewedYear &&
              new Date(value).getMonth() === i;
            return (
              <button
                key={month}
                className="py-2.5 rounded-xl text-center text-[14px] font-medium transition-colors"
                style={{
                  backgroundColor: isSelected ? COLORS.colorPrimary500 : theme.backgroundBasicColor2,
                  color: isSelected ? COLORS.colorBasic100 : theme.textBasicColor,
                }}
                onClick={() => {
                  if (typeof onChange === 'function')
                    onChange(new Date(viewedYear, i, 1, 0, 0, 0, 0));
                }}
              >
                {month}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
