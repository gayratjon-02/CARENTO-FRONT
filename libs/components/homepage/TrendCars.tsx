import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { CarsInquiry } from '../../types/property/property.input';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CARS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { Car } from '../../types/property/cars';
import { LIKE_TARGET_CAR } from '../../../apollo/user/mutation';
import TrendCarCard from './TrendCarCard';

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

	const { refetch: getCarsRefetch } = useQuery(GET_CARS, {
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

	const isMobile = device === 'mobile';
	const hasCars = cars && cars.length > 0;

	const renderCarsSwiper = (mobile = false) => (
		<Swiper
			className={'trend-property-swiper'}
			slidesPerView={mobile ? 1.1 : 3}
			spaceBetween={mobile ? 14 : 18}
			centeredSlides={mobile}
			modules={mobile ? [Autoplay] : [Autoplay, Navigation, Pagination]}
			autoplay={{ delay: 4200, disableOnInteraction: false }}
			navigation={
				mobile
					? undefined
					: {
							nextEl: '.swiper-trend-next',
							prevEl: '.swiper-trend-prev',
					  }
			}
			pagination={
				mobile
					? undefined
					: {
							el: '.swiper-trend-pagination',
					  }
			}
			breakpoints={{
				1024: { slidesPerView: 3 },
				900: { slidesPerView: 2.6 },
				768: { slidesPerView: 2.2 },
				640: { slidesPerView: 1.6 },
			}}
		>
			{cars.map((car: Car) => (
				<SwiperSlide key={car._id} className={'trend-property-slide'}>
					<TrendCarCard car={car} likeCarHandler={likeCarHandler} />
				</SwiperSlide>
			))}
		</Swiper>
	);

	if (isMobile) {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Most Searched Vehicles</span>
						<p>The world&apos;s leading car brands</p>
					</Stack>
					<Stack className={'card-box'}>
						{!hasCars ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							renderCarsSwiper(true)
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
							<span>Most Searched Vehicles</span>
							<p>The world&apos;s leading car brands</p>
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
						{!hasCars ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							renderCarsSwiper()
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
