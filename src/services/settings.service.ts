import { apiFetch } from './api';
import type { SettingsType } from '@/types';

export function fetchSettingsApi() {
  return apiFetch<SettingsType>('/settings');
}

export function updateSettingsApi(data: Partial<SettingsType>) {
  return apiFetch<SettingsType>('/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
