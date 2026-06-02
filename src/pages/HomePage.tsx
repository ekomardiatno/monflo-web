import { useRef, useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { useTheme } from '@/hooks/useTheme';
import BalanceCard from '@/components/home/BalanceCard';
import ExpensesCard from '@/components/home/ExpensesCard';
import ThisMonthActivities from '@/components/home/ThisMonthActivities';
import ActionBar from '@/components/layout/ActionBar';
import Allocation from '@/components/statistics/Allocation';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const theme = useTheme();
  const today = useMemo(() => new Date(new Date().setHours(0, 0, 0, 0)), []);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  const cardShadow = theme.schema === 'DARK'
    ? '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)'
    : '0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)';

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

  return (
    <div className="flex-1 relative pb-24" style={{ backgroundColor: theme.backgroundBasicColor1 }}>
      <div ref={sentinelRef} className="h-0 shrink-0" />
      <div className="sticky top-0 z-30">
        <BalanceCard stuck={stuck} />
      </div>

      {/* Greeting */}
      <div className="px-5 mt-5 mb-1">
        <p className="text-[13px] font-medium" style={{ color: theme.textHintColor }}>
          {getGreeting()} — <span style={{ color: theme.textBasicColor }}>{dayjs(today).format('MMMM YYYY')}</span>
        </p>
      </div>

      {/* This month expenses */}
      <div className="mt-5">
        <ExpensesCard />
      </div>

      {/* Allocation */}
      <div className="px-5 mt-6">
        <div
          className="rounded-2xl py-4 overflow-hidden"
          style={{ backgroundColor: theme.backgroundBasicColor0, boxShadow: cardShadow }}
        >
          <Allocation
            customTitle={
              <p className="text-[13px] font-semibold" style={{ color: theme.textBasicColor }}>Incomes</p>
            }
            dateView={today}
            style={{ marginBottom: 20 }}
          />
          <div className="mx-4 mb-4" style={{ height: 1, backgroundColor: theme.borderBasicColor2 }} />
          <Allocation
            customTitle={
              <p className="text-[13px] font-semibold" style={{ color: theme.textBasicColor }}>Expenses</p>
            }
            dateView={today}
            expense
          />
        </div>
      </div>

      {/* Recent activities */}
      <div className="mt-6">
        <ThisMonthActivities />
      </div>

      {/* Last month expenses */}
      <div className="mt-6">
        <ExpensesCard
          currentDate={new Date(new Date().setMonth(new Date().getMonth() - 1, 1))}
        />
      </div>

      <div className="h-24" />
      <ActionBar />
    </div>
  );
}
