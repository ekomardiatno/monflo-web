import dayjs from 'dayjs';
import type { ActivityType } from '@/types';
import { BACKUP_FILE_NAME } from '@/constants';

export function exportBackup(activities: ActivityType[]): void {
  const data = JSON.stringify(activities);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${dayjs().format('DDMMYYYY_HHmmss')}_${BACKUP_FILE_NAME}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importBackup(file: File): Promise<ActivityType[]> {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.json')) {
      reject(new Error('Please select a JSON file'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!Array.isArray(data)) {
          throw new Error('Data was not supported');
        }
        if (data.length < 1) {
          throw new Error('Data was not supported');
        }
        if (
          data[0].id === undefined ||
          data[0].expense === undefined ||
          data[0].date === undefined ||
          data[0].description === undefined ||
          data[0].amount === undefined
        ) {
          throw new Error('Data was not supported');
        }
        resolve(data as ActivityType[]);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Restore failed'));
    reader.readAsText(file);
  });
}
