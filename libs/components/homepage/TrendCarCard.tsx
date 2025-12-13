import React, { MouseEvent, useMemo } from 'react';
import { CSSProperties } from 'react';
import { useRouter } from 'next/router';
import { Car } from '../../types/property/cars';
import { REACT_APP_API_URL } from '../../config';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import AirlineSeatReclineNormalOutlinedIcon from '@mui/icons-material/AirlineSeatReclineNormalOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Stack, Button } from '@mui/material';

interface TrendCarCardProps {
	car: Car;
	likeCarHandler: any;
}

const TrendCarCard = ({ car, likeCarHandler }: TrendCarCardProps) => {
	const router = useRouter();
	const hasImage = Array.isArray(car?.carImages) && car.carImages.length > 0;
	const carImage = hasImage ? `${REACT_APP_API_URL}/${car.carImages[0]}` : undefined;
	const imageStyle: CSSProperties | undefined = carImage ? { backgroundImage: `url(${carImage})` } : undefined;
	const carId = car?._id ? String(car._id) : '';

	// Rating calculation based on carLikes from backend
	const ratingValue = useMemo(() => {
		const base = 4.6;
		const bonus = ((car?.carLikes || 0) % 30) / 100;
		return (base + bonus).toFixed(2);
	}, [car?.carLikes]);

	// Reviews count from backend carLikes
	const reviewsCount = car?.carLikes ?? 0;

	// Format location from enum (e.g., "BUSAN" -> "Busan", "SEOUL" -> "Seoul")
	const locationLabel = useMemo(() => {
		if (!car?.carLocation || typeof car.carLocation !== 'string') return 'South Korea';
		return car.carLocation
			.toLowerCase()
			.split('_')
			.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}, [car?.carLocation]);

	// Format enum values for display (e.g., "AUTOMATIC" -> "Automatic")
	const formatEnumValue = (value?: string): string => {
		if (!value) return '--';
		return value
			.toLowerCase()
			.split('_')
			.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	// Format numbers with locale support
	const formatNumber = (value?: number, suffix = ''): string => {
		if (value === null || value === undefined) return '--';
		return `${value.toLocaleString()}${suffix}`;
	};

	// Price label with currency formatting
	const priceLabel = car?.pricePerDay ? `$${Number(car.pricePerDay).toLocaleString()}` : 'Request price';

	// Brand and year label (e.g., "BMW • 2023")
	const brandYearLabel = useMemo(() => {
		const brand = car?.brandType ? formatEnumValue(car.brandType) : '';
		const year = car?.year ? String(car.year) : '';
		if (brand && year) return `${brand} • ${year}`;
		if (brand) return brand;
		if (year) return year;
		return '';
	}, [car?.brandType, car?.year]);

	const imageClassName = hasImage ? 'trend-car-image' : 'trend-car-image no-image';

	const openDetailPage = () => {
		if (!carId) return;
		router.push({ pathname: '/car/detail', query: { id: carId } });
	};

	const handleBookNow = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		openDetailPage();
	};

	return (
		<Stack className="trend-car-card" onClick={openDetailPage}>
			<Stack className={imageClassName} style={imageStyle}>
				{!hasImage && <span className="placeholder">Image coming soon</span>}
			</Stack>
			<Stack className="trend-car-body">
				<Stack className="rating-pill">
					<StarRoundedIcon fontSize="small" />
					<span className="value">{ratingValue}</span>
					<span className="reviews">({reviewsCount} reviews)</span>
				</Stack>

				<Stack className="car-title">{car?.carTitle || 'Premium Car'}</Stack>
				{brandYearLabel && (
					<Stack className="car-brand-year">
						<span>{brandYearLabel}</span>
					</Stack>
				)}
				<Stack className="car-location">
					<FmdGoodOutlinedIcon fontSize="small" />
					<span>{locationLabel}</span>
				</Stack>

				<Stack className="car-specs">
					<Stack className="spec-item">
						<SpeedOutlinedIcon fontSize="small" />
						<span>{formatNumber(car?.mileage, ' miles')}</span>
					</Stack>
					<Stack className="spec-item">
						<SettingsOutlinedIcon fontSize="small" />
						<span>{formatEnumValue(car?.transmission) || 'Automatic'}</span>
					</Stack>
					<Stack className="spec-item">
						<LocalGasStationOutlinedIcon fontSize="small" />
						<span>{formatEnumValue(car?.fuelType) || 'Fuel'}</span>
					</Stack>
					<Stack className="spec-item">
						<AirlineSeatReclineNormalOutlinedIcon fontSize="small" />
						<span>{formatNumber(car?.seats, ' seats')}</span>
					</Stack>
				</Stack>

				<Stack className="card-footer">
					<Stack className="price-box">
						<span>From</span>
						<strong>{priceLabel}</strong>
					</Stack>
					<Button className="book-btn" type="button" variant="contained" color="success" onClick={handleBookNow}>
						Book Now
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default TrendCarCard;
