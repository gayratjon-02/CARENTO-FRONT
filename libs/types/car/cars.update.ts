import { BrandType, CarLocation, CarStatus, CarType, FuelType, Transmission } from "libs/enum/car.enum";

 
export interface CarsUpdate {
	_id: string;
	carTitle?: string;
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
	deletedAt?: Date;
}
