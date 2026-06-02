import { apiFetch } from './api';
import type { ActivityType } from '@/types';

export function fetchActivitiesApi() {
  return apiFetch<ActivityType[]>('/activities');
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
