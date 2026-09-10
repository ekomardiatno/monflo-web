import { useState } from 'react';
import ScreenLayout from '@/components/layout/ScreenLayout';
import MonthPicker from '@/components/shared/MonthPicker';
import Balance from '@/components/statistics/Balance';
import Overview from '@/components/statistics/Overview';
import Allocation from '@/components/statistics/Allocation';
import TrendChart from '@/components/statistics/TrendChart';
import { useTheme } from '@/hooks/useTheme';

export default function StatisticsPage() {
  const currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  const [dateView, setDateView] = useState(currentDate);
  useTheme();

  return (
    <ScreenLayout title="Statistics">
      <MonthPicker value={dateView} onChange={setDateView} />

      <div className="space-y-6 pb-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:px-5 space-y-6 lg:space-y-0">
          <Balance dateView={dateView} />
          <Overview dateView={dateView} />
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:px-5 space-y-6 lg:space-y-0">
          <Allocation dateView={dateView} />
          <Allocation dateView={dateView} expense />
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:px-5 space-y-6 lg:space-y-0">
          <div className="px-5 lg:px-0">
            <TrendChart dateView={dateView} />
          </div>
          <div className="px-5 lg:px-0">
            <TrendChart dateView={dateView} expense />
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
}
