import React, { useState, useMemo } from 'react';
import { Box, Stack } from '@mui/material';
import { NotificationSidebar } from './NotificationSidebar';
import { NotificationHeader } from './NotificationHeader';
import { NotificationList } from './NotificationList';
import { mockNotifications, NotificationCategory, getCategoryFromType } from './notification.mock';
import styles from './notification.module.scss';

export const NotificationLayout: React.FC = () => {
	const [notifications, setNotifications] = useState(mockNotifications);
	const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');

	const filteredNotifications = useMemo(() => {
		if (activeCategory === 'all') {
			return notifications;
		}

		return notifications.filter((notification) => {
			const category = getCategoryFromType(notification.type);
			return category === activeCategory;
		});
	}, [notifications, activeCategory]);

	const categoryCounts = useMemo(() => {
		const counts: Record<NotificationCategory, number> = {
			all: notifications.filter((n) => !n.isRead).length,
			booking: notifications.filter((n) => getCategoryFromType(n.type) === 'booking' && !n.isRead).length,
			payment: notifications.filter((n) => getCategoryFromType(n.type) === 'payment' && !n.isRead).length,
			system: notifications.filter((n) => getCategoryFromType(n.type) === 'system' && !n.isRead).length,
			promotion: notifications.filter((n) => getCategoryFromType(n.type) === 'promotion' && !n.isRead).length,
		};
		return counts;
	}, [notifications]);

	const unreadCount = useMemo(() => {
		return filteredNotifications.filter((n) => !n.isRead).length;
	}, [filteredNotifications]);

	const handleNotificationClick = (id: string) => {
		setNotifications((prev) =>
			prev.map((notification) =>
				notification.id === id ? { ...notification, isRead: true } : notification
			)
		);
	};

	const handleMarkAllRead = () => {
		setNotifications((prev) =>
			prev.map((notification) => ({ ...notification, isRead: true }))
		);
	};

	const handleDeleteAll = () => {
		if (window.confirm('Are you sure you want to delete all notifications?')) {
			setNotifications([]);
		}
	};

	return (
		<Box className={styles.layout}>
			<Stack direction="row" className={styles.container}>
				<NotificationSidebar
					activeCategory={activeCategory}
					onCategoryChange={setActiveCategory}
					categoryCounts={categoryCounts}
				/>

				<Box className={styles.content}>
					<NotificationHeader
						onMarkAllRead={handleMarkAllRead}
						onDeleteAll={handleDeleteAll}
						unreadCount={unreadCount}
					/>

					<Box className={styles.listContainer}>
						<NotificationList
							notifications={filteredNotifications}
							onNotificationClick={handleNotificationClick}
						/>
					</Box>
				</Box>
			</Stack>
		</Box>
	);
};

