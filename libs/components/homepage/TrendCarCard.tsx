import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
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

import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { Stack, Button, IconButton } from '@mui/material';
import { userVar } from 'apollo/store';
import { useReactiveVar } from '@apollo/client';

interface TrendCarCardProps {
	car: Car;
	likeCarHandler: (user: any, id: string) => Promise<void> | void;
}

const TrendCarCard = (props: TrendCarCardProps) => {
	const { car, likeCarHandler } = props;

	const router = useRouter();
	const user = useReactiveVar(userVar);

	const hasImage = Array.isArray(car?.carImages) && car.carImages.length > 0;
	const carImage = hasImage ? `${REACT_APP_API_URL}/${car.carImages[0]}` : undefined;
	const imageStyle: CSSProperties | undefined = carImage ? { backgroundImage: `url(${carImage})` } : undefined;

	const carId = car?._id ? String(car._id) : '';

	const isLikedFromApi = useMemo(() => {
		const anyCar = car as any;

		if (Array.isArray(anyCar?.meLiked) && anyCar.meLiked.length > 0) {
			return Boolean(anyCar.meLiked[0]?.myFavorite);
		}

		return Boolean(anyCar?.isLiked ?? anyCar?.liked ?? anyCar?.isFavorite ?? false);
	}, [car]);

	const [liked, setLiked] = useState<boolean>(isLikedFromApi);

	useEffect(() => {
		setLiked(isLikedFromApi);
	}, [isLikedFromApi]);

	const viewsCount = useMemo(() => {
		const anyCar = car as any;
		const v = anyCar?.carViews ?? anyCar?.views ?? 0;
		return typeof v === 'number' ? v : Number(v) || 0;
	}, [car]);

	const ratingValue = useMemo(() => {
		const base = 4.6;
		const bonus = ((car?.carLikes || 0) % 30) / 100;
		return (base + bonus).toFixed(2);
	}, [car?.carLikes]);

	const reviewsCount = car?.carLikes ?? 0;

	const locationLabel = useMemo(() => {
		if (!car?.carLocation || typeof car.carLocation !== 'string') return 'South Korea';
		return car.carLocation
			.toLowerCase()
			.split('_')
			.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}, [car?.carLocation]);

	const formatEnumValue = (value?: string): string => {
		if (!value) return '--';
		return value
			.toLowerCase()
			.split('_')
			.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	const formatNumber = (value?: number, suffix = ''): string => {
		if (value === null || value === undefined) return '--';
		return `${value.toLocaleString()}${suffix}`;
	};

	const priceLabel = car?.pricePerDay ? `$${Number(car.pricePerDay).toLocaleString()}` : 'Request price';

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

	const handleLikeClick = async (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		e.preventDefault();
		if (!carId) return;

		const prev = liked;
		const next = !prev;
		setLiked(next);

		try {
			await likeCarHandler(user, carId);
		} catch (err) {
			setLiked(prev);
		}
	};

	return (
		<Stack className="trend-car-card" onClick={openDetailPage}>
			<Stack className={imageClassName} style={imageStyle}>
				{!hasImage && <span className="placeholder">Image coming soon</span>}

				<Stack
					className="views-pill"
					direction="row"
					alignItems="center"
					gap={0.7}
					sx={{
						position: 'absolute',
						left: 14,
						bottom: 14,
						px: 1.1,
						py: 0.55,
						borderRadius: '999px',
						bgcolor: 'rgba(255,255,255,0.90)',
						boxShadow: '0 10px 24px rgba(0,0,0,0.16)',
						backdropFilter: 'blur(6px)',
						pointerEvents: 'none',
						zIndex: 2,
					}}
				>
					<VisibilityOutlinedIcon sx={{ fontSize: 18, color: 'rgba(0,0,0,0.55)' }} />
					<span
						style={{
							fontSize: 13,
							fontWeight: 700,
							color: 'rgba(0,0,0,0.72)',
							lineHeight: 1,
						}}
					>
						{Number(viewsCount).toLocaleString()}
					</span>
				</Stack>

				<IconButton
					className={`like-btn ${liked ? 'active' : ''}`}
					onClick={handleLikeClick}
					aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
					aria-pressed={liked}
					sx={{
						position: 'absolute',
						right: 14,
						bottom: 14,
						width: 40,
						height: 40,
						borderRadius: '999px',
						bgcolor: 'rgba(255,255,255,0.90)',
						boxShadow: '0 10px 24px rgba(0,0,0,0.16)',
						backdropFilter: 'blur(6px)',
						zIndex: 3,
						'&:hover': { bgcolor: 'rgba(255,255,255,0.98)' },
					}}
				>
					{liked ? (
						<FavoriteRoundedIcon sx={{ fontSize: 20, color: '#ef4444' }} />
					) : (
						<FavoriteBorderRoundedIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.55)' }} />
					)}
				</IconButton>
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
