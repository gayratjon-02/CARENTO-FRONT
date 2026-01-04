import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Notification } from './notification.mock';
import { NotificationItem } from './NotificationItem';
import styles from './notification.module.scss';

interface NotificationListProps {
	notifications: Notification[];
	onNotificationClick: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ notifications, onNotificationClick }) => {
	if (notifications.length === 0) {
		return (
			<Box className={styles.emptyState}>
				<Typography variant="body1" color="text.secondary">
					No notifications found
				</Typography>
			</Box>
		);
	}

	return (
		<Stack className={styles.notificationList} spacing={0}>
			{notifications.map((notification) => (
				<NotificationItem
					key={notification.id}
					notification={notification}
					onClick={onNotificationClick}
				/>
			))}
		</Stack>
	);
};

