import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Property } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Car } from '../../types/property/cars';

interface TrendPropertyCardProps {
	car: Car;
	likePropertyHandler: any;
}

const TrendPropertyCard = (props: TrendPropertyCardProps) => {
	const { car, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (carId: string) => {
		console.log('carId', carId);
		await router.push({ pathname: '/car/detail', query: { id: carId } });
	};
	if (device === 'mobile') {
		return (
			<Stack className="trend-card-box" key={car._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages[0]})` }}
					onClick={() => pushDetailHandler(car?._id)}
				>
					<div>${car.pricePerDay}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(car?._id)}>
						{car.carTitle}
					</strong>
					<p className={'desc'}>{car.carDescription ?? 'no description'}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{car.seats} seats</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{car.doors} doors</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{car.mileage} km</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{car.pricePerDay ? 'Daily' : ''} {car.pricePerDay && car.pricePerHour && '/'}{' '}
							{car.pricePerHour ? 'Hourly' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{car?.carViews}</Typography>
							<IconButton color={'default'} onClick={() => likePropertyHandler(user, car?._id)}>
								{car?.meLiked && car?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{car?.carLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="trend-card-box" key={car._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages[0]})` }}
					onClick={() => pushDetailHandler(car?._id)}
				>
					<div>${car.pricePerDay}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(car?._id)}>
						{car.carTitle}
					</strong>
					<p className={'desc'}>{car.carDescription ?? 'no description'}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{car.seats} seats</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{car.doors} doors</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{car.mileage} km</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{car.pricePerDay ? 'Daily' : ''} {car.pricePerDay && car.pricePerHour && '/'}{' '}
							{car.pricePerHour ? 'Hourly' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{car?.carViews}</Typography>
							<IconButton color={'default'} onClick={() => likePropertyHandler(user, car?._id)}>
								{car?.meLiked && car?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{car?.carLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default TrendPropertyCard;
