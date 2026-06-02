import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import numeral from 'numeral';
import dayjs from 'dayjs';
import { MdShowChart } from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { COLORS } from '@/constants';

const MTD = 'MTD';
const YTD = 'YTD';

export default function TrendChart({
  style,
  expense = false,
  dateView,
}: {
  style?: React.CSSProperties;
  expense?: boolean;
  dateView: Date;
}) {
  const theme = useTheme();
  const [mtdYtd, setMtdYtd] = useState(MTD);
  const activities = useAppSelector(state => state.activity.activities);

  let currentDate = dateView ?? new Date(new Date().setHours(0, 0, 0, 0));
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  if (currentDate.getTime() !== today.getTime()) {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 0, 0, 0, 0);
  }

  const lineColor = expense ? COLORS.colorDanger500 : COLORS.colorSuccess500;
  const gradientId = expense ? 'gradExpense' : 'gradIncome';

  const data = useMemo(() => {
    const points = [];
    const count = mtdYtd === MTD ? currentDate.getDate() : currentDate.getMonth() + 1;

    for (let i = 0; i < count; i++) {
      const label = dayjs(
        new Date(
          currentDate.getFullYear(),
          mtdYtd === MTD ? currentDate.getMonth() : i,
          mtdYtd === MTD ? i + 1 : 1,
        ),
      ).format(mtdYtd === MTD ? 'D' : 'MMM');

      const fullLabel = dayjs(
        new Date(
          currentDate.getFullYear(),
          mtdYtd === MTD ? currentDate.getMonth() : i,
          mtdYtd === MTD ? i + 1 : 1,
        ),
      ).format(mtdYtd === MTD ? 'ddd, DD MMM YY' : 'MMM Y');

      const value = activities
        .filter(activity => {
          const d = new Date(activity.date);
          if (mtdYtd === MTD) {
            return (
              d.getDate() === i + 1 &&
              d.getMonth() === currentDate.getMonth() &&
              d.getFullYear() === currentDate.getFullYear() &&
              activity.expense === expense
            );
          }
          return (
            d.getMonth() === i &&
            d.getFullYear() === currentDate.getFullYear() &&
            activity.expense === expense
          );
        })
        .reduce((total, a) => total + Number(a.amount), 0);

      points.push({ label, fullLabel, value });
    }
    return points;
  }, [mtdYtd, activities, expense, currentDate]);

  const isNoData = useMemo(() => data.every(p => p.value === 0), [data]);

  const formatYLabel = (value: number) => {
    if (value >= 1_000_000_000_000) return (value / 1_000_000_000_000).toFixed(0) + 'T';
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(0) + 'B';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(0) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K';
    return value.toString();
  };

  return (
    <div style={style}>
      <div className="flex items-center mb-3">
        <p className="text-[13px] font-semibold flex-1" style={{ color: theme.textHintColor }}>
          {expense ? 'Expense' : 'Income'} trend
        </p>

        {/* MTD / YTD toggle */}
        <div
          className="flex p-0.5 rounded-lg"
          style={{ backgroundColor: theme.backgroundBasicColor3 }}
        >
          {[MTD, YTD].map(mode => (
            <button
              key={mode}
              className="px-3 py-1 text-[11px] font-bold rounded-md transition-colors"
              style={{
                backgroundColor: mtdYtd === mode ? COLORS.colorPrimary500 : 'transparent',
                color: mtdYtd === mode ? COLORS.colorBasic100 : theme.textHintColor,
              }}
              onClick={() => setMtdYtd(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.backgroundBasicColor0,
          boxShadow: theme.schema === 'DARK'
            ? '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)'
            : '0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)',
        }}
      >
        {isNoData ? (
          <div className="flex flex-col items-center justify-center py-14 px-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{ backgroundColor: expense ? `${COLORS.colorDanger500}12` : `${COLORS.colorSuccess500}12` }}
            >
              <MdShowChart size={22} color={expense ? COLORS.colorDanger500 : COLORS.colorSuccess500} />
            </div>
            <p className="text-[13px] font-semibold mb-0.5" style={{ color: theme.textBasicColor }}>
              No data available
            </p>
            <p className="text-[11px] text-center leading-relaxed" style={{ color: theme.textHintColor }}>
              {expense ? 'Expense' : 'Income'} trends will appear here
            </p>
          </div>
        ) : (
          <div className="py-4 pr-3">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={lineColor} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke={theme.borderBasicColor2}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: theme.textHintColor }}
                  axisLine={false}
                  tickLine={false}
                  interval={data.length > 25 ? 3 : data.length > 20 ? 2 : data.length > 10 ? 1 : 0}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: theme.textHintColor }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatYLabel}
                  width={45}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.backgroundBasicColor0,
                    border: `1px solid ${theme.borderBasicColor2}`,
                    borderRadius: 12,
                    fontSize: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,.08)',
                  }}
                  labelStyle={{ color: theme.textBasicColor, fontWeight: 600, marginBottom: 2 }}
                  formatter={(value: any) => [numeral(value).format('0,0'), expense ? 'Expense' : 'Income']}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullLabel || ''}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={lineColor}
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                  dot={{ r: 2, fill: lineColor, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: lineColor, stroke: theme.backgroundBasicColor0, strokeWidth: 2.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
