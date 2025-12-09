import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';
import { Direction } from '../../enums/common.enum';
import { BrandType, CarType, FuelType, CarLocation, Transmission } from '../../enum/car.enum';

export interface PropertyInput {
	propertyType: PropertyType;
	propertyLocation: PropertyLocation;
	propertyAddress: string;
	propertyTitle: string;
	propertyPrice: number;
	propertySquare: number;
	propertyBeds: number;
	propertyRooms: number;
	propertyImages: string[];
	propertyDesc?: string;
	propertyBarter?: boolean;
	propertyRent?: boolean;
	memberId?: string;
	constructedAt?: Date;
}

interface PISearch {
	memberId?: string;
	locationList?: PropertyLocation[];
	typeList?: PropertyType[];
	roomsList?: Number[];
	options?: string[];
	bedsList?: Number[];
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
	squaresRange?: Range;
	text?: string;
}

export interface PropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

export interface CarsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: CSearch;
}
interface CSearch {
	carLocation?: CarLocation[];
	carType?: CarType[];
	brandType?: BrandType[];
	fuelType?: FuelType[];
	transmission?: Transmission[];
	seats?: number[];
	year?: number[];
}

interface APISearch {
	propertyStatus?: PropertyStatus;
}

export interface AgentPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	propertyStatus?: PropertyStatus;
	propertyLocationList?: PropertyLocation[];
}

export interface AllPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}
