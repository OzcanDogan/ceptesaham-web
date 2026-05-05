export type UserType = 'Player' | 'BusinessOwner';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: UserType;
  cityId?: number;
  districtId?: number;
  neighborhoodId?: number;
}

export interface FootballField {
  id: number;
  fieldName: string;
  cityId: number;
  cityName?: string;
  districtId: number;
  districtName?: string;
  neighborhoodId: number;
  neighborhoodName?: string;
  address: string;
  hourlyPrice: number;
  startTime: string;
  endTime: string;
  isIndoor: boolean;
  services: string;
  ownerId?: string;
  ownerName?: string;
  ownerPhoneNumber?: string;
  averageRating?: number;
  reviewCount?: number;
}

export interface TimeSlotDto {
  id: number;
  footballFieldId: number;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBlockedByOwner: boolean;
}

export interface ReservationDto {
  id: number;
  timeSlotId: number;
  footballFieldId?: number;
  footballFieldName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  totalPrice?: number;
  status: string;
}

export interface AllMyReservationsResponse {
  cancelledReservations: ReservationDto[];
  activeReservations: ReservationDto[];
  pastReservations: ReservationDto[];
}

export interface WalletDto {
  balance: number;
  heldBalance: number;
  availableBalance: number;
}

export interface WalletTransactionDto {
  id: number;
  amount: number;
  type: 'Deposit' | 'Hold' | 'Release' | 'Transfer';
  description: string;
  relatedMatchId?: number;
  relatedReservationId?: number;
  createdAt: string;
}

export interface PublicMatchParticipant {
  playerId: string;
  playerName: string;
  preferredPosition: string;
  selectedTeam: string;
  isOffline?: boolean;
  offlineDisplayName?: string;
}

export interface PublicMatch {
  id: number;
  reservationId?: number | null;
  footballFieldId: number;
  footballFieldName: string;
  fieldLocation: string;
  organizerId: string;
  organizerName: string;
  title: string;
  description: string;
  teamSize: number;
  maxPlayers: number;
  currentPlayerCount: number;
  status: string;
  matchDate: string;
  startTime: string;
  endTime: string;
  hourlyPrice?: number;
  team1Score?: number;
  team2Score?: number;
  participants: PublicMatchParticipant[];
}

export interface MyMatchesResponse {
  organizedMatches: PublicMatch[];
  joinedMatches: PublicMatch[];
}

export interface PlayerProfile {
  userId: string;
  displayName: string;
  preferredPosition: string;
  dominantFoot: string;
  skillLevel: string;
  age?: number;
  bio?: string;
  totalMatchesPlayed: number;
  goalsScored: number;
  assists: number;
  wins: number;
  losses: number;
  cleanSheets: number;
  manOfTheMatchCount: number;
  averageRating: number;
  cityName?: string;
  districtName?: string;
}

export interface BusinessReservationDto {
  reservationId: number;
  playerEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
}

export const FIELD_SERVICES: { id: number; label: string }[] = [
  { id: 1, label: 'Kafeterya' },
  { id: 2, label: 'Kredi Kartı' },
  { id: 3, label: 'Nakit' },
  { id: 4, label: 'Otopark' },
  { id: 5, label: 'Duş' },
  { id: 6, label: 'Ayakkabı Kiralama' },
  { id: 7, label: 'Eldiven Kiralama' },
  { id: 8, label: 'Soyunma Odası' },
  { id: 9, label: 'Maç Video Kaydı' },
  { id: 10, label: 'Seyirci Oturma Alanı' },
  { id: 11, label: 'Skorboard' },
  { id: 12, label: 'Wifi' },
];

export const parseServices = (raw: string | number[] | null | undefined): number[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as number[];
  try { return JSON.parse(raw as string) as number[]; } catch { return []; }
};
