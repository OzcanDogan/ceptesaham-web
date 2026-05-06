import apiClient from './client';

export interface City         { id: number; name: string; }
export interface District     { id: number; name: string; cityId: number; }
export interface Neighborhood { id: number; name: string; districtId: number; }

export const getCities       = (): Promise<City[]>           => apiClient.get('/api/location/cities').then(r => r.data);
export const getDistricts    = (cityId: number): Promise<District[]>     => apiClient.get(`/api/location/districts/${cityId}`).then(r => r.data);
export const getNeighborhoods = (districtId: number): Promise<Neighborhood[]> => apiClient.get(`/api/location/neighborhoods/${districtId}`).then(r => r.data);
