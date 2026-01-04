import React, { useMemo } from 'react';
import { Box, Stack, Typography, Avatar, IconButton, Chip } from '@mui/material';
import {
	Favorite as LikeIcon,
	Comment as CommentIcon,
	PersonAdd as FollowIcon,
	Message as MessageIcon,
	Delete as DeleteIcon,
	DirectionsCar as CarIcon,
	Article as ArticleIcon,
} from '@mui/icons-material';
import { NotificationType, NotificationGroup } from '../../enum/notification.enum';
import { BackendNotification } from './notification.types';
import { REACT_APP_API_URL } from '../../config';
import styles from './notification.module.scss';

interface NotificationItemProps {
	notification: BackendNotification;
	onClick: (id: string) => void;
	onDelete: (id: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
	switch (type) {
		case NotificationType.LIKE:
			return <LikeIcon className={styles.icon} />;
		case NotificationType.COMMENT:
			return <CommentIcon className={styles.icon} />;
		case NotificationType.FOLLOW:
			return <FollowIcon className={styles.icon} />;
		case NotificationType.MESSAGE:
			return <MessageIcon className={styles.icon} />;
		case NotificationType.SUBSCRIPTION:
			return <FollowIcon className={styles.icon} />;
		default:
			return <MessageIcon className={styles.icon} />;
	}
};

const getNotificationColor = (type: NotificationType): string => {
	switch (type) {
		case NotificationType.LIKE:
			return '#e91e63';
		case NotificationType.COMMENT:
			return '#2196f3';
		case NotificationType.FOLLOW:
			return '#4caf50';
		case NotificationType.MESSAGE:
			return '#ff9800';
		case NotificationType.SUBSCRIPTION:
			return '#9c27b0';
		default:
			return '#757575';
	}
};

const formatTimeAgo = (date: Date): string => {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return 'Hozir';
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} daqiqa oldin`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} soat oldin`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) {
		return `${diffInDays} kun oldin`;
	}

	const diffInWeeks = Math.floor(diffInDays / 7);
	if (diffInWeeks < 4) {
		return `${diffInWeeks} hafta oldin`;
	}

	const diffInMonths = Math.floor(diffInDays / 30);
	return `${diffInMonths} oy oldin`;
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick, onDelete }) => {
	const iconColor = getNotificationColor(notification.notificationType);
	const isUnread = notification.notificationStatus === 'WAIT';

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDelete(notification._id);
	};

	// Author ma'lumotlari
	const authorImage = useMemo(() => {
		if (!notification.authorData?.memberImage) return '/img/profile/defaultUser.svg';
		const imagePath = notification.authorData.memberImage;
		if (/^https?:\/\//i.test(imagePath)) return imagePath;
		return `${REACT_APP_API_URL}/${imagePath}`;
	}, [notification.authorData?.memberImage]);

	const authorName = useMemo(() => {
		return notification.authorData?.memberNick || notification.authorData?.memberFullName || 'Foydalanuvchi';
	}, [notification.authorData]);

	// Qaysi narsa haqida ekanligi
	const relatedItem = useMemo(() => {
		if (notification.notificationGroup === NotificationGroup.CAR && notification.carData) {
			return {
				type: 'car',
				title: notification.carData.carTitle || 'Mashina',
				image: notification.carData.carImages?.[0] 
					? `${REACT_APP_API_URL}/${notification.carData.carImages[0]}`
					: null,
			};
		}
		if (notification.notificationGroup === NotificationGroup.ARTICLE && notification.articleData) {
			return {
				type: 'article',
				title: notification.articleData.articleTitle || 'Maqola',
				image: notification.articleData.articleImage
					? `${REACT_APP_API_URL}/${notification.articleData.articleImage}`
					: null,
			};
		}
		return null;
	}, [notification.notificationGroup, notification.carData, notification.articleData]);

	// Notification type label
	const getActionLabel = () => {
		switch (notification.notificationType) {
			case NotificationType.LIKE:
				return 'yoqtirdi';
			case NotificationType.COMMENT:
				return 'izoh qoldirdi';
			case NotificationType.FOLLOW:
				return 'kuzatishni boshladi';
			case NotificationType.MESSAGE:
				return 'xabar yubordi';
			case NotificationType.SUBSCRIPTION:
				return 'obuna bo\'ldi';
			default:
				return '';
		}
	};

	return (
		<Box
			className={`${styles.notificationItem} ${isUnread ? styles.unread : ''}`}
			onClick={() => onClick(notification._id)}
			sx={{ cursor: 'pointer' }}
		>
			<Stack direction="row" spacing={2} className={styles.itemContent}>
				{/* Author rasm */}
				<Avatar
					sx={{
						width: 56,
						height: 56,
						border: isUnread ? '2px solid' : 'none',
						borderColor: isUnread ? iconColor : 'transparent',
						flexShrink: 0,
					}}
					src={authorImage}
					alt={authorName}
					imgProps={{
						onError: (e: any) => {
							e.target.src = '/img/profile/defaultUser.svg';
						},
					}}
				>
					{authorName.charAt(0).toUpperCase()}
				</Avatar>

				<Stack className={styles.itemText} spacing={0.5} flex={1} minWidth={0}>
					{/* Author va action */}
					<Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
						<Typography
							variant="subtitle1"
							className={`${styles.itemTitle} ${isUnread ? styles.titleUnread : ''}`}
							fontWeight={isUnread ? 700 : 600}
							sx={{ fontSize: '0.95rem', fontWeight: isUnread ? 700 : 600 }}
						>
							{authorName}
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ fontSize: '0.875rem', fontWeight: 400 }}
						>
							{getActionLabel()}
						</Typography>
					</Stack>

					{/* Notification title */}
					<Typography
						variant="body2"
						className={styles.itemMessage}
						color="text.secondary"
						sx={{ fontSize: '0.875rem', mt: 0.5 }}
					>
						{notification.notificationTitle}
					</Typography>

					{/* Related item (car yoki article) */}
					{relatedItem && (
						<Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
							{relatedItem.image && (
								<Box
									sx={{
										width: 40,
										height: 40,
										borderRadius: 1,
										overflow: 'hidden',
										bgcolor: 'grey.200',
									}}
								>
									<img
										src={relatedItem.image}
										alt={relatedItem.title}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
										}}
									/>
								</Box>
							)}
							<Chip
								icon={relatedItem.type === 'car' ? <CarIcon /> : <ArticleIcon />}
								label={relatedItem.title}
								size="small"
								variant="outlined"
								sx={{
									height: 24,
									fontSize: '0.75rem',
									'& .MuiChip-icon': {
										fontSize: '0.875rem',
									},
								}}
							/>
						</Stack>
					)}

					{/* Time */}
					<Typography variant="caption" className={styles.itemTime} color="text.secondary" sx={{ mt: 0.5 }}>
						{formatTimeAgo(new Date(notification.createdAt))}
					</Typography>
				</Stack>

				<Stack direction="row" spacing={1} alignItems="center">
					{/* Notification type icon */}
					<Avatar
						sx={{
							bgcolor: iconColor,
							width: 32,
							height: 32,
						}}
					>
						{getNotificationIcon(notification.notificationType)}
					</Avatar>
					{isUnread && <Box className={styles.unreadIndicator} />}
					<IconButton
						size="small"
						onClick={handleDelete}
						sx={{ color: 'text.secondary' }}
					>
						<DeleteIcon fontSize="small" />
					</IconButton>
				</Stack>
			</Stack>
		</Box>
	);
};


