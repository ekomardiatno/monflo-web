import { useMemo, useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import numeral from 'numeral';
import dayjs from 'dayjs';
import { MdDonutSmall, MdChevronRight } from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { COLORS, HIDDEN_AMOUNT_TEXT } from '@/constants';
import { iconInfo } from '@/constants/categories';
import ActivityIcon from '@/components/shared/ActivityIcon';
import ScreenLayout from '@/components/layout/ScreenLayout';
import type { Categories } from '@/types';

export default function AllocationPage() {
  const { dateView: dateViewParam, type } = useParams<{ dateView?: string; type?: string }>();
  const theme = useTheme();
  const activities = useAppSelector(state => state.activity.activities);
  const amountVisibility = useAppSelector(state => state.app.amountVisibility);
  const navigate = useNavigate();

  const expense = type === 'expense';
  const dateView = useMemo(() => new Date(dateViewParam || new Date().toISOString()), [dateViewParam]);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { setStuck(!entry.isIntersecting); },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => { observer.disconnect(); };
  }, []);

  const { data, total } = useMemo(() => {
    const filtered = activities.filter(activity => {
      const d = new Date(activity.date);
      return (
        d.getMonth() === dateView.getMonth() &&
        d.getFullYear() === dateView.getFullYear() &&
        activity.expense === expense
      );
    });
    const allocation: { amount: number; category: Categories; count: number }[] = [];
    let total = 0;
    for (const activity of filtered) {
      const idx = allocation.findIndex(obj => obj.category === activity.category);
      if (idx > -1) {
        allocation[idx] = {
          ...allocation[idx],
          amount: allocation[idx].amount + activity.amount,
          count: allocation[idx].count + 1,
        };
      } else {
        allocation.push({ amount: activity.amount, category: activity.category as Categories, count: 1 });
      }
      total += Number(activity.amount);
    }
    // Sort by amount descending
    allocation.sort((a, b) => b.amount - a.amount);
    return { data: allocation, total };
  }, [activities, dateView, expense]);

  return (
    <ScreenLayout
      title={expense ? 'Expenses' : 'Incomes'}
      rightControl={
        <span
          className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mr-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: COLORS.colorBasic000 }}
        >
          {dayjs(dateView).format('MMM YYYY')}
        </span>
      }
      contentClassName="flex flex-col"
    >
      {data.length < 1 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ backgroundColor: expense ? `${COLORS.colorDanger500}12` : `${COLORS.colorSuccess500}12` }}
          >
            <MdDonutSmall size={22} color={expense ? COLORS.colorDanger500 : COLORS.colorSuccess500} />
          </div>
          <p className="text-[13px] font-semibold mb-0.5" style={{ color: theme.textBasicColor }}>
            No {expense ? 'expenses' : 'incomes'} yet
          </p>
          <p className="text-[11px] text-center leading-relaxed" style={{ color: theme.textHintColor }}>
            {expense ? 'Expense' : 'Income'} categories for {dayjs(dateView).format('MMMM YYYY')} will appear here
          </p>
        </div>
      ) : (
        <>
          <div ref={sentinelRef} className="h-0 shrink-0" />
          <div
            className="sticky z-20 transition-all duration-200"
            style={{
              top: 64,
              backgroundColor: theme.backgroundBasicColor1,
              boxShadow: stuck ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <div
              className="px-5 transition-all duration-200"
              style={{ paddingTop: stuck ? 8 : 16, paddingBottom: stuck ? 8 : 16 }}
            >
              {/* Total */}
              <div
                className="flex items-center justify-between px-4 rounded-2xl transition-all duration-200"
                style={{
                  backgroundColor: theme.backgroundBasicColor0,
                  paddingTop: stuck ? 6 : 12,
                  paddingBottom: stuck ? 6 : 12,
                }}
              >
                <p
                  className="font-bold uppercase tracking-wide transition-all duration-200"
                  style={{ color: theme.textHintColor, fontSize: stuck ? 10 : 11 }}
                >
                  Total {expense ? 'Expenses' : 'Incomes'}
                </p>
                <p
                  className="font-bold font-mono transition-all duration-200"
                  style={{
                    color: expense ? COLORS.colorDanger500 : COLORS.colorSuccess500,
                    fontSize: stuck ? 14 : 17,
                  }}
                >
                  {!amountVisibility ? HIDDEN_AMOUNT_TEXT : numeral(total).format('0,0')}
                </p>
              </div>

              {/* Allocation bar */}
              <div
                className="rounded-lg overflow-hidden flex transition-all duration-200"
                style={{
                  backgroundColor: theme.backgroundBasicColor4,
                  height: stuck ? 6 : 10,
                  marginTop: stuck ? 6 : 12,
                }}
              >
                {data.map(row => {
                  const percentage = Number(numeral((row.amount / total) * 100).format('0.00').replace(/,/g, ''));
                  const color = iconInfo(row.category).color;
                  return (
                    <div
                      key={row.category}
                      style={{ width: `${percentage}%`, backgroundColor: color }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Category list */}
          <div className="px-5 pb-6">
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: theme.backgroundBasicColor0 }}>
            {data.map((row, i, arr) => {
              const percentage = numeral((row.amount / total) * 100).format('0.0');
              return (
                <button
                  key={row.category}
                  className="w-full text-left hover:opacity-80 active:opacity-60 transition-opacity"
                  onClick={() => {
                    navigate(`/allocation/${dayjs(dateView).format('YYYY-MM-DD')}/${type}/${row.category}`);
                  }}
                >
                  <div className="flex items-center px-4">
                    <ActivityIcon size={36} iconSize={18} category={row.category} />
                    <div
                      className="flex items-center flex-1 py-3 ml-3"
                      style={{
                        borderBottom: i + 1 === arr.length ? 'none' : `1px solid ${theme.borderBasicColor2}`,
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold truncate" style={{ color: theme.textBasicColor }}>
                          {row.category}
                        </p>
                        <p className="text-[11px]" style={{ color: theme.textHintColor }}>
                          {row.count} transaction{row.count > 1 ? 's' : ''} · {percentage}%
                        </p>
                      </div>
                      <p
                        className="text-[14px] font-bold font-mono shrink-0 mr-1"
                        style={{ color: expense ? COLORS.colorDanger500 : COLORS.colorSuccess500 }}
                      >
                        {!amountVisibility ? HIDDEN_AMOUNT_TEXT : numeral(row.amount).format('0,0')}
                      </p>
                      <MdChevronRight size={18} color={theme.textHintColor} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          </div>
        </>
      )}
    </ScreenLayout>
  );
}
