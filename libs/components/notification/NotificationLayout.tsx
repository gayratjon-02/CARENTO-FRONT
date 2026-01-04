import React, { useState, useMemo } from 'react';
import { Box, Stack, CircularProgress } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { NotificationSidebar } from './NotificationSidebar';
import { NotificationHeader } from './NotificationHeader';
import { NotificationList } from './NotificationList';
import { NotificationCategory, getCategoryFromType } from './notification.types';
import { GET_NOTIFICATIONS } from '../../../apollo/user/query';
import { READ_NOTIFICATION, READ_ALL_NOTIFICATIONS, DELETE_NOTIFICATION } from '../../../apollo/user/mutation';
import { BackendNotification } from './notification.types';
import styles from './notification.module.scss';

export const NotificationLayout: React.FC = () => {
	const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');

	// GraphQL queries and mutations
	const { data, loading, error } = useQuery(GET_NOTIFICATIONS);
	const [readNotification] = useMutation(READ_NOTIFICATION, {
		refetchQueries: [{ query: GET_NOTIFICATIONS }],
	});
	const [readAllNotifications] = useMutation(READ_ALL_NOTIFICATIONS, {
		refetchQueries: [{ query: GET_NOTIFICATIONS }],
	});
	const [deleteNotification] = useMutation(DELETE_NOTIFICATION, {
		refetchQueries: [{ query: GET_NOTIFICATIONS }],
	});

	const notifications: BackendNotification[] = data?.getNotifications || [];

	const filteredNotifications = useMemo(() => {
		if (activeCategory === 'all') {
			return notifications;
		}

		return notifications.filter((notification) => {
			const category = getCategoryFromType(notification.notificationType, notification.notificationGroup);
			return category === activeCategory;
		});
	}, [notifications, activeCategory]);

	const categoryCounts = useMemo(() => {
		const counts: Record<NotificationCategory, number> = {
			all: notifications.filter((n) => n.notificationStatus === 'WAIT').length,
			like: notifications.filter((n) => getCategoryFromType(n.notificationType, n.notificationGroup) === 'like' && n.notificationStatus === 'WAIT').length,
			comment: notifications.filter((n) => getCategoryFromType(n.notificationType, n.notificationGroup) === 'comment' && n.notificationStatus === 'WAIT').length,
			follow: notifications.filter((n) => getCategoryFromType(n.notificationType, n.notificationGroup) === 'follow' && n.notificationStatus === 'WAIT').length,
			message: notifications.filter((n) => getCategoryFromType(n.notificationType, n.notificationGroup) === 'message' && n.notificationStatus === 'WAIT').length,
		};
		return counts;
	}, [notifications]);

	const unreadCount = useMemo(() => {
		return filteredNotifications.filter((n) => n.notificationStatus === 'WAIT').length;
	}, [filteredNotifications]);

	const handleNotificationClick = async (id: string) => {
		try {
			await readNotification({
				variables: { id },
			});
		} catch (error) {
			console.error('Error reading notification:', error);
		}
	};

	const handleMarkAllRead = async () => {
		try {
			await readAllNotifications();
		} catch (error) {
			console.error('Error marking all as read:', error);
		}
	};

	const handleDeleteNotification = async (id: string) => {
		try {
			await deleteNotification({
				variables: { id },
			});
		} catch (error) {
			console.error('Error deleting notification:', error);
		}
	};

	if (loading) {
		return (
			<Box className={styles.layout} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box className={styles.layout} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<p>Xatolik yuz berdi: {error.message}</p>
			</Box>
		);
	}

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
						unreadCount={unreadCount}
					/>

					<Box className={styles.listContainer}>
						<NotificationList
							notifications={filteredNotifications}
							onNotificationClick={handleNotificationClick}
							onDeleteNotification={handleDeleteNotification}
						/>
					</Box>
				</Box>
			</Stack>
		</Box>
	);
};


