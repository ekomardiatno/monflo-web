import { useState } from 'react';
import { MdWarning } from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { useAppDispatch } from '@/store/hooks';
import { resetActivitiesThunk } from '@/store/slices/activitySlice';
import { useToast } from '@/components/shared/Toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';

export default function ResetMenu({ onRender }: { onRender: (props: {
  icon: string;
  title: string;
  subtitle: string;
  additionalComponent: React.ReactNode;
  onPress: () => void;
}) => React.ReactNode }) {
  const dispatch = useAppDispatch();
  const showToast = useToast();
  const [isAlertShown, setIsAlertShown] = useState(false);
  const theme = useTheme();

  const handleReset = async () => {
    setIsAlertShown(false);
    try {
      await dispatch(resetActivitiesThunk()).unwrap();
      showToast('Activity history erased', 'success');
    } catch {
      showToast('Failed to erase activities', 'error');
    }
  };

  return (
    <>
      {onRender({
        icon: 'restart_alt',
        title: 'Reset',
        subtitle: 'Erase all activities',
        additionalComponent: <MdWarning size={13} color={theme.textHintColor} />,
        onPress: () => setIsAlertShown(true),
      })}
      <ConfirmDialog
        appearance="danger"
        onConfirmed={handleReset}
        onCancel={() => setIsAlertShown(false)}
        confirmText="Erase All"
        cautionText="Are you sure want to erase your activity history?"
        visible={isAlertShown}
      />
    </>
  );
}
