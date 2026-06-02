import { useRef, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { restoreActivitiesThunk } from '@/store/slices/activitySlice';
import { importBackup } from '@/utils/backup';
import { useToast } from '@/components/shared/Toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import type { ActivityType } from '@/types';

export default function RestoreMenu({ onRender }: { onRender: (props: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) => React.ReactNode }) {
  const dispatch = useAppDispatch();
  const showToast = useToast();
  const [isAlertShown, setIsAlertShown] = useState(false);
  const [fileContent, setFileContent] = useState<ActivityType[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRestore = async () => {
    setIsAlertShown(false);
    if (fileContent) {
      try {
        const stripped = fileContent.map(({ id: _, ...rest }) => rest);
        await dispatch(restoreActivitiesThunk(stripped)).unwrap();
        showToast('Restore completed', 'success');
      } catch {
        showToast('Restore failed', 'error');
      }
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
      showToast(err instanceof Error ? err.message : 'Restore failed', 'error');
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
