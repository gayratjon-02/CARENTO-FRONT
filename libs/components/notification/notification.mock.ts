export type NotificationType =
  | 'booking_created'
  | 'booking_cancelled'
  | 'payment_success'
  | 'payment_failed'
  | 'system_alert'
  | 'promotion';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'booking_created',
    title: 'Booking confirmed',
    message: 'Your SUV rental is confirmed for tomorrow 9:00 AM.',
    createdAt: '2024-06-10T08:30:00Z',
    isRead: false,
  },
  {
    id: '2',
    type: 'booking_cancelled',
    title: 'Booking cancelled',
    message: 'Customer cancelled booking #A-2041.',
    createdAt: '2024-06-09T19:10:00Z',
    isRead: false,
  },
  {
    id: '3',
    type: 'payment_success',
    title: 'Payment received',
    message: '₩120,000 received for booking #A-2041.',
    createdAt: '2024-06-09T17:45:00Z',
    isRead: true,
  },
  {
    id: '4',
    type: 'payment_failed',
    title: 'Payment failed',
    message: 'Card declined for booking #B-8420.',
    createdAt: '2024-06-08T12:22:00Z',
    isRead: false,
  },
  {
    id: '5',
    type: 'system_alert',
    title: 'System maintenance',
    message: 'Planned downtime on Jun 15, 01:30–02:00.',
    createdAt: '2024-06-07T09:00:00Z',
    isRead: true,
  },
  {
    id: '6',
    type: 'promotion',
    title: 'Summer promo',
    message: 'Get 10% off EV rentals over 3 days.',
    createdAt: '2024-06-06T14:05:00Z',
    isRead: true,
  },
];

export const notificationCategories: { key: NotificationType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'booking_created', label: 'Booking' },
  { key: 'booking_cancelled', label: 'Booking' },
  { key: 'payment_success', label: 'Payment' },
  { key: 'payment_failed', label: 'Payment' },
  { key: 'system_alert', label: 'System' },
  { key: 'promotion', label: 'Promotion' },
];
