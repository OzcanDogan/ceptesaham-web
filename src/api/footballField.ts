import apiClient from './client';
import { FootballField, TimeSlotDto, BusinessReservationDto } from '../types';

export const getAllFields = async (): Promise<FootballField[]> => {
  const response = await apiClient.get('/api/FootballField/get-all-football-fields');
  return response.data;
};

export const getMyField = async (): Promise<FootballField> => {
  const response = await apiClient.get('/api/FootballField/get-footballField-for-business-owner');
  return response.data;
};

export const createField = async (data: {
  fieldName: string; cityId: number; districtId: number; neighborhoodId: number;
  address: string; hourlyPrice: number; startTime: string; endTime: string;
  isIndoor: boolean; services: number[];
}) => {
  const response = await apiClient.post('/api/FootballField/create-football-field', data);
  return response.data;
};

export const updateField = async (data: {
  id: number; fieldName: string; cityId: number; districtId: number; neighborhoodId: number;
  address: string; hourlyPrice: number; isIndoor: boolean; services: number[];
}) => {
  const response = await apiClient.put('/api/FootballField/update-football-field', data);
  return response.data;
};

export const getTimeSlots = async (fieldId: number, date: string): Promise<TimeSlotDto[]> => {
  const response = await apiClient.get(`/api/TimeSlot/get-time-slots-by-field/${fieldId}`, { params: { date } });
  return response.data;
};

export const getBusinessReservations = async (): Promise<BusinessReservationDto[]> => {
  const response = await apiClient.get('/api/FootballField/reservations');
  return response.data;
};
