import apiClient from './client';
import { ReservationDto, AllMyReservationsResponse } from '../types';

export const createReservation = async (timeSlotId: number): Promise<ReservationDto> => {
  const response = await apiClient.post('/api/Reservations/create-new-reservation', { timeSlotId });
  return response.data;
};

export const confirmPayment = async (id: number): Promise<ReservationDto> => {
  const response = await apiClient.post(`/api/Reservations/${id}/confirm-payment`);
  return response.data;
};

export const cancelReservation = async (id: number) => {
  const response = await apiClient.post(`/api/Reservations/${id}/cancel-reservation`);
  return response.data;
};

export const getMyReservations = async (): Promise<AllMyReservationsResponse> => {
  const response = await apiClient.get('/api/Reservations/get-all-my-reservations');
  return response.data;
};
