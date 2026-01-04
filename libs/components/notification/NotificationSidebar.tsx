import React from 'react';
import { Box, Stack, Typography, List, ListItemButton } from '@mui/material';
import {
	Notifications as AllIcon,
	Event as BookingIcon,
	Payment as PaymentIcon,
	Settings as SystemIcon,
	LocalOffer as PromotionIcon,
} from '@mui/icons-material';
import { NotificationCategory } from './notification.mock';
import styles from './notification.module.scss';

interface NotificationSidebarProps {
	activeCategory: NotificationCategory;
	onCategoryChange: (category: NotificationCategory) => void;
	categoryCounts: Record<NotificationCategory, number>;
}

const categories: Array<{ key: NotificationCategory; label: string; icon: React.ReactNode }> = [
	{ key: 'all', label: 'All', icon: <AllIcon /> },
	{ key: 'booking', label: 'Booking', icon: <BookingIcon /> },
	{ key: 'payment', label: 'Payment', icon: <PaymentIcon /> },
	{ key: 'system', label: 'System', icon: <SystemIcon /> },
	{ key: 'promotion', label: 'Promotion', icon: <PromotionIcon /> },
];

export const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
	activeCategory,
	onCategoryChange,
	categoryCounts,
}) => {
	return (
		<Box className={styles.sidebar}>
			<Typography variant="h6" className={styles.sidebarTitle} fontWeight={700}>
				Filters
			</Typography>

			<List className={styles.categoryList}>
				{categories.map((category) => {
					const count = categoryCounts[category.key];
					const isActive = activeCategory === category.key;

					return (
						<ListItemButton
							key={category.key}
							className={`${styles.categoryItem} ${isActive ? styles.categoryActive : ''}`}
							onClick={() => onCategoryChange(category.key)}
						>
							<Box className={styles.categoryIcon}>{category.icon}</Box>
							<Typography variant="body1" className={styles.categoryLabel} fontWeight={isActive ? 600 : 400}>
								{category.label}
							</Typography>
							{count > 0 && (
								<Box className={styles.categoryBadge}>
									{count > 99 ? '99+' : count}
								</Box>
							)}
						</ListItemButton>
					);
				})}
			</List>
		</Box>
	);
};

