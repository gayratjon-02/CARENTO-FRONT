import React from 'react';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MessageIcon from '@mui/icons-material/Message';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { BackendNotification } from './notification.types';
import { NotificationGroup, NotificationType, NotificationStatus } from '../../enum/notification.enum';
import { REACT_APP_API_URL } from '../../config';
import styles from './notification.module.scss';

interface NotificationItemProps {
	item: BackendNotification;
	onMarkRead: (id: string) => void;
	timeLabel: string;
}

const iconMap: Record<NotificationType, React.ReactNode> = {
	[NotificationType.LIKE]: <FavoriteIcon className={styles.icon} />,
	[NotificationType.COMMENT]: <CommentIcon className={styles.icon} />,
	[NotificationType.FOLLOW]: <PersonAddIcon className={styles.icon} />,
	[NotificationType.MESSAGE]: <MessageIcon className={styles.icon} />,
	[NotificationType.SUBSCRIPTION]: <LocalOfferIcon className={styles.icon} />,
};

const iconColor: Record<NotificationType, string> = {
	[NotificationType.LIKE]: '#ef4444',
	[NotificationType.COMMENT]: '#3b82f6',
	[NotificationType.FOLLOW]: '#10b981',
	[NotificationType.MESSAGE]: '#f59e0b',
	[NotificationType.SUBSCRIPTION]: '#8b5cf6',
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ item, onMarkRead, timeLabel }) => {
	const { t } = useTranslation('common');
	const isUnread = item.notificationStatus === NotificationStatus.WAIT;
	const handleClick = () => {
		if (isUnread) onMarkRead(item._id);
	};

	const authorName =
		item.authorData?.memberFullName || item.authorData?.memberNick || t('Someone', { defaultValue: 'Someone' });

	const actionLabel = (() => {
		switch (item.notificationType) {
			case NotificationType.LIKE:
				return t('liked', { defaultValue: 'liked' });
			case NotificationType.COMMENT:
				return t('commented', { defaultValue: 'commented' });
			case NotificationType.FOLLOW:
				return t('started following you', { defaultValue: 'started following you' });
			case NotificationType.MESSAGE:
				return t('sent you a message', { defaultValue: 'sent you a message' });
			case NotificationType.SUBSCRIPTION:
				return t('subscribed', { defaultValue: 'subscribed' });
			default:
				return '';
		}
	})();

	const relatedTitle =
		item.notificationGroup === NotificationGroup.CAR
			? item.carData?.carTitle
			: item.notificationGroup === NotificationGroup.ARTICLE
			? item.articleData?.articleTitle
			: undefined;

	const description =
		item.notificationDesc || item.notificationTitle || (relatedTitle ? `${t('Related to', { defaultValue: 'Related to' })} ${relatedTitle}` : '');

	const imageSrc = (() => {
		if (item.notificationGroup === NotificationGroup.CAR && item.carData?.carImages?.[0]) {
			return `${REACT_APP_API_URL}/${item.carData.carImages[0]}`;
		}
		if (item.notificationGroup === NotificationGroup.ARTICLE && item.articleData?.articleImage) {
			return `${REACT_APP_API_URL}/${item.articleData.articleImage}`;
		}
		if (item.authorData?.memberImage) {
			return item.authorData.memberImage.startsWith('http')
				? item.authorData.memberImage
				: `${REACT_APP_API_URL}/${item.authorData.memberImage}`;
		}
		return undefined;
	})();

	return (
		<Box className={`${styles.notificationItem} ${isUnread ? styles.unread : ''}`} onClick={handleClick}>
			<Stack direction="row" spacing={2} className={styles.itemContent}>
				<Avatar className={styles.iconAvatar} sx={{ bgcolor: iconColor[item.notificationType] }}>
					{iconMap[item.notificationType]}
				</Avatar>
				<Stack className={styles.itemText} spacing={0.5}>
					<Typography
						variant="subtitle1"
						className={`${styles.itemTitle} ${isUnread ? styles.titleUnread : ''}`}
						fontWeight={isUnread ? 700 : 600}
					>
						{authorName} {actionLabel}
					</Typography>
					<Typography variant="body2" className={styles.itemMessage}>
						{description}
					</Typography>
					<Typography variant="caption" className={styles.itemTime}>
						{timeLabel}
					</Typography>
				</Stack>
				{imageSrc && (
					<Box className={styles.itemThumb}>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={imageSrc} alt={authorName} />
					</Box>
				)}
				{isUnread && <Box className={styles.unreadIndicator} />}
			</Stack>
		</Box>
	);
};
