import { NotificationType, NotificationStatus, NotificationGroup } from '../../enum/notification.enum';

export interface BackendNotification {
	_id: string;
	notificationType: NotificationType;
	notificationStatus: NotificationStatus;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc: string;
	authorId: string;
	receiverId: string;
	carId?: string;
	articleId?: string;
	createdAt: string;
	updatedAt: string;
	authorData?: {
		_id: string;
		memberNick?: string;
		memberFullName?: string;
		memberImage?: string;
	};
	receiverData?: {
		_id: string;
		memberNick?: string;
		memberFullName?: string;
		memberImage?: string;
	};
	carData?: {
		_id: string;
		carTitle?: string;
		carImages?: string[];
	};
	articleData?: {
		_id: string;
		articleTitle?: string;
		articleImage?: string;
	};
}

export type NotificationCategory = 'all' | 'like' | 'comment' | 'follow' | 'message';

export const getCategoryFromType = (type: NotificationType, group: NotificationGroup): NotificationCategory => {
	if (type === NotificationType.LIKE) return 'like';
	if (type === NotificationType.COMMENT) return 'comment';
	if (type === NotificationType.FOLLOW) return 'follow';
	if (type === NotificationType.MESSAGE) return 'message';
	return 'all';
};

