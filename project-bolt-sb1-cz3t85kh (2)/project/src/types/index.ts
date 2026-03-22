export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  tableId?: string;
}

export interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  reservationId?: string;
  x: number;
  y: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface WaitlistEntry {
  id: string;
  name: string;
  phone: string;
  partySize: number;
  estimatedWait: number;
  status: 'waiting' | 'ready' | 'seated' | 'cancelled';
  timestamp: string;
}

export interface RestaurantStatus {
  isAcceptingWalkIns: boolean;
  averageWaitTime: number;
  currentCapacity: number;
  maxCapacity: number;
  lastUpdated: string;
}

export interface TableKPI {
  totalRevenue: number;
  averageTurnTime: number;
  occupancyRate: number;
  customerSatisfaction: number;
  totalCovers: number;
  averageSpend: number;
}

export interface AIRecommendation {
  id: string;
  type: 'optimization' | 'alert' | 'suggestion';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action?: string;
  timestamp: string;
}

export interface TableDetail extends Table {
  guestStatus: 'waiting_to_seat' | 'seated' | 'ordered' | 'served' | 'paying' | 'cleaning';
  orderStatus?: 'pending' | 'preparing' | 'ready' | 'delivered';
  seatedTime?: string;
  estimatedTurnTime?: number;
  serverName?: string;
  revenue?: number;
}