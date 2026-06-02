import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '@/hooks/useTheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useGoogleLogin } from '@react-oauth/google';
import { registerThunk, googleAuthThunk, clearAuthError } from '@/store/slices/authSlice';
import { fetchActivitiesThunk } from '@/store/slices/activitySlice';
import { fetchSettingsThunk } from '@/store/slices/appSlice';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { COLORS } from '@/constants';

const schema = yup.object({
  name: yup.string().min(1, 'Name is required').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'At least 6 characters').required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function RegisterPage() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error } = useAppSelector((state) => state.auth);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      setSubmitting(true);
      dispatch(clearAuthError());
      dispatch(googleAuthThunk(response.access_token))
        .unwrap()
        .then(() => {
          dispatch(fetchActivitiesThunk());
          dispatch(fetchSettingsThunk());
          navigate('/', { replace: true });
        })
        .catch(() => {})
        .finally(() => setSubmitting(false));
    },
    onError: () => {},
  });

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
    dispatch(clearAuthError());
    try {
      await dispatch(registerThunk(data)).unwrap();
      dispatch(fetchActivitiesThunk());
      dispatch(fetchSettingsThunk());
      navigate('/', { replace: true });
    } catch {
      // error is set in the slice
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
            Monflo
          </h1>
          <p
            className="text-[13px] mt-1"
            style={{ color: theme.textHintColor }}
          >
            Create a new account
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
              Name
            </label>
            <input
              {...register('name')}
              type="text"
              autoComplete="name"
              className="w-full text-[14px] px-3.5 py-2.5 rounded-xl outline-none"
              style={{
                backgroundColor: theme.backgroundBasicColor0,
                color: theme.textBasicColor,
                boxShadow: errors.name
                  ? `0 0 0 1.5px ${COLORS.colorDanger400}`
                  : inputShadow,
              }}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="text-[11px] mt-1" style={{ color: COLORS.colorDanger500 }}>
                {errors.name.message}
              </p>
            )}
          </div>

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

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-[14px] font-semibold py-2.5 rounded-xl text-white transition-opacity disabled:opacity-50"
            style={{
              backgroundColor: COLORS.colorPrimary500,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px" style={{ backgroundColor: theme.borderBasicColor2 }} />
          <span className="px-3 text-[12px]" style={{ color: theme.textHintColor }}>or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: theme.borderBasicColor2 }} />
        </div>

        <button
          type="button"
          disabled={submitting}
          onClick={() => googleLogin()}
          className="w-full flex items-center justify-center gap-2.5 text-[14px] font-semibold py-2.5 rounded-xl transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-50"
          style={{
            backgroundColor: theme.backgroundBasicColor0,
            color: theme.textBasicColor,
            boxShadow: inputShadow,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>

        <p
          className="text-center text-[13px] mt-6"
          style={{ color: theme.textHintColor }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold"
            style={{ color: COLORS.colorPrimary500 }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
