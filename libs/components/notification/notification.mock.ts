export type NotificationType = 'booking_created' | 'booking_cancelled' | 'payment_success' | 'payment_failed' | 'system_alert' | 'promotion';

export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	createdAt: Date;
	isRead: boolean;
}

export const mockNotifications: Notification[] = [
	{
		id: '1',
		type: 'booking_created',
		title: 'New Booking Confirmed',
		message: 'Your booking for Toyota Camry 2024 has been confirmed. Pickup: June 15, 10:00 AM',
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		isRead: false,
	},
	{
		id: '2',
		type: 'payment_success',
		title: 'Payment Successful',
		message: 'Payment of $450.00 for booking #BK-2024-001 has been processed successfully.',
		createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
		isRead: false,
	},
	{
		id: '3',
		type: 'booking_cancelled',
		title: 'Booking Cancelled',
		message: 'Your booking #BK-2024-002 has been cancelled. Refund will be processed within 3-5 business days.',
		createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
		isRead: true,
	},
	{
		id: '4',
		type: 'system_alert',
		title: 'System Maintenance Scheduled',
		message: 'Scheduled maintenance on June 20, 2024 from 2:00 AM to 4:00 AM. Some features may be unavailable.',
		createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
		isRead: false,
	},
	{
		id: '5',
		type: 'promotion',
		title: 'Summer Special Offer',
		message: 'Get 20% off on all SUV rentals for trips longer than 5 days. Use code SUMMER2024 at checkout.',
		createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
		isRead: true,
	},
	{
		id: '6',
		type: 'payment_failed',
		title: 'Payment Failed',
		message: 'Payment for booking #BK-2024-003 failed. Please update your payment method and try again.',
		createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
		isRead: false,
	},
	{
		id: '7',
		type: 'booking_created',
		title: 'Booking Reminder',
		message: 'Reminder: Your booking for Honda Accord starts tomorrow at 9:00 AM. Please arrive 15 minutes early.',
		createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
		isRead: true,
	},
	{
		id: '8',
		type: 'system_alert',
		title: 'New Feature Available',
		message: 'You can now track your rental vehicle in real-time. Check the app for more details.',
		createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
		isRead: true,
	},
	{
		id: '9',
		type: 'promotion',
		title: 'Weekend Special',
		message: 'Book any vehicle this weekend and get free GPS navigation and child seat included.',
		createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
		isRead: true,
	},
	{
		id: '10',
		type: 'payment_success',
		title: 'Refund Processed',
		message: 'Your refund of $320.00 has been processed and will appear in your account within 3-5 business days.',
		createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
		isRead: true,
	},
];

export type NotificationCategory = 'all' | 'booking' | 'payment' | 'system' | 'promotion';

export const getCategoryFromType = (type: NotificationType): NotificationCategory => {
	if (type === 'booking_created' || type === 'booking_cancelled') return 'booking';
	if (type === 'payment_success' || type === 'payment_failed') return 'payment';
	if (type === 'system_alert') return 'system';
	if (type === 'promotion') return 'promotion';
	return 'all';
};

