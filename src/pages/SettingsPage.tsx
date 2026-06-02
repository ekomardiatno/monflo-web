import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdPalette, MdPhonelinkSetup,
  MdVisibility, MdVisibilityOff, MdBackup, MdRestore, MdDeleteOutline,
  MdDarkMode, MdLightMode, MdInfo, MdLogout, MdLock, MdPerson,
} from 'react-icons/md';
import dayjs from 'dayjs';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  setAmountVisible,
  setAppearanceType,
  setAutoSelectAppearanceType,
  updateSettingsThunk,
} from '@/store/slices/appSlice';
import { logoutThunk, changeNameThunk } from '@/store/slices/authSlice';
import { clearActivities } from '@/store/slices/activitySlice';
import { changePasswordApi } from '@/services/auth.service';
import { COLORS } from '@/constants';
import { exportBackup } from '@/utils/backup';
import ScreenLayout from '@/components/layout/ScreenLayout';
import ResetMenu from '@/components/settings/ResetMenu';
import RestoreMenu from '@/components/settings/RestoreMenu';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const theme = useTheme();
  return (
    <button
      className="relative shrink-0 rounded-full transition-colors duration-200"
      style={{
        width: 44,
        height: 24,
        backgroundColor: on ? COLORS.colorPrimary500 : theme.backgroundBasicColor4,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <div
        className="absolute top-[2px] rounded-full bg-white shadow-sm transition-all duration-200"
        style={{
          width: 20,
          height: 20,
          left: on ? 22 : 2,
        }}
      />
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <p
      className="text-[11px] font-bold uppercase tracking-wide px-5 pt-5 pb-2"
      style={{ color: theme.textHintColor }}
    >
      {children}
    </p>
  );
}

function SettingRow({
  icon: IconComponent,
  iconColor,
  iconBg,
  title,
  subtitle,
  right,
  onPress,
  last = false,
  disabled = false,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  last?: boolean;
  disabled?: boolean;
}) {
  const theme = useTheme();
  const Wrapper = onPress && !disabled ? 'button' : 'div';

  return (
    <Wrapper
      className={`w-full text-left ${onPress && !disabled ? 'hover:opacity-80 active:opacity-60 transition-opacity' : ''}`}
      onClick={onPress && !disabled ? onPress : undefined}
    >
      <div className="flex items-center px-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg || theme.backgroundBasicColor3 }}
        >
          <IconComponent size={17} color={iconColor || theme.textBasicColor} />
        </div>
        <div
          className="flex items-center flex-1 py-3 ml-3"
          style={{
            borderBottom: last ? 'none' : `1px solid ${theme.borderBasicColor2}`,
          }}
        >
          <div className="flex-1 min-w-0 mr-3">
            <p
              className="text-[13px] font-semibold"
              style={{ color: disabled ? theme.textHintColor : theme.textBasicColor }}
            >
              {title}
            </p>
            {subtitle && (
              <p
                className="text-[11px] mt-0.5 leading-relaxed"
                style={{ color: disabled ? theme.textDisabledColor : theme.textHintColor }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <div className="shrink-0">{right}</div>
        </div>
      </div>
    </Wrapper>
  );
}

export default function SettingsPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const amountVisibility = useAppSelector(state => state.app.amountVisibility);
  const autoSelectAppearance = useAppSelector(state => state.app.autoSelectAppearance);
  const appearanceType = useAppSelector(state => state.app.appearanceType);
  const activities = useAppSelector(state => state.activity.activities);
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showChangeName, setShowChangeName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [nameSubmitting, setNameSubmitting] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const firstActivity = useMemo(() => {
    const history = [...activities];
    if (!history || history.length < 1) return null;
    return history.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )[0];
  }, [activities]);

  const handleAutoTheme = () => {
    const newAuto = !autoSelectAppearance;
    dispatch(setAutoSelectAppearanceType(newAuto));
    if (newAuto) {
      const deviceDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const newTheme = deviceDark ? 'DARK' : 'LIGHT';
      dispatch(setAppearanceType(newTheme));
      dispatch(updateSettingsThunk({ autoSelectAppearance: newAuto, appearanceType: newTheme }));
    } else {
      dispatch(updateSettingsThunk({ autoSelectAppearance: newAuto }));
    }
  };

  const handleChangeVisibility = () => {
    const newVal = !amountVisibility;
    dispatch(setAmountVisible(newVal));
    dispatch(updateSettingsThunk({ amountVisibility: newVal }));
  };

  const handleToggleTheme = () => {
    const newTheme = appearanceType === 'LIGHT' ? 'DARK' : 'LIGHT';
    dispatch(setAppearanceType(newTheme));
    dispatch(updateSettingsThunk({ appearanceType: newTheme }));
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await dispatch(logoutThunk()).unwrap().catch(() => {});
    dispatch(clearActivities());
    navigate('/login', { replace: true });
  };

  const handleChangeName = async () => {
    setNameError(null);
    const trimmed = newName.trim();
    if (!trimmed) {
      setNameError('Name cannot be empty');
      return;
    }
    setNameSubmitting(true);
    try {
      await dispatch(changeNameThunk(trimmed)).unwrap();
      setNameSuccess(true);
      setTimeout(() => {
        setShowChangeName(false);
        setNameSuccess(false);
      }, 2000);
    } catch (err: any) {
      setNameError(err.message || 'Failed to change name');
    } finally {
      setNameSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordSubmitting(true);
    try {
      await changePasswordApi(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const isDark = appearanceType === 'DARK';

  const inputShadow =
    isDark
      ? '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)'
      : '0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)';

  return (
    <ScreenLayout title="Settings">
      {/* Appearance */}
      <SectionLabel>Appearance</SectionLabel>
      <div className="mx-5 rounded-2xl overflow-hidden" style={{ backgroundColor: theme.backgroundBasicColor0 }}>
        <SettingRow
          icon={isDark ? MdDarkMode : MdLightMode}
          iconColor={COLORS.colorBasic000}
          iconBg={isDark ? '#6366f1' : COLORS.colorWarning500}
          title="Theme"
          subtitle={isDark ? 'Dark mode' : 'Light mode'}
          disabled={autoSelectAppearance}
          onPress={handleToggleTheme}
          right={
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: autoSelectAppearance ? theme.backgroundBasicColor3 : theme.backgroundBasicColor2,
                color: autoSelectAppearance ? theme.textDisabledColor : theme.textHintColor,
              }}
            >
              {appearanceType}
            </span>
          }
        />
        <SettingRow
          icon={MdPhonelinkSetup}
          iconColor={COLORS.colorBasic000}
          iconBg={COLORS.colorInfo600}
          title="Use device setting"
          subtitle="Match your device's appearance"
          onPress={handleAutoTheme}
          right={<Toggle on={autoSelectAppearance} onToggle={handleAutoTheme} />}
        />
        <SettingRow
          icon={amountVisibility ? MdVisibility : MdVisibilityOff}
          iconColor={COLORS.colorBasic000}
          iconBg={COLORS.colorSuccess600}
          title="Amount visibility"
          subtitle="Show or hide monetary values"
          onPress={handleChangeVisibility}
          right={<Toggle on={amountVisibility} onToggle={handleChangeVisibility} />}
          last
        />
      </div>

      {/* Data */}
      <SectionLabel>Data</SectionLabel>
      <div className="mx-5 rounded-2xl overflow-hidden" style={{ backgroundColor: theme.backgroundBasicColor0 }}>
        <SettingRow
          icon={MdBackup}
          iconColor={COLORS.colorBasic000}
          iconBg={COLORS.colorPrimary500}
          title="Backup"
          subtitle="Download your data as JSON"
          onPress={() => exportBackup(activities)}
          right={
            <span className="text-[11px] font-mono" style={{ color: theme.textDisabledColor }}>
              {activities.length} items
            </span>
          }
        />
        <RestoreMenu
          onRender={props => (
            <SettingRow
              icon={MdRestore}
              iconColor={COLORS.colorBasic000}
              iconBg={COLORS.colorWarning600}
              title={props.title}
              subtitle={props.subtitle}
              onPress={props.onPress}
            />
          )}
        />
        <ResetMenu
          onRender={props => (
            <SettingRow
              icon={MdDeleteOutline}
              iconColor={COLORS.colorBasic000}
              iconBg={COLORS.colorDanger500}
              title={props.title}
              subtitle={props.subtitle}
              onPress={props.onPress}
              last
            />
          )}
        />
      </div>

      {/* Account */}
      <SectionLabel>Account</SectionLabel>
      <div className="mx-5 rounded-2xl overflow-hidden" style={{ backgroundColor: theme.backgroundBasicColor0 }}>
        <SettingRow
          icon={MdPerson}
          iconColor={COLORS.colorBasic000}
          iconBg={COLORS.colorInfo500}
          title="Change name"
          subtitle={user?.name}
          onPress={() => {
            setShowChangeName(!showChangeName);
            setNameError(null);
            setNameSuccess(false);
            if (!showChangeName) setNewName(user?.name || '');
          }}
        />
        {showChangeName && (
          <div className="px-4 pb-3 space-y-2.5">
            {nameSuccess && (
              <div
                className="text-[12px] text-center py-2 px-3 rounded-lg"
                style={{ backgroundColor: COLORS.colorSuccess100, color: COLORS.colorSuccess600 }}
              >
                Name changed successfully
              </div>
            )}
            {nameError && (
              <div
                className="text-[12px] text-center py-2 px-3 rounded-lg"
                style={{ backgroundColor: COLORS.colorDanger100, color: COLORS.colorDanger600 }}
              >
                {nameError}
              </div>
            )}
            <input
              type="text"
              placeholder="Your name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full text-[13px] px-3 py-2 rounded-lg outline-none"
              style={{
                backgroundColor: theme.backgroundBasicColor1,
                color: theme.textBasicColor,
                boxShadow: inputShadow,
              }}
            />
            <button
              onClick={handleChangeName}
              disabled={nameSubmitting || !newName.trim()}
              className="w-full text-[13px] font-semibold py-2 rounded-lg text-white transition-opacity disabled:opacity-50"
              style={{ backgroundColor: COLORS.colorPrimary500 }}
            >
              {nameSubmitting ? 'Saving...' : 'Save name'}
            </button>
          </div>
        )}
        <SettingRow
          icon={MdLock}
          iconColor={COLORS.colorBasic000}
          iconBg={COLORS.colorPrimary500}
          title="Change password"
          subtitle="Update your account password"
          onPress={() => {
            setShowChangePassword(!showChangePassword);
            setPasswordError(null);
            setPasswordSuccess(false);
          }}
        />
        {showChangePassword && (
          <div className="px-4 pb-3 space-y-2.5">
            {passwordSuccess && (
              <div
                className="text-[12px] text-center py-2 px-3 rounded-lg"
                style={{ backgroundColor: COLORS.colorSuccess100, color: COLORS.colorSuccess600 }}
              >
                Password changed successfully
              </div>
            )}
            {passwordError && (
              <div
                className="text-[12px] text-center py-2 px-3 rounded-lg"
                style={{ backgroundColor: COLORS.colorDanger100, color: COLORS.colorDanger600 }}
              >
                {passwordError}
              </div>
            )}
            <div className="relative">
              <input
                type={showCurrentPw ? 'text' : 'password'}
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full text-[13px] px-3 py-2 pr-9 rounded-lg outline-none"
                style={{
                  backgroundColor: theme.backgroundBasicColor1,
                  color: theme.textBasicColor,
                  boxShadow: inputShadow,
                }}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 transition-opacity"
              >
                {showCurrentPw ? (
                  <MdVisibilityOff size={16} color={theme.textHintColor} />
                ) : (
                  <MdVisibility size={16} color={theme.textHintColor} />
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showNewPw ? 'text' : 'password'}
                placeholder="New password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-[13px] px-3 py-2 pr-9 rounded-lg outline-none"
                style={{
                  backgroundColor: theme.backgroundBasicColor1,
                  color: theme.textBasicColor,
                  boxShadow: inputShadow,
                }}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 transition-opacity"
              >
                {showNewPw ? (
                  <MdVisibilityOff size={16} color={theme.textHintColor} />
                ) : (
                  <MdVisibility size={16} color={theme.textHintColor} />
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPw ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-[13px] px-3 py-2 pr-9 rounded-lg outline-none"
                style={{
                  backgroundColor: theme.backgroundBasicColor1,
                  color: theme.textBasicColor,
                  boxShadow: inputShadow,
                }}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 transition-opacity"
              >
                {showConfirmPw ? (
                  <MdVisibilityOff size={16} color={theme.textHintColor} />
                ) : (
                  <MdVisibility size={16} color={theme.textHintColor} />
                )}
              </button>
            </div>
            <button
              onClick={handleChangePassword}
              disabled={passwordSubmitting || !currentPassword || !newPassword || !confirmPassword}
              className="w-full text-[13px] font-semibold py-2 rounded-lg text-white transition-opacity disabled:opacity-50"
              style={{ backgroundColor: COLORS.colorPrimary500 }}
            >
              {passwordSubmitting ? 'Changing...' : 'Change password'}
            </button>
          </div>
        )}
        <SettingRow
          icon={MdLogout}
          iconColor={COLORS.colorBasic000}
          iconBg={COLORS.colorDanger500}
          title={loggingOut ? 'Logging out...' : 'Log out'}
          subtitle={user?.email}
          onPress={handleLogout}
          disabled={loggingOut}
          last
        />
      </div>

      {/* About */}
      <SectionLabel>About</SectionLabel>
      <div className="mx-5 rounded-2xl overflow-hidden mb-8" style={{ backgroundColor: theme.backgroundBasicColor0 }}>
        <SettingRow
          icon={MdPalette}
          iconColor={COLORS.colorBasic000}
          iconBg={COLORS.colorBasic600}
          title="Activity started"
          subtitle={
            firstActivity
              ? dayjs(firstActivity.date).format('ddd, DD MMM YYYY · hh:mm A')
              : 'No activities yet'
          }
        />
        <SettingRow
          icon={MdInfo}
          iconColor={COLORS.colorBasic000}
          iconBg={COLORS.colorBasic600}
          title="Version"
          right={
            <span className="text-[12px] font-mono" style={{ color: theme.textDisabledColor }}>
              1.0.0
            </span>
          }
          last
        />
      </div>
    </ScreenLayout>
  );
}
