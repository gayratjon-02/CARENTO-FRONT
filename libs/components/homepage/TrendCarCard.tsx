import React, { CSSProperties, MouseEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
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

import { Stack, Button, ButtonBase } from '@mui/material';
import { userVar } from 'apollo/store';
import { useReactiveVar } from '@apollo/client';
import { Car } from 'libs/types/car/cars';
import { useTranslation } from 'next-i18next';

interface TrendCarCardProps {
	car: Car;
	likeCarHandler: (user: any, id: string) => Promise<void> | void;
}

const TrendCarCard = (props: TrendCarCardProps) => {
	const { car, likeCarHandler } = props;

	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');

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

	const likesCount = useMemo(() => {
		const anyCar = car as any;
		const v = anyCar?.carLikes ?? anyCar?.likes ?? anyCar?.likeCount ?? 0;
		return typeof v === 'number' ? v : Number(v) || 0;
	}, [car]);

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
		if (!car?.carLocation || typeof car.carLocation !== 'string') return t('South Korea', { defaultValue: 'South Korea' });
		return car.carLocation
			.toLowerCase()
			.split('_')
			.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}, [car?.carLocation]);

	const formatEnumValue = (value?: string): string => {
		if (!value) return '--';
		const formatted = value
			.toLowerCase()
			.split('_')
			.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
		return t(formatted, { defaultValue: formatted });
	};

	const formatNumber = (value?: number, suffixKey = ''): string => {
		if (value === null || value === undefined) return '--';
		const suffix = suffixKey ? ` ${t(suffixKey.trim(), { defaultValue: suffixKey.trim() })}` : '';
		return `${value.toLocaleString()}${suffix}`;
	};

	const priceLabel = car?.pricePerDay
		? `$${Number(car.pricePerDay).toLocaleString()}`
		: t('Request price', { defaultValue: 'Request price' });

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

		// If not authenticated, trigger handler (it will show login modal) and exit without UI toggle
		if (!user?._id) {
			try {
				await likeCarHandler(user, carId);
			} catch (err) {
				// no-op; UI state remains unchanged for unauthenticated users
			}
			return;
		}

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

					<Stack className="trend-stats-bar" direction="row" alignItems="center" justifyContent="space-between">
						<Stack className="trend-stats-left" direction="row" alignItems="center" spacing={0.9}>
							<VisibilityOutlinedIcon className="trend-stats-icon" />
							<span className="trend-stats-count">{Number(viewsCount).toLocaleString()}</span>
						</Stack>

						<ButtonBase
							onClick={handleLikeClick}
							className={`trend-like-btn ${liked ? 'liked' : ''}`}
						>
							{liked ? (
								<FavoriteRoundedIcon className="trend-stats-icon" />
							) : (
								<FavoriteBorderRoundedIcon className="trend-stats-icon" />
							)}
							<span className="trend-stats-count">{Number(likesCount).toLocaleString()}</span>
						</ButtonBase>
					</Stack>
				</Stack>

			<Stack className="trend-car-body">
				<Stack className="rating-pill">
					<StarRoundedIcon fontSize="small" />
					<span className="value">{ratingValue}</span>
					<span className="reviews">
						({reviewsCount} {t('reviews', { defaultValue: 'reviews' })})
					</span>
				</Stack>

				<Stack className="car-title">{car?.carTitle || t('Premium Car', { defaultValue: 'Premium Car' })}</Stack>

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
						<span>{formatNumber(car?.mileage, 'miles')}</span>
					</Stack>
					<Stack className="spec-item">
						<SettingsOutlinedIcon fontSize="small" />
						<span>{formatEnumValue(car?.transmission) || t('Automatic', { defaultValue: 'Automatic' })}</span>
					</Stack>
					<Stack className="spec-item">
						<LocalGasStationOutlinedIcon fontSize="small" />
						<span>{formatEnumValue(car?.fuelType) || t('Fuel', { defaultValue: 'Fuel' })}</span>
					</Stack>
					<Stack className="spec-item">
						<AirlineSeatReclineNormalOutlinedIcon fontSize="small" />
						<span>{formatNumber(car?.seats, 'seats')}</span>
					</Stack>
				</Stack>

				<Stack className="card-footer">
					<Stack className="price-box">
						<span>{t('From', { defaultValue: 'From' })}</span>
						<strong>{priceLabel}</strong>
					</Stack>

					<Button className="book-btn" type="button" variant="contained" color="success" onClick={handleBookNow}>
						{t('Book Now', { defaultValue: 'Book Now' })}
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default TrendCarCard;
