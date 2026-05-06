import apiClient from './client';
import { PlayerProfile } from '../types';

export const getMyProfile = async (): Promise<PlayerProfile> => {
  const response = await apiClient.get('/api/PlayerProfile/my-profile');
  return response.data;
};

export const createOrUpdateProfile = async (data: Partial<PlayerProfile>) => {
  const response = await apiClient.post('/api/PlayerProfile', data);
  return response.data;
};

export const getLeaderboard = async (): Promise<PlayerProfile[]> => {
  const response = await apiClient.get('/api/PlayerProfile/leaderboard');
  return response.data;
};

export const searchPlayers = async (params?: { cityId?: number }): Promise<PlayerProfile[]> => {
  const response = await apiClient.get('/api/PlayerProfile/search', { params });
  return response.data;
};
