import React from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';
import { DoneAll as DoneAllIcon, DeleteOutline as DeleteIcon } from '@mui/icons-material';
import styles from './notification.module.scss';

interface NotificationHeaderProps {
	onMarkAllRead: () => void;
	onDeleteAll: () => void;
	unreadCount: number;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
	onMarkAllRead,
	onDeleteAll,
	unreadCount,
}) => {
	return (
		<Box className={styles.header}>
			<Typography variant="h5" className={styles.headerTitle} fontWeight={700}>
				Notifications
				{unreadCount > 0 && (
					<Typography component="span" className={styles.unreadBadge}>
						{unreadCount}
					</Typography>
				)}
			</Typography>

			<Stack direction="row" spacing={1.5}>
				<Button
					variant="outlined"
					size="medium"
					startIcon={<DoneAllIcon />}
					onClick={onMarkAllRead}
					className={styles.headerButton}
					disabled={unreadCount === 0}
				>
					Mark all as read
				</Button>
				<Button
					variant="outlined"
					size="medium"
					startIcon={<DeleteIcon />}
					onClick={onDeleteAll}
					className={styles.headerButton}
					color="error"
				>
					Delete all
				</Button>
			</Stack>
		</Box>
	);
};

