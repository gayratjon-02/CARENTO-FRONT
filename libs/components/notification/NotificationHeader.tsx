import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import styles from './notification.module.scss';

interface NotificationHeaderProps {
	onMarkAllRead: () => void;
	onDeleteAll: () => void;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({ onMarkAllRead, onDeleteAll }) => {
	return (
		<Box className={styles.header}>
			<Typography variant="h5" className={styles.headerTitle} fontWeight={700}>
				Notifications
			</Typography>
			<Stack direction="row" spacing={1.5}>
				<Button variant="outlined" size="medium" onClick={onMarkAllRead} className={styles.headerButton}>
					Mark all as read
				</Button>
				<Button variant="outlined" color="error" size="medium" onClick={onDeleteAll} className={styles.headerButton}>
					Delete all
				</Button>
			</Stack>
		</Box>
	);
};
