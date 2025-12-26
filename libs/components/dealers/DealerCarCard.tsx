import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { Box, ButtonBase, Stack } from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import SpeedIcon from '@mui/icons-material/Speed';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from 'apollo/store';
import { Car } from 'libs/types/car/cars';

interface DealerCarCardProps {
	car: Car;
	likeCarHandler: (user: any, id: string) => Promise<void> | void;
}

const DealerCarCard = (props: DealerCarCardProps) => {
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

	return (
		<Stack className="dealer-car-card" onClick={openCarDetail} role="button">
			<Box className={`dealer-car-card__img ${hasImage ? '' : 'no-image'}`} style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}>
				<Box className="dealer-car-card__price">
					<span>From</span>
					<strong>${car?.pricePerDay ?? 0}</strong>
					<small>/day</small>
				</Box>
			</Box>

			<Box className="dealer-car-card__body">
				<Box className="dealer-car-card__titleRow">
					<strong className="dealer-car-card__title">{car?.carTitle}</strong>
					<Box className="dealer-car-card__metaPill">{car?.carType ?? 'Car'}</Box>
				</Box>

				<Box className="dealer-car-card__desc">
					{car?.carDescription ? car.carDescription : 'Clean ride, ready for your next trip.'}
				</Box>

				<Box className="dealer-car-card__specs">
					<Box className="spec">
						<EventSeatIcon fontSize="small" />
						<span>{car?.seats ?? 0}</span>
					</Box>
					<Box className="spec">
						<MeetingRoomOutlinedIcon fontSize="small" />
						<span>{car?.doors ?? 0}</span>
					</Box>
					<Box className="spec">
						<SpeedIcon fontSize="small" />
						<span>{Number(car?.mileage ?? 0).toLocaleString()} km</span>
					</Box>
				</Box>

				<Box className="dealer-car-card__footer">
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
		</Stack>
	);
};

export default DealerCarCard;

