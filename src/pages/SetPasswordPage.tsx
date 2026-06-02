import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '@/hooks/useTheme';
import { useAppDispatch } from '@/store/hooks';
import { setPasswordThunk } from '@/store/slices/authSlice';
import { fetchActivitiesThunk } from '@/store/slices/activitySlice';
import { fetchSettingsThunk } from '@/store/slices/appSlice';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { COLORS } from '@/constants';

const schema = yup.object({
  password: yup.string().min(6, 'At least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

type FormData = yup.InferType<typeof schema>;

export default function SetPasswordPage() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputShadow =
    theme.schema === 'DARK'
      ? '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)'
      : '0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError(null);
    try {
      await dispatch(setPasswordThunk(data.password)).unwrap();
      dispatch(fetchActivitiesThunk());
      dispatch(fetchSettingsThunk());
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to set password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: theme.backgroundBasicColor1 }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1
            className="text-[28px] font-bold"
            style={{ color: theme.textBasicColor }}
          >
            Set your password
          </h1>
          <p
            className="text-[13px] mt-1"
            style={{ color: theme.textHintColor }}
          >
            Create a password to secure your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div
              className="text-[12px] text-center py-2.5 px-4 rounded-xl"
              style={{
                backgroundColor: COLORS.colorDanger100,
                color: COLORS.colorDanger600,
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label
              className="block text-[12px] font-medium mb-1.5"
              style={{ color: theme.textHintColor }}
            >
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="w-full text-[14px] px-3.5 py-2.5 pr-10 rounded-xl outline-none"
                style={{
                  backgroundColor: theme.backgroundBasicColor0,
                  color: theme.textBasicColor,
                  boxShadow: errors.password
                    ? `0 0 0 1.5px ${COLORS.colorDanger400}`
                    : inputShadow,
                }}
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 transition-opacity"
              >
                {showPassword ? (
                  <MdVisibilityOff size={18} color={theme.textHintColor} />
                ) : (
                  <MdVisibility size={18} color={theme.textHintColor} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] mt-1" style={{ color: COLORS.colorDanger500 }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-[12px] font-medium mb-1.5"
              style={{ color: theme.textHintColor }}
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                className="w-full text-[14px] px-3.5 py-2.5 pr-10 rounded-xl outline-none"
                style={{
                  backgroundColor: theme.backgroundBasicColor0,
                  color: theme.textBasicColor,
                  boxShadow: errors.confirmPassword
                    ? `0 0 0 1.5px ${COLORS.colorDanger400}`
                    : inputShadow,
                }}
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 transition-opacity"
              >
                {showConfirm ? (
                  <MdVisibilityOff size={18} color={theme.textHintColor} />
                ) : (
                  <MdVisibility size={18} color={theme.textHintColor} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] mt-1" style={{ color: COLORS.colorDanger500 }}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-[14px] font-semibold py-2.5 rounded-xl text-white transition-opacity disabled:opacity-50"
            style={{
              backgroundColor: COLORS.colorPrimary500,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {submitting ? 'Setting password...' : 'Set password'}
          </button>
        </form>
      </div>
    </div>
  );
}
