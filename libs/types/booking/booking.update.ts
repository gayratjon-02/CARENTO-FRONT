import { BookingStatus, PaymentStatus } from 'libs/enum/booking.enum';

export interface BookingUpdate {
	_id: string;
	bookingStatus?: BookingStatus;
	paymentStatus?: PaymentStatus;
}
