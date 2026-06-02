import { useMemo, useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import numeral from 'numeral';
import { MdReceiptLong } from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { COLORS, HIDDEN_AMOUNT_TEXT } from '@/constants';
import ScreenLayout from '@/components/layout/ScreenLayout';
import Activity from '@/components/activity/Activity';

export default function HistoryPage() {
  const { dateView: dateViewParam } = useParams<{ dateView?: string }>();
  const theme = useTheme();
  const activities = useAppSelector(state => state.activity.activities);
  const amountVisibility = useAppSelector(state => state.app.amountVisibility);
  const dateView = useMemo(() => dateViewParam ? new Date(dateViewParam) : new Date(), [dateViewParam]);
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

  const { grouped, totalIncome, totalExpense } = useMemo(() => {
    const month = dateView.getMonth();
    const year = dateView.getFullYear();
    const filtered = activities
      .filter(activity => {
        const d = new Date(activity.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let totalIncome = 0;
    let totalExpense = 0;
    const grouped: Record<string, typeof filtered> = {};

    for (const activity of filtered) {
      const key = dayjs(activity.date).format('ddd, DD MMM YYYY');
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(activity);
      if (activity.expense) {
        totalExpense += Number(activity.amount);
      } else {
        totalIncome += Number(activity.amount);
      }
    }

    return { grouped, totalIncome, totalExpense };
  }, [activities, dateView]);

  const dateKeys = Object.keys(grouped);

  return (
    <ScreenLayout
      title="Activities"
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
      {dateKeys.length > 0 && (
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
              className="flex items-center gap-3 px-5 transition-all duration-200"
              style={{ paddingTop: stuck ? 8 : 16, paddingBottom: stuck ? 8 : 16 }}
            >
              <div className="flex-1">
                <p
                  className="text-[10px] font-bold uppercase tracking-wide overflow-hidden transition-all duration-200"
                  style={{
                    color: theme.textHintColor,
                    maxHeight: stuck ? 0 : 16,
                    marginBottom: stuck ? 0 : 2,
                    opacity: stuck ? 0 : 1,
                  }}
                >
                  Income
                </p>
                <p
                  className="font-bold font-mono transition-all duration-200"
                  style={{ color: COLORS.colorSuccess500, fontSize: stuck ? 13 : 15 }}
                >
                  {!amountVisibility ? HIDDEN_AMOUNT_TEXT : `+${numeral(totalIncome).format('0,0')}`}
                </p>
              </div>
              <div
                className="transition-all duration-200"
                style={{ width: 1, height: stuck ? 16 : 32, backgroundColor: theme.borderBasicColor2 }}
              />
              <div className="flex-1 text-right">
                <p
                  className="text-[10px] font-bold uppercase tracking-wide overflow-hidden transition-all duration-200"
                  style={{
                    color: theme.textHintColor,
                    maxHeight: stuck ? 0 : 16,
                    marginBottom: stuck ? 0 : 2,
                    opacity: stuck ? 0 : 1,
                  }}
                >
                  Expense
                </p>
                <p
                  className="font-bold font-mono transition-all duration-200"
                  style={{ color: COLORS.colorDanger500, fontSize: stuck ? 13 : 15 }}
                >
                  {!amountVisibility ? HIDDEN_AMOUNT_TEXT : `-${numeral(totalExpense).format('0,0')}`}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {dateKeys.length < 1 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ backgroundColor: `${theme.textHintColor}12` }}
          >
            <MdReceiptLong size={22} color={theme.textHintColor} />
          </div>
          <p className="text-[13px] font-semibold mb-0.5" style={{ color: theme.textBasicColor }}>
            No activities yet
          </p>
          <p className="text-[11px] text-center leading-relaxed" style={{ color: theme.textHintColor }}>
            Transactions for {dayjs(dateView).format('MMMM YYYY')} will appear here
          </p>
        </div>
      ) : (
        <div className="pb-6">
          {dateKeys.map((dateKey) => {
            const items = grouped[dateKey];
            return (
              <div key={dateKey}>
                <p
                  className="text-[11px] font-bold uppercase tracking-wide px-5 pt-4 pb-2"
                  style={{ color: theme.textHintColor }}
                >
                  {dateKey}
                </p>
                <div
                  className="mx-5 rounded-2xl overflow-hidden"
                  style={{ backgroundColor: theme.backgroundBasicColor0 }}
                >
                  {items.map((activity, i, arr) => (
                    <Activity
                      key={activity.id}
                      id={activity.id}
                      expense={activity.expense}
                      category={activity.category}
                      amount={activity.amount}
                      date={activity.date}
                      lastChild={i + 1 === arr.length}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ScreenLayout>
  );
}
