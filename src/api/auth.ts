import apiClient from './client';
import { User } from '../types';

export const login = async (data: { email: string; password: string }) => {
  const response = await apiClient.post('/api/Account/authenticate', data);
  return response.data;
};

export const register = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;
  phoneNumber: string;
  tcKimlik: string;
  cityId?: number;
  districtId?: number;
  neighborhoodId?: number;
}) => {
  const response = await apiClient.post('/api/Account/register', data);
  return response.data;
};

export const getUserInfo = async (): Promise<User> => {
  const response = await apiClient.get('/api/Account/get-user-info');
  return response.data;
};

export const updateUser = async (data: { firstName: string; lastName: string; phoneNumber: string }) => {
  const response = await apiClient.put('/api/Account/updateUser', data);
  return response.data;
};

export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
  const response = await apiClient.put('/api/Account/changePassword', data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await apiClient.post('/api/Account/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (email: string, token: string, password: string, confirmPassword: string) => {
  const response = await apiClient.post('/api/Account/reset-password', { email, token, password, confirmPassword });
  return response.data;
};
