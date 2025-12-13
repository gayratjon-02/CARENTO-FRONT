import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { CarsInquiry, PropertiesInquiry } from '../../types/property/property.input';
import TrendPropertyCard from './TrendPropertyCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CARS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { Car } from '../../types/property/cars';
import { LIKE_TARGET_CAR } from '../../../apollo/user/mutation';

interface TrendCarsProps {
	initialInput: CarsInquiry;
}

const TrendCars = (props: TrendCarsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [cars, setCars] = useState<Car[]>([]);

	// GETCARS
	/** APOLLO REQUESTS **/
	const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);

	const {
		loading: getCarsLoading,
		data: getCarsData,
		error: getCarsError,
		refetch: getCarsRefetch,
	} = useQuery(GET_CARS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 8,
				search: {},
			},
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setCars(data?.getCars?.list);
		},
	});

	/** HANDLERS **/
	const likeCarHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// execute likeCarHandler Mutation
			await likeTargetCar({
				variables: { input: id },
			});

			// execute getPropertiesRefetch
			getCarsRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR: likeCarHandler', err.message);
			sweetMixinErrorAlert(err.message).then;
		}
	};

	if (TrendCars) console.log('TrendCars:', TrendCars);
	if (!TrendCars) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Most Searched Vehiclessd hwwn</span>
					</Stack>
					<Stack className={'card-box'}>
						{getCarsData.length !== 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-property-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{getCarsData.map((car: Car) => {
									return (
										<SwiperSlide key={car._id} className={'trend-property-slide'}>
											<Stack key={car._id}>
												{car.carTitle} sadsa Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere
												voluptatibus in, aperiam non aliquid dolor illo ipsum perspiciatis reprehenderit? Officiis.
											</Stack>
											<TrendPropertyCard car={car} likePropertyHandler={likeCarHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Most Searched Vehiclesaaaa</span>
							<p>Trend is based on likes</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-trend-prev'} />
								<div className={'swiper-trend-pagination'}></div>
								<EastIcon className={'swiper-trend-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{cars.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-property-swiper'}
								slidesPerView={'auto'}
								spaceBetween={15}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
								}}
							>
								{cars.map((car: Car) => {
									return (
										<SwiperSlide key={car._id} className={'trend-property-slide'}>
											<TrendPropertyCard car={car} likePropertyHandler={likeCarHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendCars.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'carLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendCars;
