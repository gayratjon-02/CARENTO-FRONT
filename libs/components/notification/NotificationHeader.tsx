import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import styles from './notification.module.scss';

interface NotificationHeaderProps {
	onMarkAllRead: () => void;
	onDeleteAll: () => void;
	unreadCount: number;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({ onMarkAllRead, onDeleteAll, unreadCount }) => {
	const { t } = useTranslation('common');
	return (
		<Box className={styles.header}>
			<Typography variant="h5" className={styles.headerTitle} fontWeight={700}>
				{t('Notifications', { defaultValue: 'Notifications' })}
				{unreadCount > 0 && <span className={styles.unreadBadge}>{unreadCount}</span>}
			</Typography>
			<Stack direction="row" spacing={1.5}>
				<Button
					variant="outlined"
					size="medium"
					onClick={onMarkAllRead}
					className={styles.headerButton}
					disabled={!unreadCount}
				>
					{t('Mark all as read', { defaultValue: 'Mark all as read' })}
				</Button>
				<Button variant="outlined" color="error" size="medium" onClick={onDeleteAll} className={styles.headerButton}>
					{t('Delete all', { defaultValue: 'Delete all' })}
				</Button>
			</Stack>
		</Box>
	);
};
