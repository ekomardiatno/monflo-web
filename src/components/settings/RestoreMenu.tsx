import { useRef, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { resetActivities } from '@/store/slices/activitySlice';
import { importBackup } from '@/utils/backup';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import type { ActivityType } from '@/types';

export default function RestoreMenu({ onRender }: { onRender: (props: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) => React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [isAlertShown, setIsAlertShown] = useState(false);
  const [fileContent, setFileContent] = useState<ActivityType[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRestore = () => {
    setIsAlertShown(false);
    if (fileContent) {
      dispatch(resetActivities(fileContent));
      alert('Restore completed');
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importBackup(file);
      setFileContent(data);
      setIsAlertShown(true);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Restore failed');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {onRender({
        icon: 'restore',
        title: 'Restore',
        subtitle: 'Restore your kept backup file',
        onPress: openFilePicker,
      })}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />
      <ConfirmDialog
        appearance="primary"
        onConfirmed={handleRestore}
        onCancel={() => setIsAlertShown(false)}
        visible={isAlertShown}
        cautionText="Are you sure want to restore and erase all of your current activity history?"
        confirmText="Restore"
      />
    </>
  );
}
