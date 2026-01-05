import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { BackendNotification } from './notification.types';
import { NotificationItem } from './NotificationItem';
import styles from './notification.module.scss';

interface NotificationListProps {
	items: BackendNotification[];
	onMarkRead: (id: string) => void;
	getTimeSince: (iso: string) => string;
}

export const NotificationList: React.FC<NotificationListProps> = ({ items, onMarkRead, getTimeSince }) => {
	const { t } = useTranslation('common');
	if (!items.length) {
		return (
			<Box className={styles.emptyState}>
				<Typography variant="body1" color="text.secondary">
					{t('No notifications', { defaultValue: 'No notifications' })}
				</Typography>
			</Box>
		);
	}

	return (
		<Box className={styles.listContainer}>
			<Stack className={styles.notificationList} spacing={0}>
				{items.map((item) => (
					<NotificationItem
						key={item._id}
						item={item}
						onMarkRead={onMarkRead}
						timeLabel={getTimeSince(item.createdAt)}
					/>
				))}
			</Stack>
		</Box>
	);
};
