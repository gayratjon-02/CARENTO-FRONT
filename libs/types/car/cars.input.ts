import { BrandType, CarLocation, CarStatus, CarType, FuelType, Transmission } from 'libs/enum/car.enum';
import { Direction } from '../../enums/common.enum';

export interface CarsInput {
	carTitle: string;
	carDescription?: string;
	memberId?: string;
	brandType: BrandType;
	year: number;
	fuelType: FuelType;
	transmission: Transmission;
	seats: number;
	doors: number;
	mileage: number;
	engine?: string;
	carType: CarType;
	carStatus?: CarStatus;
	carLocation: CarLocation;
	carImages: string[];
	pricePerDay: number;
	pricePerHour: number;
}

export interface PricesRange {
	start: number;
	end: number;
}

export interface CarsSearch {
	memberId?: string;
	carLocation?: CarLocation[];
	carType?: CarType[];
	brandType?: BrandType[];
	fuelType?: FuelType[];
	transmission?: Transmission[];
	seats?: number[];
	year?: number[];
	pricePerDay?: PricesRange;
	pricePerHour?: PricesRange;
	mileage?: PricesRange;
	text?: string;
}

export interface CarsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: CarsSearch;
}

interface AgentCarsSearch {
	carStatus?: CarStatus;
}

export interface AgentCarsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AgentCarsSearch;
}

interface AllCarsSearch {
	carStatus?: CarStatus;
	carLocation?: CarLocation[];
}

export interface AllCarsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: AllCarsSearch;
}

export interface OrdinaryInquiry {
	page: number;
	limit: number;
}
