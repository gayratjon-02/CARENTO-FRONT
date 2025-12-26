import { BookingStatus, PaymentStatus } from 'libs/enum/booking.enum';
import { BrandType, CarStatus } from 'libs/enum/car.enum';
import { Direction } from 'libs/enum/common.enum';

export interface BookingInput {
	agentId: string;
	carId: string;
	startDate: Date;
	endDate: Date;
	totalPrice: number;
	bookingStatus?: BookingStatus;
}

export interface BookingInquiry {
	page: number;
	limit: number;
	carStatus?: CarStatus;
	bookingStatus?: BookingStatus;
	paymentStatus?: PaymentStatus;
	brandType?: BrandType;
	sort?: string;
	direction?: Direction;
}
