import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '@/hooks/useTheme';
import { resetPasswordApi } from '@/services/auth.service';
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

export default function ResetPasswordPage() {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
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
      await resetPasswordApi(token, email, data.password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ backgroundColor: theme.backgroundBasicColor1 }}
      >
        <div className="w-full max-w-sm text-center">
          <h1
            className="text-[28px] font-bold mb-2"
            style={{ color: theme.textBasicColor }}
          >
            Invalid link
          </h1>
          <p
            className="text-[13px] mb-6"
            style={{ color: theme.textHintColor }}
          >
            This password reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="text-[13px] font-semibold"
            style={{ color: COLORS.colorPrimary500 }}
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

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
            Reset password
          </h1>
          <p
            className="text-[13px] mt-1"
            style={{ color: theme.textHintColor }}
          >
            {success ? 'Your password has been reset' : 'Enter your new password'}
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div
              className="text-[12px] text-center py-2.5 px-4 rounded-xl"
              style={{
                backgroundColor: COLORS.colorSuccess100,
                color: COLORS.colorSuccess600,
              }}
            >
              Password reset successfully. You can now sign in with your new password.
            </div>
            <p className="text-center">
              <Link
                to="/login"
                className="text-[13px] font-semibold"
                style={{ color: COLORS.colorPrimary500 }}
              >
                Go to sign in
              </Link>
            </p>
          </div>
        ) : (
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
                New password
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
              {submitting ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
