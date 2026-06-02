import { useMemo } from 'react';
import numeral from 'numeral';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { HIDDEN_AMOUNT_TEXT } from '@/constants';

export default function Balance({
  style,
  dateView = new Date(new Date().setHours(0, 0, 0, 0)),
}: {
  style?: React.CSSProperties;
  dateView: Date;
}) {
  const theme = useTheme();
  const activities = useAppSelector(state => state.activity.activities);
  const amountVisibility = useAppSelector(state => state.app.amountVisibility);

  const balanceData = useMemo(() => {
    const current = new Date(dateView.getFullYear(), dateView.getMonth(), 1, 0, 0, 0, 0);
    const next = new Date(dateView.getFullYear(), dateView.getMonth() + 1, 1, 0, 0, 0, 0);

    const opening = activities
      .filter(a => new Date(a.date).getTime() < current.getTime())
      .reduce((total, a) => total + a.amount * (a.expense ? -1 : 1), 0);

    const closing = activities
      .filter(a => new Date(a.date).getTime() < next.getTime())
      .reduce((total, a) => total + a.amount * (a.expense ? -1 : 1), 0);

    return { opening, closing };
  }, [activities, dateView]);

  const cardShadow = theme.schema === 'DARK'
    ? '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)'
    : '0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)';

  return (
    <div style={style} className="px-5">
      <p className="text-[13px] font-semibold mb-3" style={{ color: theme.textHintColor }}>
        Balance
      </p>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: theme.backgroundBasicColor0, boxShadow: cardShadow }}
      >
        <div className="flex">
          {/* Opening */}
          <div className="flex-1 px-4 py-3.5">
            <p className="text-[11px] font-medium mb-1" style={{ color: theme.textHintColor }}>
              Opening
            </p>
            <p className="text-[16px] font-bold font-mono" style={{ color: theme.textBasicColor }}>
              {!amountVisibility ? HIDDEN_AMOUNT_TEXT : numeral(balanceData.opening).format('0,0')}
            </p>
          </div>

          {/* Divider */}
          <div className="w-px my-3" style={{ backgroundColor: theme.borderBasicColor2 }} />

          {/* Closing */}
          <div className="flex-1 px-4 py-3.5">
            <p className="text-[11px] font-medium mb-1" style={{ color: theme.textHintColor }}>
              Closing
            </p>
            <p className="text-[16px] font-bold font-mono" style={{ color: theme.textBasicColor }}>
              {!amountVisibility ? HIDDEN_AMOUNT_TEXT : numeral(balanceData.closing).format('0,0')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
