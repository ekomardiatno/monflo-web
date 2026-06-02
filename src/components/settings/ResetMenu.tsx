import { useState } from 'react';
import { MdWarning } from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { useAppDispatch } from '@/store/hooks';
import { resetActivities } from '@/store/slices/activitySlice';
import ConfirmDialog from '@/components/shared/ConfirmDialog';

export default function ResetMenu({ onRender }: { onRender: (props: {
  icon: string;
  title: string;
  subtitle: string;
  additionalComponent: React.ReactNode;
  onPress: () => void;
}) => React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [isAlertShown, setIsAlertShown] = useState(false);
  const theme = useTheme();

  const handleReset = () => {
    setIsAlertShown(false);
    dispatch(resetActivities());
    alert('Activity history erased');
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
