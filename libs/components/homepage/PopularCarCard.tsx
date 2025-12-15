import React from 'react';
import { Stack, Box } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { Car } from '../../types/property/cars';

interface PopularCarCardProps {
	car: Car;
}

const PopularCarCard = (props: PopularCarCardProps) => {
	const { car } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	/** HANDLERS **/
	const pushDetailHandler = async (carId: string) => {
		await router.push({ pathname: '/car/detail', query: { id: carId } });
	};

	const specList = [
		{ key: 'seats', label: `${car?.seats ?? 0} seats`, icon: <EventSeatIcon fontSize="small" /> },
		{ key: 'doors', label: `${car?.doors ?? 0} doors`, icon: <MeetingRoomOutlinedIcon fontSize="small" /> },
		{ key: 'mileage', label: `${(car?.mileage ?? 0).toLocaleString()} km`, icon: <SpeedIcon fontSize="small" /> },
		{ key: 'fuel', label: car?.fuelType ?? 'Fuel', icon: <LocalGasStationIcon fontSize="small" /> },
	];

	const renderCard = () => (
		<Stack className="popular-card-box" onClick={() => pushDetailHandler(car?._id)}>
			<Box
				component={'div'}
				className={'card-img'}
				style={{
					backgroundImage: car?.carImages?.[0]
						? `url(${REACT_APP_API_URL}/${car.carImages[0]})`
						: 'linear-gradient(120deg, #2c2f3b, #1a1d27)',
				}}
			>
				<Box className={'tag-pill'}>
					<span>{car?.carType || 'Luxury'}</span>
				</Box>
				<Box className={'price'}>
					<span>From</span>
					<strong>${car?.pricePerDay ?? 0}</strong>
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
				<Box className={'bott'}>
					<Box className={'stat'}>
						<span>Views</span>
						<strong>{(car?.carViews ?? 0).toLocaleString()}</strong>
					</Box>
					<Box className={'stat'}>
						<span>Likes</span>
						<strong>{(car?.carLikes ?? 0).toLocaleString()}</strong>
					</Box>
				</Box>
			</Box>
		</Stack>
	);

	return renderCard();
};

export default PopularCarCard;
