import React from 'react';
import { Box, Typography, List, ListItemButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PaymentIcon from '@mui/icons-material/Payment';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import styles from './notification.module.scss';

export type NotificationFilter = 'all' | 'booking' | 'payment' | 'system' | 'promotion';

export interface NotificationSidebarProps {
	counts: Record<NotificationFilter, number>;
	selected: NotificationFilter;
	onSelect: (category: NotificationFilter) => void;
}

const categories: Array<{ key: NotificationFilter; label: string; icon: React.ReactNode }> = [
	{ key: 'all', label: 'All', icon: <NotificationsIcon /> },
	{ key: 'booking', label: 'Booking', icon: <BookOnlineIcon /> },
	{ key: 'payment', label: 'Payment', icon: <PaymentIcon /> },
	{ key: 'system', label: 'System', icon: <SystemUpdateIcon /> },
	{ key: 'promotion', label: 'Promotion', icon: <LocalOfferIcon /> },
];

export const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ counts, selected, onSelect }) => {
	return (
		<Box className={styles.sidebar}>
			<Typography variant="h6" className={styles.sidebarTitle} fontWeight={700}>
				Categories
			</Typography>
			<List className={styles.categoryList}>
				{categories.map((category) => {
					const count = counts[category.key] ?? 0;
					const isActive = selected === category.key;

					return (
						<ListItemButton
							key={category.key}
							className={`${styles.categoryItem} ${isActive ? styles.categoryActive : ''}`}
							onClick={() => onSelect(category.key)}
						>
							<Box className={styles.categoryIcon}>{category.icon}</Box>
							<Typography variant="body1" className={styles.categoryLabel} fontWeight={isActive ? 600 : 400}>
								{category.label}
							</Typography>
							{count > 0 && <Box className={styles.categoryBadge}>{count > 99 ? '99+' : count}</Box>}
						</ListItemButton>
					);
				})}
			</List>
		</Box>
	);
};
