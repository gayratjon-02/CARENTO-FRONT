import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Notification } from './notification.mock';
import { NotificationItem } from './NotificationItem';
import styles from './notification.module.scss';

interface NotificationListProps {
	items: Notification[];
	onMarkRead: (id: string) => void;
	getTimeSince: (iso: string) => string;
}

export const NotificationList: React.FC<NotificationListProps> = ({ items, onMarkRead, getTimeSince }) => {
	if (!items.length) {
		return (
			<Box className={styles.emptyState}>
				<Typography variant="body1" color="text.secondary">
					No notifications
				</Typography>
			</Box>
		);
	}

	return (
		<Box className={styles.listContainer}>
			<Stack className={styles.notificationList} spacing={0}>
				{items.map((item) => (
					<NotificationItem key={item.id} item={item} onMarkRead={onMarkRead} timeLabel={getTimeSince(item.createdAt)} />
				))}
			</Stack>
		</Box>
	);
};
