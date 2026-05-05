import apiClient from './client';
import { PublicMatch, MyMatchesResponse } from '../types';

export const getOpenMatches = async (): Promise<PublicMatch[]> => {
  const response = await apiClient.get('/api/publicmatch/open');
  return response.data;
};

export const getMatchById = async (id: number): Promise<PublicMatch> => {
  const response = await apiClient.get(`/api/publicmatch/${id}`);
  return response.data;
};

export const getMyMatches = async (): Promise<MyMatchesResponse> => {
  const response = await apiClient.get('/api/publicmatch/my-matches');
  return response.data;
};

export const sendJoinRequest = async (id: number, preferredPosition?: number, selectedTeam?: number): Promise<void> => {
  await apiClient.post(`/api/publicmatch/${id}/join-request`, { preferredPosition, selectedTeam });
};

export const leaveMatch = async (id: number): Promise<void> => {
  await apiClient.post(`/api/publicmatch/${id}/leave`);
};

export const cancelMatch = async (id: number): Promise<void> => {
  await apiClient.post(`/api/publicmatch/${id}/cancel`);
};

export const approveJoinRequest = async (requestId: number): Promise<void> => {
  await apiClient.post(`/api/publicmatch/join-request/${requestId}/approve`);
};

export const rejectJoinRequest = async (requestId: number): Promise<void> => {
  await apiClient.post(`/api/publicmatch/join-request/${requestId}/reject`);
};

export const getPendingJoinRequests = async (matchId?: number) => {
  const response = await apiClient.get('/api/publicmatch/join-requests', { params: matchId ? { matchId } : undefined });
  return response.data;
};

export const createPublicMatch = async (data: {
  reservationId?: number;
  footballFieldId?: number;
  title: string;
  description: string;
  teamSize: number;
}): Promise<PublicMatch> => {
  const response = await apiClient.post('/api/publicmatch/create', data);
  return response.data;
};
