import { useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import numeral from 'numeral';
import dayjs from 'dayjs';
import { MdTrendingDown, MdTrendingUp, MdTrendingFlat } from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { iconInfo } from '@/constants/categories';
import { COLORS, EXPENSE_CATEGORIES, HIDDEN_AMOUNT_TEXT } from '@/constants';
import countMonths from '@/utils/countMonths';
import capitalizeFirstText from '@/utils/capitalize';
import type { Categories } from '@/types';

const CARD_SHADOW_LIGHT = '0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)';
const CARD_SHADOW_DARK = '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)';

export default function ExpensesCard({ currentDate = new Date() }: { currentDate?: Date }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const amountVisibility = useAppSelector(state => state.app.amountVisibility);
  const activities = useAppSelector(state => state.activity.activities);

  const startDateCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0, 0);
  const endDateCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
  const startDateLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1, 0, 0, 0, 0);
  const endDateLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0, 23, 59, 59, 999);

  const currentMonthActivities = useMemo(() => {
    const filtered = activities.filter(activity => {
      const d = new Date(activity.date);
      return d.getTime() >= startDateCurrentMonth.getTime() && d.getTime() <= endDateCurrentMonth.getTime() && activity.expense;
    });
    return filtered.reduce((acc: Record<string, number>, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});
  }, [activities, startDateCurrentMonth.getTime(), endDateCurrentMonth.getTime()]);

  const lastMonthActivities = useMemo(() => {
    const filtered = activities.filter(activity => {
      const d = new Date(activity.date);
      return d.getTime() >= startDateLastMonth.getTime() && d.getTime() <= endDateLastMonth.getTime() && activity.expense;
    });
    return filtered.reduce((acc: Record<string, number>, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});
  }, [activities, startDateLastMonth.getTime(), endDateLastMonth.getTime()]);

  const categoriesAmount = useMemo(() => {
    const listed = EXPENSE_CATEGORIES.map(item => ({
      category: item as Categories,
      amount: currentMonthActivities[item] || 0,
      previousAmount: lastMonthActivities[item] || 0,
    }));
    return listed.sort((a, b) => {
      if (a.amount !== b.amount) return b.amount - a.amount;
      return b.previousAmount - a.previousAmount;
    });
  }, [lastMonthActivities, currentMonthActivities]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, dragged: false });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = { isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, dragged: false };
    el.style.cursor = 'grabbing';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const ds = dragState.current;
    if (!ds.isDown) return;
    e.preventDefault();
    const el = scrollRef.current!;
    const x = e.pageX - el.offsetLeft;
    const walk = x - ds.startX;
    if (Math.abs(walk) > 3) ds.dragged = true;
    el.scrollLeft = ds.scrollLeft - walk;
  }, []);

  const onMouseUpOrLeave = useCallback(() => {
    dragState.current.isDown = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  }, []);

  const monthDifferenceTitle = (date: Date) => {
    const diff = countMonths(new Date(), date);
    if (diff > 0) return diff <= 1 ? 'next month' : `next ${diff} months`;
    if (diff < 0) return diff >= -1 ? 'last month' : `last ${diff * -1} months`;
    return 'this month';
  };

  const cardShadow = theme.schema === 'DARK' ? CARD_SHADOW_DARK : CARD_SHADOW_LIGHT;

  return (
    <div>
      <p className="text-[13px] font-semibold px-5 mb-2.5" style={{ color: theme.textHintColor }}>
        {capitalizeFirstText(monthDifferenceTitle(startDateCurrentMonth))} expenses
      </p>
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide select-none"
        style={{ cursor: 'grab' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
      >
        <div className="flex gap-2.5 px-5 pb-1">
          {categoriesAmount.map(row => {
            const diff = row.amount - row.previousAmount;
            const catInfo = iconInfo(row.category);
            const trendColor = diff > 0 ? COLORS.colorDanger500 : diff < 0 ? COLORS.colorSuccess500 : theme.textHintColor;
            return (
              <button
                key={row.category}
                className="shrink-0 rounded-2xl overflow-hidden text-left transition-opacity active:opacity-80"
                style={{
                  backgroundColor: theme.backgroundBasicColor0,
                  boxShadow: cardShadow,
                  minWidth: '42%',
                  padding: '16px',
                }}
                onClick={() => {
                  if (dragState.current.dragged) return;
                  navigate(`/allocation/${dayjs(startDateCurrentMonth).format('YYYY-MM-DD')}/expense/${row.category}`);
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-1 h-5 rounded-full shrink-0"
                    style={{ backgroundColor: catInfo.color }}
                  />
                  <p className="text-[12px] font-medium truncate" style={{ color: theme.textHintColor }}>
                    {row.category}
                  </p>
                </div>
                <p className="text-[17px] font-bold font-mono mb-2.5" style={{ color: theme.textBasicColor }}>
                  {!amountVisibility ? HIDDEN_AMOUNT_TEXT : numeral(row.amount).format('0,0')}
                </p>
                <div className="flex items-center gap-1">
                  {diff < 0 ? (
                    <MdTrendingDown size={13} color={trendColor} />
                  ) : diff > 0 ? (
                    <MdTrendingUp size={13} color={trendColor} />
                  ) : (
                    <MdTrendingFlat size={13} color={trendColor} />
                  )}
                  <p className="text-[11px] font-mono" style={{ color: trendColor }}>
                    {!amountVisibility ? HIDDEN_AMOUNT_TEXT : `${diff > 0 ? '+' : ''}${numeral(diff).format('0,0')}`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
