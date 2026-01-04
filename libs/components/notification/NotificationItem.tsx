import React from 'react';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PaymentIcon from '@mui/icons-material/Payment';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Notification } from './notification.mock';
import styles from './notification.module.scss';

interface NotificationItemProps {
	item: Notification;
	onMarkRead: (id: string) => void;
	timeLabel: string;
}

const iconMap: Record<Notification['type'], React.ReactNode> = {
	booking_created: <BookOnlineIcon className={styles.icon} />,
	booking_cancelled: <BookOnlineIcon className={styles.icon} />,
	payment_success: <PaymentIcon className={styles.icon} />,
	payment_failed: <ErrorOutlineIcon className={styles.icon} />,
	system_alert: <SystemUpdateIcon className={styles.icon} />,
	promotion: <LocalOfferIcon className={styles.icon} />,
};

const iconColor: Record<Notification['type'], string> = {
	booking_created: '#4f46e5',
	booking_cancelled: '#f59e0b',
	payment_success: '#10b981',
	payment_failed: '#ef4444',
	system_alert: '#f97316',
	promotion: '#8b5cf6',
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ item, onMarkRead, timeLabel }) => {
	const handleClick = () => {
		if (!item.isRead) onMarkRead(item.id);
	};

	return (
		<Box className={`${styles.notificationItem} ${item.isRead ? '' : styles.unread}`} onClick={handleClick}>
			<Stack direction="row" spacing={2} className={styles.itemContent}>
				<Avatar className={styles.iconAvatar} sx={{ bgcolor: iconColor[item.type] }}>
					{iconMap[item.type]}
				</Avatar>
				<Stack className={styles.itemText} spacing={0.5}>
					<Typography
						variant="subtitle1"
						className={`${styles.itemTitle} ${item.isRead ? '' : styles.titleUnread}`}
						fontWeight={item.isRead ? 600 : 700}
					>
						{item.title}
					</Typography>
					<Typography variant="body2" className={styles.itemMessage}>
						{item.message}
					</Typography>
					<Typography variant="caption" className={styles.itemTime}>
						{timeLabel}
					</Typography>
				</Stack>
				{!item.isRead && <Box className={styles.unreadIndicator} />}
			</Stack>
		</Box>
	);
};
