import { useNavigate } from 'react-router-dom';
import numeral from 'numeral';
import dayjs from 'dayjs';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import ActivityIcon from '@/components/shared/ActivityIcon';
import { COLORS, HIDDEN_AMOUNT_TEXT } from '@/constants';

export default function Activity({
  id,
  expense,
  category,
  amount,
  date,
  lastChild,
}: {
  id: number;
  expense: boolean;
  category: string;
  amount: number;
  date: string;
  lastChild?: boolean;
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const amountVisibility = useAppSelector(state => state.app.amountVisibility);

  return (
    <button
      className="w-full text-left transition-opacity hover:opacity-80 active:opacity-60"
      onClick={() => navigate(`/activity/${id}/edit`)}
    >
      <div className="flex items-center px-4">
        <ActivityIcon category={category} size={40} iconSize={20} />
        <div
          className="flex items-center justify-between flex-1 py-3.5 ml-3.5"
          style={{
            borderBottom: lastChild ? 'none' : `1px solid ${theme.borderBasicColor2}`,
          }}
        >
          <div className="min-w-0 flex-1 mr-3">
            <p className="text-[13px] font-semibold mb-0.5 truncate" style={{ color: theme.textBasicColor }}>
              {category}
            </p>
            <p className="text-[11px]" style={{ color: theme.textHintColor }}>
              {dayjs(date).format('ddd, DD MMM YY HH:mm')}
            </p>
          </div>
          <p
            className="text-[15px] font-bold font-mono shrink-0"
            style={{ color: expense ? COLORS.colorDanger500 : COLORS.colorSuccess500 }}
          >
            {!amountVisibility
              ? HIDDEN_AMOUNT_TEXT
              : `${expense ? '-' : '+'}${numeral(amount).format('0,0')}`}
          </p>
        </div>
      </div>
    </button>
  );
}
