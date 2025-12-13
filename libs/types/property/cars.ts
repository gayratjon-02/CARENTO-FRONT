import { BrandType, CarLocation, CarStatus, CarType, FuelType, Transmission } from '../../enum/car.enum';
import { Member } from '../member/member';
import { MeLiked, TotalCounter } from './property';

export interface Car {
	_id: string;
	carTitle: string;
	memberId?: string;
	carDescription?: string;
	brandType?: BrandType;
	year?: number;
	fuelType?: FuelType;
	transmission?: Transmission;
	seats?: number;
	doors?: number;
	mileage?: number;
	engine?: string;
	carType?: CarType;
	carStatus?: CarStatus;
	carLocation?: CarLocation;
	carImages?: string[];
	pricePerDay?: number;
	pricePerHour?: number;
	carLikes?: number;
	carViews?: number;
	deletedAt?: Date;
	createdAt?: Date;
	updatedAt?: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface CarsList {
	list: Car[];
	metaCounter: TotalCounter[];
}
