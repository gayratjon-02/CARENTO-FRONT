import React, { CSSProperties, MouseEvent, useEffect, useMemo, useState } from 'react';
import { Stack, Box, ButtonBase } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { Car } from '../../types/property/cars';
import { userVar } from 'apollo/store';
import { useReactiveVar } from '@apollo/client';

interface PopularCarCardProps {
	car: Car;
	likeCarHandler: (user: any, id: string) => Promise<void> | void;
}

const PopularCarCard = (props: PopularCarCardProps) => {
	const { car, likeCarHandler } = props;
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (carId: string) => {
		await router.push({ pathname: '/car/detail', query: { id: carId } });
	};

	const hasImage = Array.isArray(car?.carImages) && car.carImages.length > 0;
	const carImage = hasImage ? `${REACT_APP_API_URL}/${car.carImages[0]}` : undefined;
	const imageStyle: CSSProperties | undefined = carImage ? { backgroundImage: `url(${carImage})` } : undefined;
	const imageClassName = hasImage ? 'card-img' : 'card-img no-image';
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

	const specList = [
		{ key: 'seats', label: `${car?.seats ?? 0} seats`, icon: <EventSeatIcon fontSize="small" /> },
		{ key: 'doors', label: `${car?.doors ?? 0} doors`, icon: <MeetingRoomOutlinedIcon fontSize="small" /> },
		{ key: 'mileage', label: `${(car?.mileage ?? 0).toLocaleString()} km`, icon: <SpeedIcon fontSize="small" /> },
		{ key: 'fuel', label: car?.fuelType ?? 'Fuel', icon: <LocalGasStationIcon fontSize="small" /> },
	];

	const renderCard = () => (
		<Stack className="popular-card-box" onClick={() => pushDetailHandler(car?._id)}>
			<Box component={'div'} className={imageClassName} style={imageStyle}>
				<Box className={'tag-pill'}>
					<span>{car?.carType || 'Luxury'}</span>
				</Box>
				<Box className={'price'}>
					<span>From</span>
					<strong>${car?.pricePerDay ?? 0}</strong>
				</Box>
				<Box className="popular-stats-bar">
					<Box className="popular-stats-left">
						<VisibilityOutlinedIcon className="popular-stats-icon" />
						<span className="popular-stats-count">{Number(viewsCount).toLocaleString()}</span>
					</Box>
					<ButtonBase onClick={handleLikeClick} className={`popular-like-btn ${liked ? 'liked' : ''}`}>
						{liked ? (
							<FavoriteRoundedIcon className="popular-stats-icon" />
						) : (
							<FavoriteBorderRoundedIcon className="popular-stats-icon" />
						)}
						<span className="popular-stats-count">{Number(likesCount).toLocaleString()}</span>
					</ButtonBase>
				</Box>
			</Box>
			<Box component={'div'} className={'info'}>
				<Box className="title-block">
					<strong className={'title'}>{car?.carTitle}</strong>
					<p className={'desc'}>{car?.carDescription || 'Premium curated ride for every journey.'}</p>
				</Box>
				<Box className={'options'}>
					{specList.map((spec) => (
						<Box key={spec.key} className={'option-chip'}>
							{spec.icon}
							<span>{spec.label}</span>
						</Box>
					))}
				</Box>
			</Box>
		</Stack>
	);

	return renderCard();
};

export default PopularCarCard;
