import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { BackendNotification } from './notification.types';
import { NotificationItem } from './NotificationItem';
import styles from './notification.module.scss';

interface NotificationListProps {
	notifications: BackendNotification[];
	onNotificationClick: (id: string) => void;
	onDeleteNotification: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
	notifications = [],
	onNotificationClick,
	onDeleteNotification,
}) => {
	if (!notifications?.length) {
		return (
			<Box className={styles.emptyState}>
				<Typography variant="body1" color="text.secondary">
					Xabarnomalar topilmadi
				</Typography>
			</Box>
		);
	}

	return (
		<Stack className={styles.notificationList} spacing={0}>
			{notifications.map((notification) => (
				<NotificationItem
					key={notification._id}
					notification={notification}
					onClick={onNotificationClick}
					onDelete={onDeleteNotification}
				/>
			))}
		</Stack>
	);
};


