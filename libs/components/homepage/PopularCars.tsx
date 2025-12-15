import React, { useMemo, useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import Link from 'next/link';
import { CarsInquiry } from '../../types/property/property.input';
import { GET_CARS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { Car } from '../../types/property/cars';
import PopularCarCard from './PopularCarCard';
import { Direction } from '../../enums/common.enum';

interface PopularCarsProps {
	initialInput: CarsInquiry;
}

const PopularCars = (props: PopularCarsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularCars, setPopularCars] = useState<Car[]>([]);

	// /** APOLLO REQUESTS **/
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
			setPopularCars(data?.getCars?.list);
		},
	});

	console.log('popularCars++++', popularCars);

	const renderSwiper = (mobile = false) => (
		<Swiper
			className={'popular-property-swiper'}
			slidesPerView={mobile ? 1.1 : 3}
			spaceBetween={mobile ? 16 : 24}
			centeredSlides={mobile}
			modules={mobile ? [Autoplay] : [Autoplay, Navigation, Pagination]}
			autoplay={{ delay: 4200, disableOnInteraction: false }}
			navigation={
				mobile
					? undefined
					: {
							nextEl: '.swiper-popular-next',
							prevEl: '.swiper-popular-prev',
					  }
			}
			pagination={
				mobile
					? undefined
					: {
							el: '.swiper-popular-pagination',
					  }
			}
			breakpoints={{
				1280: { slidesPerView: 3 },
				1024: { slidesPerView: 2.4 },
				900: { slidesPerView: 2 },
				768: { slidesPerView: 1.6 },
				640: { slidesPerView: 1.3 },
			}}
		>
			{popularCars.map((car: Car) => (
				<SwiperSlide key={car._id} className={'popular-car-slide'}>
					<PopularCarCard car={car} />
				</SwiperSlide>
			))}
		</Swiper>
	);

	const header = (
		<Stack className={'info-box'}>
			<Box component={'div'} className={'left'}>
				<span>Popular Cars</span>
				<p>Top-performing rides curated by the community.</p>
			</Box>
			<Box component={'div'} className={'right'}>
				<Link href={'/car'} className={'ghost-link'}>
					<span>See all cars</span>
					<img src="/img/icons/rightup.svg" alt="" />
				</Link>
				<Box className={'pagination-box desktop-only'}>
					<WestIcon className={'swiper-popular-prev'} />
					<div className={'swiper-popular-pagination'}></div>
					<EastIcon className={'swiper-popular-next'} />
				</Box>
			</Box>
		</Stack>
	);

	return (
		<Stack className={'popular-properties'}>
			<Stack className={'container'}>
				{header}
				<Stack className={'card-box'}>
					{popularCars.length === 0 ? (
						<Box component={'div'} className={'empty-list'}>
							<span>Loading cars...</span>
						</Box>
					) : (
						renderSwiper(device === 'mobile')
					)}
				</Stack>
				{device && popularCars.length > 0 && (
					<Stack className={'pagination-box mobile-only'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				)}
			</Stack>
		</Stack>
	);
};

PopularCars.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'carLikes',
		direction: 'DESC',
		search: {},
	},
};

export default PopularCars;
