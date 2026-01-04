import React from 'react';
import { Box, Stack, Typography, Avatar } from '@mui/material';
import {
	Event as EventIcon,
	Cancel as CancelIcon,
	CheckCircle as CheckCircleIcon,
	Error as ErrorIcon,
	Warning as WarningIcon,
	LocalOffer as PromotionIcon,
} from '@mui/icons-material';
import { Notification, NotificationType } from './notification.mock';
import styles from './notification.module.scss';

interface NotificationItemProps {
	notification: Notification;
	onClick: (id: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
	switch (type) {
		case 'booking_created':
			return <EventIcon className={styles.icon} />;
		case 'booking_cancelled':
			return <CancelIcon className={styles.icon} />;
		case 'payment_success':
			return <CheckCircleIcon className={styles.icon} />;
		case 'payment_failed':
			return <ErrorIcon className={styles.icon} />;
		case 'system_alert':
			return <WarningIcon className={styles.icon} />;
		case 'promotion':
			return <PromotionIcon className={styles.icon} />;
		default:
			return <EventIcon className={styles.icon} />;
	}
};

const getNotificationColor = (type: NotificationType): string => {
	switch (type) {
		case 'booking_created':
			return '#4caf50';
		case 'booking_cancelled':
			return '#f44336';
		case 'payment_success':
			return '#2196f3';
		case 'payment_failed':
			return '#ff9800';
		case 'system_alert':
			return '#9c27b0';
		case 'promotion':
			return '#ff5722';
		default:
			return '#757575';
	}
};

const formatTimeAgo = (date: Date): string => {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return 'Just now';
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) {
		return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
	}

	const diffInWeeks = Math.floor(diffInDays / 7);
	if (diffInWeeks < 4) {
		return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
	}

	const diffInMonths = Math.floor(diffInDays / 30);
	return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
	const iconColor = getNotificationColor(notification.type);
	const isUnread = !notification.isRead;

	return (
		<Box
			className={`${styles.notificationItem} ${isUnread ? styles.unread : ''}`}
			onClick={() => onClick(notification.id)}
		>
			<Stack direction="row" spacing={2} className={styles.itemContent}>
				<Avatar
					className={styles.iconAvatar}
					sx={{
						bgcolor: iconColor,
						width: 48,
						height: 48,
					}}
				>
					{getNotificationIcon(notification.type)}
				</Avatar>

				<Stack className={styles.itemText} spacing={0.5} flex={1}>
					<Typography
						variant="subtitle1"
						className={`${styles.itemTitle} ${isUnread ? styles.titleUnread : ''}`}
						fontWeight={isUnread ? 700 : 500}
					>
						{notification.title}
					</Typography>
					<Typography variant="body2" className={styles.itemMessage} color="text.secondary">
						{notification.message}
					</Typography>
					<Typography variant="caption" className={styles.itemTime} color="text.secondary">
						{formatTimeAgo(notification.createdAt)}
					</Typography>
				</Stack>

				{isUnread && <Box className={styles.unreadIndicator} />}
			</Stack>
		</Box>
	);
};

