import React, { useMemo, useState, useCallback } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { NotificationHeader } from './NotificationHeader';
import { NotificationSidebar } from './NotificationSidebar';
import { NotificationList } from './NotificationList';
import { GetNotifications } from '../../../apollo/user/query';
import { DELETE_NOTIFICATION, READ_ALL_NOTIFICATIONS, READ_NOTIFICATION } from '../../../apollo/user/mutation';
import { BackendNotification, NotificationCategory, getCategoryFromType } from './notification.types';
import { NotificationStatus } from '../../enum/notification.enum';
import styles from './notification.module.scss';

export const NotificationLayout: React.FC = () => {
	const { t } = useTranslation('common');
	const [selectedType, setSelectedType] = useState<NotificationCategory>('all');
	const notificationQueryVariables = useMemo(() => ({ input: {} }), []);

	const { data, loading } = useQuery(GetNotifications, {
		fetchPolicy: 'network-only',
		variables: notificationQueryVariables,
		notifyOnNetworkStatusChange: true,
	});

	const [readNotification] = useMutation(READ_NOTIFICATION, {
		refetchQueries: [{ query: GetNotifications, variables: notificationQueryVariables }],
	});
	const [readAllNotifications] = useMutation(READ_ALL_NOTIFICATIONS, {
		refetchQueries: [{ query: GetNotifications, variables: notificationQueryVariables }],
	});
	const [deleteNotification] = useMutation(DELETE_NOTIFICATION, {
		refetchQueries: [{ query: GetNotifications, variables: notificationQueryVariables }],
	});

	const items = useMemo<BackendNotification[]>(() => data?.getNotifications?.list ?? [], [data]);

	const getTimeSince = useCallback(
		(iso: string) => {
			if (!iso) return t('Just now', { defaultValue: 'Just now' });
			const created = new Date(iso);
			if (Number.isNaN(created.getTime())) return t('Just now', { defaultValue: 'Just now' });

			const diff = Date.now() - created.getTime();
			const mins = Math.floor(diff / 60000);
			const hrs = Math.floor(mins / 60);
			const days = Math.floor(hrs / 24);

			const pluralize = (value: number, unit: string) => `${value} ${unit}${value === 1 ? '' : 's'} ago`;

			let relative = t('Just now', { defaultValue: 'Just now' });
			if (mins >= 1 && mins < 60) {
				relative = pluralize(mins, 'minute');
			} else if (hrs >= 1 && hrs < 24) {
				relative = pluralize(hrs, 'hour');
			} else if (days >= 1) {
				relative = pluralize(days, 'day');
			}

			const exact = new Intl.DateTimeFormat(undefined, {
				year: 'numeric',
				month: 'short',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			}).format(created);

			return `${relative} • ${exact}`;
		},
		[t],
	);

	const filtered = useMemo(() => {
		if (selectedType === 'all') return items;
		return items.filter((n) => getCategoryFromType(n.notificationType, n.notificationGroup) === selectedType);
	}, [items, selectedType]);

	const counts = useMemo<Record<NotificationCategory, number>>(() => {
		const base: Record<NotificationCategory, number> = {
			all: 0,
			like: 0,
			comment: 0,
			follow: 0,
			message: 0,
		};
		items.forEach((n) => {
			if (n.notificationStatus !== NotificationStatus.WAIT) return;
			base.all += 1;
			const category = getCategoryFromType(n.notificationType, n.notificationGroup);
			if (category !== 'all') base[category] += 1;
		});
		return base;
	}, [items]);

	const unreadCount = useMemo(
		() => items.filter((n) => n.notificationStatus === NotificationStatus.WAIT).length,
		[items],
	);

	const handleSelectType = (type: NotificationCategory) => setSelectedType(type);

	const handleMarkRead = useCallback(
		async (id: string) => {
			await readNotification({ variables: { id } });
		},
		[readNotification],
	);

	const handleMarkAllRead = async () => {
		if (!unreadCount) return;
		await readAllNotifications();
	};

	const handleDeleteAll = async () => {
		if (!items.length) return;
		await Promise.all(items.map((n) => deleteNotification({ variables: { id: n._id } })));
	};

	return (
		<Box className={styles.layout}>
			<Box className={styles.container}>
				<NotificationSidebar
					counts={counts}
					selected={selectedType}
					onSelect={handleSelectType}
				/>
				<Box className={styles.content}>
					<NotificationHeader onMarkAllRead={handleMarkAllRead} onDeleteAll={handleDeleteAll} unreadCount={unreadCount} />
					{loading ? (
						<Box className={styles.loadingState}>
							<CircularProgress />
						</Box>
					) : (
						<NotificationList items={filtered} onMarkRead={handleMarkRead} getTimeSince={getTimeSince} />
					)}
				</Box>
			</Box>
		</Box>
	);
};
