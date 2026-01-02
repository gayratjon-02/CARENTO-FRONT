import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Car } from 'libs/types/car/cars';
import { useTranslation } from 'next-i18next';

interface TopCarCardProps {
	car: Car;
	likeCarHandler: any;
}

const TopCarCard = (props: TopCarCardProps) => {
	const { car, likeCarHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');

	/** HANDLERS **/
	const pushDetailHandler = async (carId: string) => {
		console.log('carId', carId);
		await router.push({ pathname: '/car/detail', query: { id: carId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages[0]})` }}
					onClick={() => pushDetailHandler(car?._id)}
				>
					<div>${car?.pricePerDay}</div>
				</Box>
				<Box component={'div'} className={'info'}>
						<strong className={'title'} onClick={() => pushDetailHandler(car?._id)}>
						{car?.carTitle}
					</strong>
					<p className={'desc'}>{car?.carDescription}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>
								{car?.seats} {t('seats', { defaultValue: 'seats' })}
							</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>
								{car?.doors} {t('doors', { defaultValue: 'doors' })}
							</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>
								{car?.mileage} {t('km', { defaultValue: 'km' })}
							</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{' '}
							{car?.pricePerDay ? t('Rent', { defaultValue: 'Rent' }) : ''}{' '}
							{car?.pricePerDay && car?.pricePerHour && '/'} {car?.pricePerHour ? t('Hour', { defaultValue: 'Hour' }) : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'} sx={{ color: 'rgba(229, 231, 235, 0.78)' }}>
								<VisibilityOutlinedIcon />
							</IconButton>
							<Typography className="view-cnt">{car?.carViews}</Typography>
							<IconButton
								color={'default'}
								sx={{ color: 'rgba(229, 231, 235, 0.78)' }}
								onClick={() => likeCarHandler(user, car?._id)}
							>
								{car?.meLiked && car?.meLiked[0]?.myFavorite ? (
									<FavoriteRoundedIcon style={{ color: '#ef4444' }} />
								) : (
									<FavoriteBorderRoundedIcon />
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
			<Stack className="top-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages[0]})` }}
					onClick={() => pushDetailHandler(car?._id)}
				>
					<div>${car?.pricePerDay}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(car?._id)}>
						{car?.carTitle}
					</strong>
					<p className={'desc'}>{car?.carDescription}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>
								{car?.seats} {t('seats', { defaultValue: 'seats' })}
							</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>
								{car?.doors} {t('doors', { defaultValue: 'doors' })}
							</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>
								{car?.mileage} {t('km', { defaultValue: 'km' })}
							</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{' '}
							{car?.pricePerDay ? t('Rent', { defaultValue: 'Rent' }) : ''}{' '}
							{car?.pricePerDay && car?.pricePerHour && '/'} {car?.pricePerHour ? t('Hour', { defaultValue: 'Hour' }) : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'} sx={{ color: 'rgba(229, 231, 235, 0.78)' }}>
								<VisibilityOutlinedIcon />
							</IconButton>
							<Typography className="view-cnt">{car?.carViews}</Typography>
							<IconButton
								color={'default'}
								sx={{ color: 'rgba(229, 231, 235, 0.78)' }}
								onClick={() => likeCarHandler(user, car?._id)}
							>
								{car?.meLiked && car?.meLiked[0]?.myFavorite ? (
									<FavoriteRoundedIcon style={{ color: '#ef4444' }} />
								) : (
									<FavoriteBorderRoundedIcon />
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

export default TopCarCard;
