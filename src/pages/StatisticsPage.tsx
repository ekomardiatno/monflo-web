import { useEffect, useState } from 'react';
import ScreenLayout from '@/components/layout/ScreenLayout';
import MonthPicker from '@/components/shared/MonthPicker';
import Balance from '@/components/statistics/Balance';
import Overview from '@/components/statistics/Overview';
import Allocation from '@/components/statistics/Allocation';
import TrendChart from '@/components/statistics/TrendChart';
import { useTheme } from '@/hooks/useTheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMonthActivitiesThunk } from '@/store/slices/activitySlice';

export default function StatisticsPage() {
  const currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  const [dateView, setDateView] = useState(currentDate);
  const dispatch = useAppDispatch();
  const monthKey = `${dateView.getFullYear()}-${String(dateView.getMonth() + 1).padStart(2, '0')}`;
  const cached = useAppSelector(state => !!state.activity.monthlyActivities[monthKey]);
  useTheme();

  useEffect(() => {
    if (!cached) {
      dispatch(fetchMonthActivitiesThunk({ month: dateView.getMonth() + 1, year: dateView.getFullYear() }));
    }
  }, [monthKey]);

  return (
    <ScreenLayout title="Statistics">
      <MonthPicker value={dateView} onChange={setDateView} />

      <div className="space-y-6 pb-8">
        <Balance dateView={dateView} />
        <Overview dateView={dateView} />
        <Allocation dateView={dateView} />
        <Allocation dateView={dateView} expense />
        <div className="px-5">
          <TrendChart dateView={dateView} />
        </div>
        <div className="px-5">
          <TrendChart dateView={dateView} expense />
        </div>
      </div>
    </ScreenLayout>
  );
}
