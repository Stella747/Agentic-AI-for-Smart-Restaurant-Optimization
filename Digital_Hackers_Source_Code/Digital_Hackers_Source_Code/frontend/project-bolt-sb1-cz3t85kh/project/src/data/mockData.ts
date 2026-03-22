import { Table, MenuItem, Reservation, WaitlistEntry, RestaurantStatus } from '../types';

export const tables: Table[] = [
  { id: '1', number: 1, seats: 2, status: 'available', x: 50, y: 50 },
  { id: '2', number: 2, seats: 4, status: 'occupied', x: 200, y: 50 },
  { id: '3', number: 3, seats: 2, status: 'reserved', x: 350, y: 50, reservationId: 'res1' },
  { id: '4', number: 4, seats: 6, status: 'available', x: 50, y: 200 },
  { id: '5', number: 5, seats: 4, status: 'occupied', x: 200, y: 200 },
  { id: '6', number: 6, seats: 8, status: 'available', x: 350, y: 200 },
  { id: '7', number: 7, seats: 2, status: 'maintenance', x: 50, y: 350 },
  { id: '8', number: 8, seats: 4, status: 'available', x: 200, y: 350 },
  { id: '9', number: 9, seats: 2, status: 'reserved', x: 350, y: 350, reservationId: 'res2' },
  { id: '10', number: 10, seats: 6, status: 'available', x: 500, y: 200 },
];

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Truffle Risotto',
    description: 'Creamy arborio rice with black truffle, parmesan, and fresh herbs',
    price: 28,
    category: 'Mains',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Pan-Seared Salmon',
    description: 'Atlantic salmon with lemon butter sauce and seasonal vegetables',
    price: 32,
    category: 'Mains',
    image: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Chocolate Soufflé',
    description: 'Rich dark chocolate soufflé with vanilla ice cream',
    price: 14,
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    name: 'Beef Wellington',
    description: 'Tender beef fillet wrapped in puff pastry with mushroom duxelles',
    price: 45,
    category: 'Mains',
    image: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const reservations: Reservation[] = [
  {
    id: 'res1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    date: '2025-01-15',
    time: '19:00',
    guests: 2,
    status: 'confirmed',
    tableId: '3'
  },
  {
    id: 'res2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 234 567 8901',
    date: '2025-01-15',
    time: '20:30',
    guests: 2,
    status: 'confirmed',
    tableId: '9'
  }
]