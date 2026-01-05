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
  titleKey: string;
  messageKey: string;
  createdAt: string;
  isRead: boolean;
  image?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'booking_created',
    titleKey: 'Booking confirmed',
    messageKey: 'Your SUV rental is confirmed for tomorrow 9:00 AM.',
    createdAt: '2024-06-10T08:30:00Z',
    isRead: false,
    image: '/img/banner/banner1.jpg',
  },
  {
    id: '2',
    type: 'booking_cancelled',
    titleKey: 'Booking cancelled',
    messageKey: 'Customer cancelled booking #A-2041.',
    createdAt: '2024-06-09T19:10:00Z',
    isRead: false,
    image: '/img/banner/banner2.jpg',
  },
  {
    id: '3',
    type: 'payment_success',
    titleKey: 'Payment received',
    messageKey: '₩120,000 received for booking #A-2041.',
    createdAt: '2024-06-09T17:45:00Z',
    isRead: true,
    image: '/img/banner/header1.svg',
  },
  {
    id: '4',
    type: 'payment_failed',
    titleKey: 'Payment failed',
    messageKey: 'Card declined for booking #B-8420.',
    createdAt: '2024-06-08T12:22:00Z',
    isRead: false,
    image: '/img/banner/header2.svg',
  },
  {
    id: '5',
    type: 'system_alert',
    titleKey: 'System maintenance',
    messageKey: 'Planned downtime on Jun 15, 01:30–02:00.',
    createdAt: '2024-06-07T09:00:00Z',
    isRead: true,
    image: '/img/banner/header3.svg',
  },
  {
    id: '6',
    type: 'promotion',
    titleKey: 'Summer promo',
    messageKey: 'Get 10% off EV rentals over 3 days.',
    createdAt: '2024-06-06T14:05:00Z',
    isRead: true,
    image: '/img/banner/aboutBanner.svg',
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
