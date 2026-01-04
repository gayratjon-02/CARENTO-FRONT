import React, { useMemo, useState, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import { NotificationHeader } from './NotificationHeader';
import { NotificationSidebar } from './NotificationSidebar';
import { NotificationList } from './NotificationList';
import { Notification, mockNotifications, NotificationType } from './notification.mock';
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
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');
  const [items, setItems] = useState<Notification[]>(mockNotifications);

  const filtered = useMemo(() => {
    if (selectedType === 'all') return items;
    return items.filter((n) => n.type === selectedType);
  }, [items, selectedType]);

  const counts = useMemo(() => {
    const base: Record<string, number> = { all: items.length };
    items.forEach((n) => {
      base[n.type] = (base[n.type] || 0) + 1;
    });
    return base;
  }, [items]);

  const handleSelectType = (type: NotificationType | 'all') => setSelectedType(type);

  const handleMarkRead = useCallback(
    (id: string) => {
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    },
    [setItems],
  );

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDeleteAll = () => {
    setItems([]);
  };

  return (
    <Box className={styles.notificationPage}>
      <Paper className={styles.container} elevation={0}>
        <Box className={styles.sidebar}>
          <NotificationSidebar counts={counts} selected={selectedType} onSelect={handleSelectType} />
        </Box>
        <Box className={styles.content}>
          <NotificationHeader onMarkAllRead={handleMarkAllRead} onDeleteAll={handleDeleteAll} />
          <NotificationList items={filtered} onMarkRead={handleMarkRead} getTimeSince={getTimeSince} />
        </Box>
      </Paper>
    </Box>
  );
};
