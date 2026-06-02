import { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import numeral from 'numeral';
import dayjs from 'dayjs';
import { createPortal } from 'react-dom';
import {
  MdArrowBack, MdClose, MdDeleteOutline, MdCheck,
} from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { createActivityThunk, updateActivityThunk, deleteActivityThunk } from '@/store/slices/activitySlice';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, COLORS } from '@/constants';
import { iconInfo } from '@/constants/categories';
import capitalizeFirstText from '@/utils/capitalize';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import ActivityIcon from '@/components/shared/ActivityIcon';
// ActivityType used by activity list lookup

/* ── Schema ── */
interface FormData {
  category: string;
  amount: number;
  date: string;
  time: string;
  description?: string;
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  category: yup.string().required('Pick a category'),
  amount: yup.number().positive().integer().required('Enter an amount').typeError('Enter an amount'),
  date: yup.string().required(),
  time: yup.string().required(),
  description: yup.string().optional(),
});

const MODAL_TYPE = { DELETE: 'DELETE', UPDATE: 'UPDATE', INSERT: 'INSERT' } as const;

/* ─────────────────────────────────────────────────────────
   Category bottom-sheet
   ───────────────────────────────────────────────────────── */
const SHEET_CLOSE_THRESHOLD = 80;

function CategorySheet({
  visible, options, selected, onSelect, onClose,
}: {
  visible: boolean;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  const theme = useTheme();
  const listRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [prevVisible, setPrevVisible] = useState(visible);
  const [leaving, setLeaving] = useState(false);
  const [entered, setEntered] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startY: number; current: number } | null>(null);

  // Adjust state during render when prop changes (React-approved pattern)
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setDragY(0);
    } else {
      setEntered(false);
      setLeaving(true);
    }
  }

  const shouldRender = visible || leaving;

  // Enter animation + scroll into view
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true));
      });
      const timer = setTimeout(() => {
        if (!listRef.current) return;
        const idx = options.indexOf(selected);
        if (idx >= 0) {
          const el = listRef.current.children[idx] as HTMLElement | undefined;
          el?.scrollIntoView({ block: 'center', behavior: 'instant' });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [visible, options, selected]);

  // Exit: unmount after animation
  useEffect(() => {
    if (leaving) {
      document.body.style.overflow = '';
      const timer = setTimeout(() => {
        setLeaving(false);
        setDragY(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [leaving]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = { startY: e.clientY, current: 0 };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dy = Math.max(0, e.clientY - dragRef.current.startY);
    dragRef.current.current = dy;
    setDragY(dy);
  };

  const handlePointerUp = () => {
    if (!dragRef.current) return;
    const dy = dragRef.current.current;
    dragRef.current = null;
    setDragging(false);

    if (dy > SHEET_CLOSE_THRESHOLD) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  if (!shouldRender) return null;

  const backdropOpacity = dragging ? Math.max(0, 1 - dragY / 400) : entered ? 1 : 0;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{
        backgroundColor: theme.backgroundModalBackdropColor,
        opacity: backdropOpacity,
        transition: dragging ? 'none' : 'opacity 300ms',
      }}
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className="w-full max-w-[430px] overflow-hidden"
        style={{
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          backgroundColor: theme.backgroundBasicColor2,
          transform: entered
            ? `translateY(${dragY}px)`
            : 'translateY(100%)',
          transition: dragging ? 'none' : 'transform 300ms ease-out',
          touchAction: 'none',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle — drag zone */}
        <div
          className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className="w-9 h-1 rounded-full"
            style={{ backgroundColor: theme.backgroundBasicColor4 }}
          />
        </div>

        {/* header */}
        <div className="flex items-center justify-between px-5 py-3">
          <p className="text-[17px] font-semibold" style={{ color: theme.textBasicColor }}>
            Choose category
          </p>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full hover:opacity-80"
            style={{ backgroundColor: theme.backgroundBasicColor3 }}
            onClick={onClose}
          >
            <MdClose size={18} color={theme.textBasicColor} />
          </button>
        </div>

        {/* list */}
        <div
          ref={listRef}
          className="overflow-y-auto"
          style={{
            maxHeight: '50vh',
            backgroundColor: theme.backgroundBasicColor0,
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
          }}
        >
          {options.map((cat, i, arr) => {
            const sel = cat === selected;
            const catColor = iconInfo(cat).color;
            return (
              <button
                key={cat}
                className="w-full flex items-center gap-4 px-5 transition-colors hover:opacity-80 active:opacity-60"
                style={{
                  backgroundColor: sel ? COLORS.colorPrimary500 : 'transparent',
                  borderRadius: sel ? 16 : 0,
                }}
                onClick={() => onSelect(cat)}
              >
                <div className="py-2.5 shrink-0">
                  <ActivityIcon category={cat} size={32} iconSize={18} inverted iconColor={sel ? COLORS.colorBasic000 : catColor} />
                </div>
                <div
                  className="flex-1 py-3 text-left"
                  style={{
                    borderBottom: i + 1 < arr.length && !sel ? `1px solid ${theme.borderBasicColor2}` : 'none',
                  }}
                >
                  <span className="text-[15px]" style={{ color: sel ? COLORS.colorBasic000 : theme.textBasicColor }}>
                    {capitalizeFirstText(cat.toLowerCase())}
                  </span>
                </div>
                {sel && (
                  <MdCheck size={20} color={COLORS.colorBasic000} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ─────────────────────────────────────────────────────────
   Main page
   ───────────────────────────────────────────────────────── */
export default function ActivityFormPage() {
  const { id, type } = useParams<{ id?: string; type?: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const activities = useAppSelector(state => state.activity.activities);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<string>(MODAL_TYPE.INSERT);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);

  const isEdit = !!id;
  const activity = useMemo(() => {
    if (!id) return undefined;
    return activities.find(a => a.id === Number(id));
  }, [id, activities]);

  const activityType = useMemo(() => {
    if (activity) return activity.expense ? 'expense' : 'income';
    return type || 'expense';
  }, [activity, type]);

  const isExpense = activityType === 'expense';
  const categories = isExpense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const accentColor = isExpense ? COLORS.colorDanger500 : COLORS.colorSuccess500;
  const inputShadow = theme.schema === 'DARK'
    ? '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)'
    : '0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)';

  const { control, register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: activity?.amount || (undefined as unknown as number),
      date: activity ? dayjs(activity.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      time: activity ? dayjs(activity.date).format('HH:mm') : dayjs().format('HH:mm'),
      category: activity?.category || '',
      description: activity?.description || '',
    },
  });

  const selectedCategory = watch('category');

  /* formatted amount display */
  const [amountDisplay, setAmountDisplay] = useState(() =>
    activity?.amount ? numeral(activity.amount).format('0,0') : '',
  );

  const onAmountChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      setAmountDisplay('');
      setValue('amount', undefined as unknown as number, { shouldValidate: true });
      return;
    }
    setAmountDisplay(numeral(digits).format('0,0'));
    setValue('amount', Number(digits), { shouldValidate: true });
  };

  const [saving, setSaving] = useState(false);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const actData = {
        expense: isExpense,
        date: dayjs(`${data.date} ${data.time}`).format('YYYY-MM-DD HH:mm:ss'),
        description: data.description || '',
        amount: Number(String(data.amount).replace(/\D/g, '')),
        category: data.category,
      };
      if (isEdit && activity) {
        await dispatch(updateActivityThunk({ id: activity.id, data: actData })).unwrap();
      } else {
        await dispatch(createActivityThunk(actData)).unwrap();
      }
      navigate(-1);
    } catch {
      // stay on page on error
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (activity) {
      setSaving(true);
      try {
        await dispatch(deleteActivityThunk(activity.id)).unwrap();
        navigate(-1);
      } catch {
        // stay on page on error
      } finally {
        setSaving(false);
      }
    }
  };

  /* auto-focus amount on mount for new entries */
  useEffect(() => {
    if (!isEdit) amountRef.current?.focus();
  }, [isEdit]);

  /* selected category info */
  const selCatInfo = selectedCategory ? iconInfo(selectedCategory) : null;

  return (
    <div className="flex flex-col flex-1 min-h-full" style={{ backgroundColor: theme.backgroundBasicColor1 }}>

      {/* ───── Hero header ───── */}
      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${COLORS.colorPrimary500}, ${COLORS.colorPrimary700}, ${COLORS.colorPrimary800})`,
          paddingBottom: 30,
        }}
      >
        {/* decorative circle */}
        <div
          className="absolute opacity-10 rounded-full"
          style={{
            width: 200, height: 200,
            top: -60, right: -40,
            background: `radial-gradient(circle, ${COLORS.colorBasic100} 0%, transparent 70%)`,
          }}
        />

        {/* nav row */}
        <div className="flex items-center px-4 pt-3 pb-2">
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            onClick={() => navigate(-1)}
          >
            <MdArrowBack size={22} color={COLORS.colorBasic100} />
          </button>
          <h1 className="text-[17px] font-semibold text-white ml-2 flex-1">
            {isEdit ? 'Edit' : 'New'} {capitalizeFirstText(activityType)}
          </h1>
          {/* type badge */}
          <span
            className="text-[11px] font-bold px-3 py-1 rounded-full"
            style={{
              backgroundColor: isExpense ? 'rgba(244,63,94,.2)' : 'rgba(16,185,129,.2)',
              color: isExpense ? '#fda4af' : '#6ee7b7',
            }}
          >
            {isExpense ? 'EXPENSE' : 'INCOME'}
          </span>
        </div>

        {/* giant amount */}
        <div className="px-5 mt-3">
          <p className="text-[12px] font-medium mb-1" style={{ color: 'rgba(255,255,255,.55)' }}>
            Amount
          </p>
          <div className="flex items-end gap-1">
            <input
              ref={amountRef}
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={amountDisplay}
              onChange={e => onAmountChange(e.target.value)}
              className="bg-transparent outline-none text-white font-mono font-bold w-full"
              style={{ fontSize: amountDisplay.length > 10 ? 28 : 36, lineHeight: 1 }}
            />
          </div>
          {errors.amount && (
            <p className="text-[12px] mt-1.5" style={{ color: '#fda4af' }}>
              {errors.amount.message}
            </p>
          )}
        </div>
      </div>

      {/* ───── Form card ───── */}
      <div
        className="flex-1 -mt-4 relative"
        style={{
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          backgroundColor: theme.backgroundBasicColor1,
        }}
      >
        <div className="px-5 pt-6 pb-8">

          {/* Date & Time row */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1">
              <label className="text-[12px] font-medium mb-1.5 block" style={{ color: theme.textHintColor }}>
                Date
              </label>
              <div
                className="px-3 py-3 rounded-xl"
                style={{
                  backgroundColor: theme.backgroundBasicColor0,
                  boxShadow: inputShadow,
                }}
              >
                <input
                  type="date"
                  className="w-full bg-transparent outline-none text-[14px]"
                  style={{ color: theme.textBasicColor, colorScheme: theme.schema === 'DARK' ? 'dark' : 'light' }}
                  {...register('date')}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[12px] font-medium mb-1.5 block" style={{ color: theme.textHintColor }}>
                Time
              </label>
              <div
                className="px-3 py-3 rounded-xl"
                style={{
                  backgroundColor: theme.backgroundBasicColor0,
                  boxShadow: inputShadow,
                }}
              >
                <input
                  type="time"
                  className="w-full bg-transparent outline-none text-[14px]"
                  style={{ color: theme.textBasicColor, colorScheme: theme.schema === 'DARK' ? 'dark' : 'light' }}
                  {...register('time')}
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="mb-5">
            <label className="text-[12px] font-medium mb-1.5 block" style={{ color: theme.textHintColor }}>
              Category {errors.category && <span style={{ color: COLORS.colorDanger400, fontWeight: 500 }}>— {errors.category.message}</span>}
            </label>
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors hover:opacity-90 active:opacity-70"
              style={{
                backgroundColor: theme.backgroundBasicColor0,
                boxShadow: errors.category ? `0 0 0 1.5px ${COLORS.colorDanger400}` : inputShadow,
              }}
              onClick={() => setCategoryOpen(true)}
            >
              {selCatInfo ? (
                <>
                  <ActivityIcon category={selectedCategory} size={32} iconSize={18} />
                  <span className="flex-1 text-left text-[14px] font-medium" style={{ color: theme.textBasicColor }}>
                    {capitalizeFirstText(selectedCategory.toLowerCase())}
                  </span>
                </>
              ) : (
                <>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme.backgroundBasicColor3 }}
                  >
                    <MdCheck size={16} color={theme.textHintColor} />
                  </div>
                  <span className="flex-1 text-left text-[14px]" style={{ color: theme.textHintColor }}>
                    Tap to choose...
                  </span>
                </>
              )}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke={theme.textHintColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="text-[12px] font-medium mb-1.5 block" style={{ color: theme.textHintColor }}>
              Note
            </label>
            <div
              className="px-3 py-3 rounded-xl"
              style={{
                backgroundColor: theme.backgroundBasicColor0,
                boxShadow: inputShadow,
              }}
            >
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <textarea
                    placeholder="Add a note..."
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value)}
                    className="w-full bg-transparent outline-none resize-none text-[14px] leading-relaxed"
                    style={{ color: theme.textBasicColor, minHeight: 72 }}
                  />
                )}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {isEdit && (
              <button
                type="button"
                disabled={saving}
                className="w-[52px] shrink-0 flex items-center justify-center rounded-xl transition-colors hover:opacity-90 active:opacity-70 disabled:opacity-50"
                style={{ backgroundColor: 'rgba(244,63,94,.1)' }}
                onClick={() => {
                  setModalType(MODAL_TYPE.DELETE);
                  setModalVisible(true);
                }}
              >
                <MdDeleteOutline size={22} color={COLORS.colorDanger500} />
              </button>
            )}
            <button
              type="button"
              disabled={saving}
              className="flex-1 py-3.5 rounded-xl text-[16px] font-semibold text-white transition-colors hover:opacity-90 active:opacity-75 disabled:opacity-50"
              style={{
                backgroundColor: isEdit ? COLORS.colorWarning500 : accentColor,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              onClick={() => {
                setModalType(isEdit ? MODAL_TYPE.UPDATE : MODAL_TYPE.INSERT);
                setModalVisible(true);
              }}
            >
              {isEdit ? 'Save Changes' : `Add ${capitalizeFirstText(activityType)}`}
            </button>
          </div>
        </div>
      </div>

      {/* ───── Overlays ───── */}
      <CategorySheet
        visible={categoryOpen}
        options={categories}
        selected={selectedCategory || ''}
        onSelect={v => {
          setValue('category', v, { shouldValidate: true });
          setCategoryOpen(false);
        }}
        onClose={() => setCategoryOpen(false)}
      />

      <ConfirmDialog
        visible={modalVisible}
        appearance={modalType === MODAL_TYPE.DELETE ? 'danger' : modalType === MODAL_TYPE.INSERT ? 'primary' : 'warning'}
        onConfirmed={() => {
          setModalVisible(false);
          if (modalType === MODAL_TYPE.DELETE) onDelete();
          else handleSubmit(onSubmit)();
        }}
        cautionText={
          modalType === MODAL_TYPE.DELETE
            ? 'Are you sure want to delete this activity?'
            : modalType === MODAL_TYPE.INSERT
              ? 'Are you sure want to insert this activity?'
              : 'Are you sure want to save the changes?'
        }
        onCancel={() => setModalVisible(false)}
        confirmText={modalType === MODAL_TYPE.DELETE ? 'Delete' : modalType === MODAL_TYPE.INSERT ? 'Save' : 'Update'}
      />
    </div>
  );
}
