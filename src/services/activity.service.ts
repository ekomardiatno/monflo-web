import { apiFetch } from './api';
import type { ActivityType, SummaryType } from '@/types';

export function fetchActivitiesApi(month?: number, year?: number) {
  const params = month && year ? `?month=${month}&year=${year}` : '';
  return apiFetch<ActivityType[]>(`/activities${params}`);
}

export function fetchSummaryApi() {
  return apiFetch<SummaryType>('/activities/summary');
}

export function createActivityApi(data: Omit<ActivityType, 'id'>) {
  return apiFetch<ActivityType>('/activities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateActivityApi(id: number, data: Partial<ActivityType>) {
  return apiFetch<ActivityType>(`/activities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteActivityApi(id: number) {
  return apiFetch<{ message: string }>(`/activities/${id}`, {
    method: 'DELETE',
  });
}

export function restoreActivitiesApi(activities: Omit<ActivityType, 'id'>[]) {
  return apiFetch<ActivityType[]>('/activities/restore', {
    method: 'POST',
    body: JSON.stringify({ activities }),
  });
}

export function resetActivitiesApi() {
  return apiFetch<{ message: string }>('/activities/reset', {
    method: 'DELETE',
  });
}
