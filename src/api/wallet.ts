import apiClient from './client';
import { WalletDto, WalletTransactionDto } from '../types';

export const getWalletBalance = async (): Promise<WalletDto> => {
  const res = await apiClient.get('/api/wallet');
  return res.data;
};

export const getWalletTransactions = async (): Promise<WalletTransactionDto[]> => {
  const res = await apiClient.get('/api/wallet/transactions');
  return res.data;
};

export const depositToWallet = async (amount: number): Promise<WalletDto> => {
  const res = await apiClient.post('/api/wallet/deposit', { amount });
  return res.data;
};

export const withdrawFromWallet = async (amount: number): Promise<WalletDto> => {
  const res = await apiClient.post('/api/wallet/withdraw', { amount });
  return res.data;
};
