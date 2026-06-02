import { useMemo } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import numeral from 'numeral';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setAmountVisible } from '@/store/slices/appSlice';
import { COLORS, HIDDEN_AMOUNT_TEXT } from '@/constants';

export default function BalanceCard({ stuck = false }: { stuck?: boolean }) {
  const amountVisibility = useAppSelector(state => state.app.amountVisibility);
  const activities = useAppSelector(state => state.activity.activities);
  const dispatch = useAppDispatch();

  const balance = useMemo(() => {
    return activities.reduce(
      (total, activity) => total + activity.amount * (activity.expense ? -1 : 1),
      0,
    );
  }, [activities]);

  const expense = useMemo(() => {
    return activities.reduce(
      (total, activity) => total + activity.amount * (activity.expense ? 1 : 0),
      0,
    );
  }, [activities]);

  const income = useMemo(() => {
    return activities.reduce(
      (total, activity) => total + activity.amount * (activity.expense ? 0 : 1),
      0,
    );
  }, [activities]);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${COLORS.colorPrimary500}, ${COLORS.colorPrimary700}, ${COLORS.colorPrimary800})`,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      {/* decorative circles */}
      <div
        className="absolute opacity-10 rounded-full pointer-events-none"
        style={{
          width: 200, height: 200,
          top: -60, right: -40,
          background: `radial-gradient(circle, ${COLORS.colorBasic100} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute opacity-[0.06] rounded-full pointer-events-none"
        style={{
          width: 120, height: 120,
          bottom: -20, left: -20,
          background: `radial-gradient(circle, ${COLORS.colorBasic100} 0%, transparent 70%)`,
        }}
      />

      <div
        className="relative z-10 transition-all duration-200"
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: stuck ? 12 : 20,
          paddingBottom: stuck ? 12 : 24,
        }}
      >
        {/* Balance */}
        <div className="transition-all duration-200" style={{ marginBottom: stuck ? 0 : 24 }}>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-medium tracking-wide uppercase transition-all duration-200"
              style={{ color: 'rgba(255,255,255,.5)', fontSize: stuck ? 10 : 12 }}
            >
              Total Balance
            </span>
            <button
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              onClick={() => dispatch(setAmountVisible(!amountVisibility))}
            >
              {amountVisibility ? (
                <MdVisibility size={14} color="rgba(255,255,255,.45)" />
              ) : (
                <MdVisibilityOff size={14} color="rgba(255,255,255,.45)" />
              )}
            </button>
          </div>
          <p
            className="font-bold font-mono leading-tight text-white transition-all duration-200"
            style={{ fontSize: stuck ? 22 : 34 }}
          >
            {amountVisibility ? numeral(balance).format('0,0') : HIDDEN_AMOUNT_TEXT}
          </p>
        </div>

        {/* Expense / Income row */}
        <div
          className="flex gap-3 overflow-hidden transition-all duration-200"
          style={{
            maxHeight: stuck ? 0 : 60,
            opacity: stuck ? 0 : 1,
          }}
        >
          <div className="flex-1">
            <p className="text-[10px] font-medium mb-0.5" style={{ color: 'rgba(255,255,255,.45)' }}>
              Expense
            </p>
            <p className="text-[15px] font-semibold font-mono text-white">
              {amountVisibility ? numeral(expense).format('0,0') : HIDDEN_AMOUNT_TEXT}
            </p>
          </div>
          <div className="w-px self-stretch rounded-full" style={{ backgroundColor: 'rgba(255,255,255,.15)' }} />
          <div className="flex-1 text-right">
            <p className="text-[10px] font-medium mb-0.5" style={{ color: 'rgba(255,255,255,.45)' }}>
              Income
            </p>
            <p className="text-[15px] font-semibold font-mono text-white">
              {amountVisibility ? numeral(income).format('0,0') : HIDDEN_AMOUNT_TEXT}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
