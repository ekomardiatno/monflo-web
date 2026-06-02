import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdReceiptLong, MdArrowForward } from 'react-icons/md';
import dayjs from 'dayjs';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import Activity from '@/components/activity/Activity';

export default function ThisMonthActivities() {
  const theme = useTheme();
  const activities = useAppSelector(state => state.activity.activities);
  const navigate = useNavigate();
  const currentDate = new Date();

  const thisMonthActivities = useMemo(() => {
    return activities
      .filter(activity => {
        const d = new Date(activity.date);
        return d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth();
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activities]);

  const cardShadow = theme.schema === 'DARK'
    ? '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)'
    : '0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)';

  return (
    <div>
      <div className="flex items-center mb-2.5 px-5">
        <div className="flex-1">
          <p className="text-[13px] font-semibold" style={{ color: theme.textHintColor }}>
            Recent activities
          </p>
        </div>
        <button
          className="flex items-center gap-0.5 hover:opacity-70"
          onClick={() => {
            navigate(`/history/${dayjs(new Date(new Date().setHours(0, 0, 0, 0))).format('YYYY-MM-DD')}`);
          }}
        >
          <span className="text-[13px] font-medium" style={{ color: theme.textPrimaryColor }}>
            View all
          </span>
          <MdArrowForward size={14} color={theme.textPrimaryColor} />
        </button>
      </div>
      <div className="mx-5">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: theme.backgroundBasicColor0,
            boxShadow: cardShadow,
          }}
        >
          {thisMonthActivities.length < 1 ? (
            <div className="flex flex-col items-center justify-center py-14 px-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${theme.textHintColor}12` }}
              >
                <MdReceiptLong size={22} color={theme.textHintColor} />
              </div>
              <p className="text-[13px] font-semibold mb-0.5" style={{ color: theme.textBasicColor }}>
                No activities yet
              </p>
              <p className="text-[11px] text-center" style={{ color: theme.textHintColor }}>
                Your recent transactions will show up here
              </p>
            </div>
          ) : (
            thisMonthActivities.slice(0, 5).map((activity, i, arr) => (
              <Activity
                key={activity.id}
                id={activity.id}
                expense={activity.expense}
                category={activity.category}
                amount={activity.amount}
                date={activity.date}
                lastChild={i + 1 === arr.length}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
