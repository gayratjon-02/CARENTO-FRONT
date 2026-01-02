import React, { useEffect, useMemo, useState } from 'react';
import { Stack, Box, Pagination } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CARS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { LIKE_TARGET_CAR } from '../../../apollo/user/mutation';
import TopCarCard from './TopCarCard';
import { useRouter } from 'next/router';
import { CarsInquiry } from 'libs/types/car/cars.input';
import { Car } from 'libs/types/car/cars';
import { useTranslation } from 'next-i18next';

interface TopCarsProps {
	initialInput: CarsInquiry;
}

const PAGE_SIZE = 4;

const TopCars = (props: TopCarsProps) => {
	const { initialInput } = props;
	const router = useRouter();
	const { t } = useTranslation('common');
	const [topCars, setTopCars] = useState<Car[]>([]);
	const [page, setPage] = useState(1);

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
			input: initialInput,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopCars(data?.getCars?.list);
		},
	});
	console.log('getCarsData+___(())', getCarsData);
	console.log('topCars+___(())', topCars);

	useEffect(() => {
		setPage(1);
	}, [topCars.length]);

	const curatedLabel = useMemo(() => {
		if (!topCars.length) return t('Curating new rides for you', { defaultValue: 'Curating new rides for you' });
		return t('{{count}} curated rides, updated hourly', {
			count: topCars.length,
			defaultValue: '{{count}} curated rides, updated hourly',
		});
	}, [topCars, t]);

	const heroStats = useMemo(() => {
		if (!topCars.length) {
			return [
				{ label: t('Avg. daily rate', { defaultValue: 'Avg. daily rate' }), value: '$—' },
				{ label: t('Community likes', { defaultValue: 'Community likes' }), value: '—' },
				{ label: t('Seats this week', { defaultValue: 'Seats this week' }), value: '—' },
			];
		}
		const totalPrice = topCars.reduce((acc, car) => acc + (Number(car?.pricePerDay) || 0), 0);
		const totalLikes = topCars.reduce((acc, car) => acc + (Number(car?.carLikes) || 0), 0);
		const totalSeats = topCars.reduce((acc, car) => acc + (Number(car?.seats) || 0), 0);
		const avgPrice = totalPrice && topCars.length ? Math.round(totalPrice / topCars.length) : 0;

		return [
			{ label: t('Avg. daily rate', { defaultValue: 'Avg. daily rate' }), value: avgPrice ? `$${avgPrice}` : '$—' },
			{ label: t('Community likes', { defaultValue: 'Community likes' }), value: totalLikes.toLocaleString() },
			{ label: t('Seats this week', { defaultValue: 'Seats this week' }), value: `${totalSeats}+` },
		];
	}, [topCars, t]);

	const handleViewAllCars = () => {
		router.push('/car');
	};

	const handleWhyCurated = () => {
		router.push('/car?tab=top');
	};

	const isEmptyState = !getCarsLoading && topCars.length === 0;
	const totalPages = Math.max(1, Math.ceil(topCars.length / PAGE_SIZE));

	const paginatedCars = useMemo(() => {
		if (!topCars.length) return [];
		const start = (page - 1) * PAGE_SIZE;
		return topCars.slice(start, start + PAGE_SIZE);
	}, [page, topCars]);

	const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const showPagination = !isEmptyState && totalPages > 1;
	const showingLabel = useMemo(() => {
		if (!topCars.length) return t('0 cars', { defaultValue: '0 cars' });
		const start = (page - 1) * PAGE_SIZE + 1;
		const end = Math.min(page * PAGE_SIZE, topCars.length);
		return t('{{start}}–{{end}} / {{total}}', {
			start,
			end,
			total: topCars.length,
			defaultValue: '{{start}}–{{end}} / {{total}}',
		});
	}, [page, topCars, t]);

	/** HANDLERS **/

	const likeCarHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// execute likeTargetProperty Mutation
			await likeTargetCar({
				variables: { input: id },
			});

			// execute getCarsRefetch
			getCarsRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR: likeCarHandler', err.message);
			sweetMixinErrorAlert(err.message).then;
		}
	};

	return (
		<Stack className={'top-properties top-cars-section'}>
			<Stack className={'container'}>
				<Box className="top-hero">
					<Box className="top-hero__copy">
						<span className="eyebrow-pill live">
							{t('Garage spotlight', { defaultValue: 'Garage spotlight' })}
						</span>
						<h2 className="hero-title">
							{t('Weekend-worthy rides, curated by real trips', {
								defaultValue: 'Weekend-worthy rides, curated by real trips',
							})}
						</h2>
						<p className="hero-desc">
							{t(
								'We mine community likes, uptime, and host response times to surface rides that feel effortless from key handoff to drop-off.',
								{
									defaultValue:
										'We mine community likes, uptime, and host response times to surface rides that feel effortless from key handoff to drop-off.',
								},
							)}
						</p>
						<Box className="hero-meta">
							<span className="pulse" />
							<span>{curatedLabel}</span>
						</Box>
						<Box className="cta-row">
							<button className="primary-cta" onClick={handleViewAllCars}>
								{t('Browse all cars', { defaultValue: 'Browse all cars' })}
							</button>
							<button className="ghost-cta" onClick={handleWhyCurated}>
								{t('How we rank', { defaultValue: 'How we rank' })}
							</button>
						</Box>
						<Box className="stat-grid">
							{heroStats.map((item) => (
								<Box key={item.label} className="stat-card">
									<span>{item.label}</span>
									<strong>{item.value}</strong>
									<p>{t('Based on live garage data', { defaultValue: 'Based on live garage data' })}</p>
								</Box>
							))}
						</Box>
					</Box>
					<Box className="top-hero__badge">
						<div className="glow" />
						<div className="badge-card">
							<p>{t('Confidence score', { defaultValue: 'Confidence score' })}</p>
							<strong>96%</strong>
							<span>{t('Hosts respond under 15m', { defaultValue: 'Hosts respond under 15m' })}</span>
							<div className="badge-row">
								<span className="dot live" />
								<span>{t('Realtime refresh', { defaultValue: 'Realtime refresh' })}</span>
							</div>
						</div>
						<div className="badge-chip">{curatedLabel}</div>
					</Box>
				</Box>

				<Stack className={'card-box top-grid-shell'}>
					<Box className="grid-shell">
						{getCarsLoading && !topCars.length ? (
							<Box className="empty-top-cars">{t('Loading top cars...', { defaultValue: 'Loading top cars...' })}</Box>
						) : isEmptyState ? (
							<Box className="empty-top-cars">
								{getCarsError?.message ||
									t('We are refreshing the garage. Check back soon!', {
										defaultValue: 'We are refreshing the garage. Check back soon!',
									})}
							</Box>
						) : (
							<Box className="top-grid">
								{paginatedCars.map((car: Car) => (
									<Box className="top-grid-card" key={car?._id}>
										<TopCarCard car={car} likeCarHandler={likeCarHandler} />
									</Box>
								))}
							</Box>
						)}
					</Box>
				</Stack>
				<Box className="grid-footer">
					<div className="grid-badges">
						<span className="pill accent">{curatedLabel}</span>
						<span className="pill">{showingLabel}</span>
					</div>
					<Pagination count={totalPages} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
				</Box>
			</Stack>
		</Stack>
	);
};

TopCars.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'carLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TopCars;
