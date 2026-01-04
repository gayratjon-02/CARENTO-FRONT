import React from 'react';
import { Box, Stack, Typography, Avatar, IconButton } from '@mui/material';
import {
	Favorite as LikeIcon,
	Comment as CommentIcon,
	PersonAdd as FollowIcon,
	Message as MessageIcon,
	Delete as DeleteIcon,
} from '@mui/icons-material';
import { NotificationType } from '../../enum/notification.enum';
import { BackendNotification } from './notification.types';
import styles from './notification.module.scss';

interface NotificationItemProps {
	notification: BackendNotification;
	onClick: (id: string) => void;
	onDelete: (id: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
	switch (type) {
		case NotificationType.LIKE:
			return <LikeIcon className={styles.icon} />;
		case NotificationType.COMMENT:
			return <CommentIcon className={styles.icon} />;
		case NotificationType.FOLLOW:
			return <FollowIcon className={styles.icon} />;
		case NotificationType.MESSAGE:
			return <MessageIcon className={styles.icon} />;
		case NotificationType.SUBSCRIPTION:
			return <FollowIcon className={styles.icon} />;
		default:
			return <MessageIcon className={styles.icon} />;
	}
};

const getNotificationColor = (type: NotificationType): string => {
	switch (type) {
		case NotificationType.LIKE:
			return '#e91e63';
		case NotificationType.COMMENT:
			return '#2196f3';
		case NotificationType.FOLLOW:
			return '#4caf50';
		case NotificationType.MESSAGE:
			return '#ff9800';
		case NotificationType.SUBSCRIPTION:
			return '#9c27b0';
		default:
			return '#757575';
	}
};

const formatTimeAgo = (date: Date): string => {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return 'Hozir';
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} daqiqa oldin`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} soat oldin`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) {
		return `${diffInDays} kun oldin`;
	}

	const diffInWeeks = Math.floor(diffInDays / 7);
	if (diffInWeeks < 4) {
		return `${diffInWeeks} hafta oldin`;
	}

	const diffInMonths = Math.floor(diffInDays / 30);
	return `${diffInMonths} oy oldin`;
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick, onDelete }) => {
	const iconColor = getNotificationColor(notification.notificationType);
	const isUnread = notification.notificationStatus === 'WAIT';

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDelete(notification._id);
	};

	return (
		<Box
			className={`${styles.notificationItem} ${isUnread ? styles.unread : ''}`}
			onClick={() => onClick(notification._id)}
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
					{getNotificationIcon(notification.notificationType)}
				</Avatar>

				<Stack className={styles.itemText} spacing={0.5} flex={1}>
					<Typography
						variant="subtitle1"
						className={`${styles.itemTitle} ${isUnread ? styles.titleUnread : ''}`}
						fontWeight={isUnread ? 700 : 500}
					>
						{notification.notificationTitle}
					</Typography>
					<Typography variant="body2" className={styles.itemMessage} color="text.secondary">
						{notification.notificationDesc}
					</Typography>
					<Typography variant="caption" className={styles.itemTime} color="text.secondary">
						{formatTimeAgo(new Date(notification.createdAt))}
					</Typography>
				</Stack>

				<Stack direction="row" spacing={1} alignItems="center">
					{isUnread && <Box className={styles.unreadIndicator} />}
					<IconButton
						size="small"
						onClick={handleDelete}
						sx={{ color: 'text.secondary' }}
					>
						<DeleteIcon fontSize="small" />
					</IconButton>
				</Stack>
			</Stack>
		</Box>
	);
};


