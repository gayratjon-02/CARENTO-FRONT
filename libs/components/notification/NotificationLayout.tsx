import React, { useMemo, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { NotificationHeader } from './NotificationHeader';
import { NotificationSidebar, NotificationFilter } from './NotificationSidebar';
import { NotificationList } from './NotificationList';
import { Notification, mockNotifications } from './notification.mock';
import styles from './notification.module.scss';

const getTimeSince = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
};

export const NotificationLayout: React.FC = () => {
	const [selectedType, setSelectedType] = useState<NotificationFilter>('all');
	const [items, setItems] = useState<Notification[]>(mockNotifications);

	const filtered = useMemo(() => {
		if (selectedType === 'all') return items;
		if (selectedType === 'booking') return items.filter((n) => n.type.startsWith('booking'));
		if (selectedType === 'payment') return items.filter((n) => n.type.startsWith('payment'));
		if (selectedType === 'system') return items.filter((n) => n.type === 'system_alert');
		return items.filter((n) => n.type === 'promotion');
	}, [items, selectedType]);

	const counts = useMemo<Record<NotificationFilter, number>>(() => {
		const base: Record<NotificationFilter, number> = {
			all: items.length,
			booking: 0,
			payment: 0,
			system: 0,
			promotion: 0,
		};
		items.forEach((n) => {
			if (n.type.startsWith('booking')) base.booking += 1;
			if (n.type.startsWith('payment')) base.payment += 1;
			if (n.type === 'system_alert') base.system += 1;
			if (n.type === 'promotion') base.promotion += 1;
		});
		return base;
	}, [items]);

	const handleSelectType = (type: NotificationFilter) => setSelectedType(type);

	const handleMarkRead = useCallback((id: string) => {
		setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
	}, []);

	const handleMarkAllRead = () => {
		setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
	};

	const handleDeleteAll = () => {
		setItems([]);
	};

	return (
		<Box className={styles.layout}>
			<Box className={styles.container}>
				<NotificationSidebar counts={counts} selected={selectedType} onSelect={handleSelectType} />
				<Box className={styles.content}>
					<NotificationHeader onMarkAllRead={handleMarkAllRead} onDeleteAll={handleDeleteAll} />
					<NotificationList items={filtered} onMarkRead={handleMarkRead} getTimeSince={getTimeSince} />
				</Box>
			</Box>
		</Box>
	);
};
