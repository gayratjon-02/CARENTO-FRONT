import React from 'react';
import { Box, Typography, List, ListItemButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MessageIcon from '@mui/icons-material/Message';
import { useTranslation } from 'next-i18next';
import styles from './notification.module.scss';
import { NotificationCategory } from './notification.types';

export interface NotificationSidebarProps {
	counts: Record<NotificationCategory, number>;
	selected: NotificationCategory;
	onSelect: (category: NotificationCategory) => void;

	// optional UX/i18n
	headerImageSrc?: string;
	headerImageAlt?: string;
}

const categories: Array<{ key: NotificationCategory; label: string; icon: React.ReactNode }> = [
	{ key: 'all', label: 'All', icon: <NotificationsIcon /> },
	{ key: 'like', label: 'Likes', icon: <FavoriteIcon /> },
	{ key: 'comment', label: 'Comments', icon: <CommentIcon /> },
	{ key: 'follow', label: 'Follows', icon: <PersonAddIcon /> },
	{ key: 'message', label: 'Messages', icon: <MessageIcon /> },
];

export const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
	counts,
	selected,
	onSelect,
	headerImageSrc,
	headerImageAlt,
}) => {
	const { t } = useTranslation('common');
	const altText = headerImageAlt ?? t('Notifications', { defaultValue: 'Notifications' });

	return (
		<Box className={styles.sidebar}>
			{headerImageSrc ? (
				<Box className={styles.sidebarHeaderImageWrap}>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src={headerImageSrc} alt={altText} className={styles.sidebarHeaderImage} />
				</Box>
			) : null}

			<Typography variant="h6" className={styles.sidebarTitle} fontWeight={700}>
				{t('Categories', { defaultValue: 'Categories' })}
			</Typography>

			<List className={styles.categoryList}>
				{categories.map((category) => {
					const count = counts[category.key] ?? 0;
					const isActive = selected === category.key;
					const label = t(category.label, { defaultValue: category.label });

					return (
						<ListItemButton
							key={category.key}
							className={`${styles.categoryItem} ${isActive ? styles.categoryActive : ''}`}
							onClick={() => onSelect(category.key)}
						>
							<Box className={styles.categoryIcon}>{category.icon}</Box>
							<Typography variant="body1" className={styles.categoryLabel} fontWeight={isActive ? 600 : 400}>
								{label}
							</Typography>
							{count > 0 && <Box className={styles.categoryBadge}>{count > 99 ? '99+' : count}</Box>}
						</ListItemButton>
					);
				})}
			</List>
		</Box>
	);
};
