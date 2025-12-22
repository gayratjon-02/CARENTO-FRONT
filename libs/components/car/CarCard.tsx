import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { Box, ButtonBase, Stack } from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import { useRouter } from 'next/router';
import { Car } from '../../types/property/cars';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from 'apollo/store';
import { formatEnumValue } from '../../utils';

interface CarCardProps {
	car: Car;
	likeCarHandler: (user: any, id: string) => Promise<void> | void;
}

const CarCard = (props: CarCardProps) => {
	const { car, likeCarHandler } = props;
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const carId = car?._id ? String(car._id) : '';
	const hasImage = Array.isArray(car?.carImages) && car.carImages.length > 0;
	const imageUrl = hasImage ? `${REACT_APP_API_URL}/${car.carImages[0]}` : undefined;

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

	const openCarDetail = async () => {
		if (!carId) return;
		await router.push({ pathname: '/car/detail', query: { id: carId } });
	};

	const onLike = async (e: MouseEvent<HTMLElement>) => {
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

	const brandLabel = car?.brandType ? formatEnumValue(car.brandType) : '';
	const yearLabel = car?.year ? String(car.year) : '';
	const fuelLabel = car?.fuelType ? formatEnumValue(car.fuelType) : '';

	return (
		<Stack className="car-card" onClick={openCarDetail} role="button">
			<Box className={`car-card__media ${hasImage ? '' : 'no-image'}`} style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}>
				<Box className="car-card__tag">
					<span>{car?.carType ? formatEnumValue(car.carType) : 'Car'}</span>
				</Box>
				<Box className="car-card__price">
					<span>From</span>
					<strong>${car?.pricePerDay ?? 0}</strong>
					<small>/day</small>
				</Box>

				<Box className="car-card__stats">
					<Box className="stat">
						<VisibilityOutlinedIcon />
						<span>{Number(viewsCount).toLocaleString()}</span>
					</Box>
					<ButtonBase className={`like ${liked ? 'liked' : ''}`} onClick={onLike} aria-label="Like car">
						{liked ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
						<span>{Number(likesCount).toLocaleString()}</span>
					</ButtonBase>
				</Box>
			</Box>

			<Box className="car-card__body">
				<Box className="car-card__titleRow">
					<strong className="title">{car?.carTitle}</strong>
					{(brandLabel || yearLabel) && (
						<span className="meta">
							{brandLabel}
							{brandLabel && yearLabel ? ' • ' : ''}
							{yearLabel}
						</span>
					)}
				</Box>

				<Box className="car-card__desc">{car?.carDescription ? car.carDescription : 'Clean ride, ready for your next trip.'}</Box>

				<Box className="car-card__specs">
					<Box className="chip">
						<EventSeatIcon fontSize="small" />
						<span>{car?.seats ?? 0}</span>
					</Box>
					<Box className="chip">
						<MeetingRoomOutlinedIcon fontSize="small" />
						<span>{car?.doors ?? 0}</span>
					</Box>
					<Box className="chip">
						<SpeedIcon fontSize="small" />
						<span>{Number(car?.mileage ?? 0).toLocaleString()} km</span>
					</Box>
					{fuelLabel && (
						<Box className="chip">
							<LocalGasStationIcon fontSize="small" />
							<span>{fuelLabel}</span>
						</Box>
					)}
				</Box>
			</Box>
		</Stack>
	);
};

export default CarCard;
