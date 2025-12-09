import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Property } from '../../types/property/property';
import { PropertiesInquiry } from '../../types/property/property.input';
import TrendPropertyCard from './TrendPropertyCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CARS, GET_PROPERTIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { Car } from '../../types/property/cars';

interface TrendPropertiesProps {
	initialInput: PropertiesInquiry;
}

const TrendProperties = (props: TrendPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProperties, setTrendProperties] = useState<Property[]>([]);
	const [cars, setCars] = useState<Car[]>([]);
	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendProperties(data?.getProperties?.list);
		},
	});

	// GETCARS

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
	if (getCarsLoading) {
		console.log('Loading...');
		return null;
	}

	if (getCarsError) {
		console.error('Error =>', getCarsError);
		return null;
	}

	console.log('RESULT =>', getCarsData);
	/** HANDLERS **/
	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// execute likeTargetProperty Mutation
			await likeTargetProperty({
				variables: { input: id },
			});

			// execute getPropertiesRefetch
			getPropertiesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR: likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then;
		}
	};

	if (trendProperties) console.log('trendProperties:', trendProperties);
	if (!trendProperties) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Most Searched Vehicles</span>
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
											<TrendPropertyCard car={car} likePropertyHandler={likePropertyHandler} />
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
							<span>Most Searched Vehicles</span>
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
						{trendProperties.length === 0 ? (
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
								{getCarsData.map((car: Car) => {
									return (
										<SwiperSlide key={car._id} className={'trend-property-slide'}>
											<TrendPropertyCard car={car} likePropertyHandler={likePropertyHandler} />
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

TrendProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'carLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProperties;
