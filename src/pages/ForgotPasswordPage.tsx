import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '@/hooks/useTheme';
import { forgotPasswordApi } from '@/services/auth.service';
import { COLORS } from '@/constants';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function ForgotPasswordPage() {
  const theme = useTheme();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      await forgotPasswordApi(data.email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
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
            Forgot password
          </h1>
          <p
            className="text-[13px] mt-1"
            style={{ color: theme.textHintColor }}
          >
            {sent
              ? 'Check your email for a reset link'
              : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div
              className="text-[12px] text-center py-2.5 px-4 rounded-xl"
              style={{
                backgroundColor: COLORS.colorSuccess100,
                color: COLORS.colorSuccess600,
              }}
            >
              If an account exists with that email, you'll receive a password reset link shortly.
            </div>
            <p
              className="text-center text-[13px]"
              style={{ color: theme.textHintColor }}
            >
              <Link
                to="/login"
                className="font-semibold"
                style={{ color: COLORS.colorPrimary500 }}
              >
                Back to sign in
              </Link>
            </p>
          </div>
        ) : (
          <>
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
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="w-full text-[14px] px-3.5 py-2.5 rounded-xl outline-none"
                  style={{
                    backgroundColor: theme.backgroundBasicColor0,
                    color: theme.textBasicColor,
                    boxShadow: errors.email
                      ? `0 0 0 1.5px ${COLORS.colorDanger400}`
                      : inputShadow,
                  }}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-[11px] mt-1" style={{ color: COLORS.colorDanger500 }}>
                    {errors.email.message}
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
                {submitting ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <p
              className="text-center text-[13px] mt-6"
              style={{ color: theme.textHintColor }}
            >
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-semibold"
                style={{ color: COLORS.colorPrimary500 }}
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
