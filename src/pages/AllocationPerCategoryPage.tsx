import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import numeral from 'numeral';
import dayjs from 'dayjs';
import { MdReceiptLong } from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { COLORS, HIDDEN_AMOUNT_TEXT } from '@/constants';
import capitalizeFirstText from '@/utils/capitalize';
import ScreenLayout from '@/components/layout/ScreenLayout';
import ActivityIcon from '@/components/shared/ActivityIcon';

export default function AllocationPerCategoryPage() {
  const { dateView: dateViewParam, type, category } = useParams<{
    dateView?: string;
    type?: string;
    category?: string;
  }>();
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

  useEffect(() => {
    if (!category) navigate(-1);
  }, [category, navigate]);

  const { data, total } = useMemo(() => {
    const filtered = activities
      .filter(activity => {
        const d = new Date(activity.date);
        return (
          d.getMonth() === dateView.getMonth() &&
          d.getFullYear() === dateView.getFullYear() &&
          activity.expense === expense &&
          activity.category === category
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const total = filtered.reduce((sum, a) => sum + Number(a.amount), 0);
    return { data: filtered, total };
  }, [activities, dateView, expense, category]);

  return (
    <ScreenLayout
      title={capitalizeFirstText(category?.toLowerCase() ?? '') ?? undefined}
      rightControl={
        <div className="flex items-center gap-2 mr-1">
          <span
            className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: COLORS.colorBasic000 }}
          >
            {dayjs(dateView).format('MMM YYYY')}
          </span>
          <ActivityIcon
            category={category || 'OTHERS'}
            size={28}
            iconSize={15}
            inverted
            iconColor={COLORS.colorBasic000}
          />
        </div>
      }
      contentClassName="flex flex-col"
    >
      {data.length < 1 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ backgroundColor: expense ? `${COLORS.colorDanger500}12` : `${COLORS.colorSuccess500}12` }}
          >
            <MdReceiptLong size={22} color={expense ? COLORS.colorDanger500 : COLORS.colorSuccess500} />
          </div>
          <p className="text-[13px] font-semibold mb-0.5" style={{ color: theme.textBasicColor }}>
            No transactions yet
          </p>
          <p className="text-[11px] text-center leading-relaxed" style={{ color: theme.textHintColor }}>
            {capitalizeFirstText(category?.toLowerCase())} {expense ? 'expenses' : 'incomes'} for {dayjs(dateView).format('MMMM YYYY')} will appear here
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
              <div
                className="flex items-center justify-between px-4 rounded-2xl transition-all duration-200"
                style={{
                  backgroundColor: theme.backgroundBasicColor0,
                  paddingTop: stuck ? 6 : 12,
                  paddingBottom: stuck ? 6 : 12,
                }}
              >
                <div>
                  <p
                    className="font-bold uppercase tracking-wide transition-all duration-200"
                    style={{ color: theme.textHintColor, fontSize: stuck ? 10 : 11 }}
                  >
                    Total
                  </p>
                  <p
                    className="overflow-hidden transition-all duration-200"
                    style={{
                      color: theme.textHintColor,
                      fontSize: 11,
                      maxHeight: stuck ? 0 : 18,
                      marginTop: stuck ? 0 : 2,
                      opacity: stuck ? 0 : 1,
                    }}
                  >
                    {data.length} transaction{data.length > 1 ? 's' : ''}
                  </p>
                </div>
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
            </div>
          </div>

          {/* Transaction list */}
          <div className="px-5 pb-6">
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: theme.backgroundBasicColor0 }}>
            {data.map((row, index, arr) => (
              <button
                key={row.id}
                className="w-full text-left hover:opacity-80 active:opacity-60 transition-opacity"
                onClick={() => navigate(`/activity/${row.id}/edit`)}
              >
                <div className="flex items-center px-4">
                  <div
                    className="flex items-center flex-1 py-3"
                    style={{
                      borderBottom: index + 1 === arr.length ? 'none' : `1px solid ${theme.borderBasicColor2}`,
                    }}
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-[13px] font-semibold mb-0.5" style={{ color: theme.textBasicColor }}>
                        {dayjs(row.date).format('ddd, DD MMM YY · HH:mm')}
                      </p>
                      {row.description ? (
                        <p className="text-[11px] truncate" style={{ color: theme.textHintColor }}>
                          {row.description}
                        </p>
                      ) : (
                        <p className="text-[11px] italic" style={{ color: theme.textDisabledColor }}>
                          No description
                        </p>
                      )}
                    </div>
                    <p
                      className="text-[14px] font-bold font-mono shrink-0"
                      style={{ color: expense ? COLORS.colorDanger500 : COLORS.colorSuccess500 }}
                    >
                      {!amountVisibility
                        ? HIDDEN_AMOUNT_TEXT
                        : `${expense ? '-' : '+'}${numeral(row.amount).format('0,0')}`}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          </div>
        </>
      )}
    </ScreenLayout>
  );
}
