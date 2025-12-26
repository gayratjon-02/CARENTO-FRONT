import { BookingStatus, PaymentStatus } from 'libs/enum/booking.enum';
import { TotalCounter } from '../car/cars';

export interface Booking {
	_id: string;
	userId: string;
	agentId: string;
	carId: string;
	startDate: string;
	endDate: string;
	totalPrice: number;
	bookingStatus?: BookingStatus;
	paymentStatus?: PaymentStatus;
	createdAt: string;
	updatedAt?: string;
	deletedAt?: string;
}

export interface BookingsList {
	list: Booking[];
	metaCounter: TotalCounter[];
}
