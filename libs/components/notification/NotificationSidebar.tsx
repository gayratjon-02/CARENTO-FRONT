import React from 'react';
import { Box, Stack, Typography, List, ListItemButton } from '@mui/material';
import {
	Notifications as AllIcon,
	Favorite as LikeIcon,
	Comment as CommentIcon,
	PersonAdd as FollowIcon,
	Message as MessageIcon,
} from '@mui/icons-material';
import { NotificationCategory } from './notification.types';
import styles from './notification.module.scss';

interface NotificationSidebarProps {
	counts: Record<string, number>;
	selected: NotificationCategory;
	onSelect: (category: NotificationCategory) => void;
}

const categories: Array<{ key: NotificationCategory; label: string; icon: React.ReactNode }> = [
	{ key: 'all', label: 'Barchasi', icon: <AllIcon /> },
	{ key: 'like', label: 'Yoqtirishlar', icon: <LikeIcon /> },
	{ key: 'comment', label: 'Izohlar', icon: <CommentIcon /> },
	{ key: 'follow', label: 'Kuzatuvlar', icon: <FollowIcon /> },
	{ key: 'message', label: 'Xabarlar', icon: <MessageIcon /> },
];

export const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
	counts = { all: 0, like: 0, comment: 0, follow: 0, message: 0 },
	selected,
	onSelect,
}) => {
	return (
		<Box className={styles.sidebar}>
			<Typography variant="h6" className={styles.sidebarTitle} fontWeight={700}>
				Filters
			</Typography>

			<List className={styles.categoryList}>
				{categories.map((category) => {
					const count = counts[category.key];
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

