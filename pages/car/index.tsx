import React, { ChangeEvent, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Drawer, Menu, MenuItem, Pagination, Stack } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import { CarsInquiry } from '../../libs/types/property/property.input';
import { Car } from '../../libs/types/property/cars';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Direction } from '../../libs/enums/common.enum';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_CARS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { LIKE_TARGET_CAR } from '../../apollo/user/mutation';
import { Message } from '../../libs/enums/common.enum';
import { userVar } from 'apollo/store';
import CarCard from '../../libs/components/car/CarCard';
import CarFilter from '../../libs/components/car/CarFilter';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CarList: NextPage = ({ initialInput }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('Recent');

	const [searchFilter, setSearchFilter] = useState<CarsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const searchFilterRef = useRef<CarsInquiry>(searchFilter);

	const [cars, setCars] = useState<Car[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const totalPages = useMemo(() => Math.ceil((total ?? 0) / searchFilter.limit) || 1, [total, searchFilter.limit]);

	/** APOLLO REQUESTS **/
	const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);

	const { refetch: getCarsRefetch } = useQuery(GET_CARS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setCars(data?.getCars?.list ?? []);
			setTotal(data?.getCars?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		searchFilterRef.current = searchFilter;
	}, [searchFilter]);

	useEffect(() => {
		if (!router.isReady) return;
		if (router.query.input) {
			const inputObj = JSON.parse(router.query.input as string);
			setSearchFilter(inputObj);
			setCurrentPage(inputObj?.page ?? 1);
		} else {
			router.replace(`/car?input=${JSON.stringify(searchFilter)}`, `/car?input=${JSON.stringify(searchFilter)}`);
			setCurrentPage(searchFilter.page ?? 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady, router.query.input]);

	/** HANDLERS **/
	const applyAndRefetch = async (next: CarsInquiry) => {
		setSearchFilter(next);
		setCurrentPage(next.page ?? 1);
		await router.replace(`/car?input=${JSON.stringify(next)}`, `/car?input=${JSON.stringify(next)}`, { scroll: false });

		const refetchRes = await getCarsRefetch({ input: next });
		if (refetchRes?.data?.getCars) {
			setCars(refetchRes.data.getCars.list ?? []);
			setTotal(refetchRes.data.getCars.metaCounter?.[0]?.total ?? 0);
		}
	};

	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		const next = { ...searchFilterRef.current, page: value };
		await applyAndRefetch(next);
	};

	const resetFilters = async () => {
		const next = { ...initialInput, page: 1 } as CarsInquiry;
		await applyAndRefetch(next);
	};

	const likeCarHandler = async (userData: any, id: string) => {
		try {
			if (!id) return;
			if (!userData?._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetCar({ variables: { input: id } });

			const refetchRes = await getCarsRefetch({ input: searchFilterRef.current });
			if (refetchRes?.data?.getCars) {
				setCars(refetchRes.data.getCars.list ?? []);
				setTotal(refetchRes.data.getCars.metaCounter?.[0]?.total ?? 0);
			}

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR: likeCarHandler', err.message);
			await sweetMixinErrorAlert(err.message);
			throw err;
		}
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = async (e: React.MouseEvent<HTMLLIElement>) => {
		let next = { ...searchFilterRef.current, page: 1 };
		switch (e.currentTarget.id) {
			case 'recent':
				next = { ...next, sort: 'createdAt', direction: Direction.DESC };
				setFilterSortName('Recent');
				break;
			case 'old':
				next = { ...next, sort: 'createdAt', direction: Direction.ASC };
				setFilterSortName('Oldest');
				break;
			case 'price_low':
				next = { ...next, sort: 'pricePerDay', direction: Direction.ASC };
				setFilterSortName('Lowest Price');
				break;
			case 'price_high':
				next = { ...next, sort: 'pricePerDay', direction: Direction.DESC };
				setFilterSortName('Highest Price');
				break;
			case 'likes':
				next = { ...next, sort: 'carLikes', direction: Direction.DESC };
				setFilterSortName('Likes');
				break;
			case 'views':
				next = { ...next, sort: 'carViews', direction: Direction.DESC };
				setFilterSortName('Views');
				break;
		}

		setSortingOpen(false);
		setAnchorEl(null);
		await applyAndRefetch(next);
	};

	if (device === 'mobile') {
		return (
			<Stack className="car-page mobile">
				<Stack className="container">
					<Box className="car-topbar">
						<Box className="car-topbar__title">
							<strong>Cars</strong>
							<span>{(total ?? 0).toLocaleString()} available</span>
						</Box>
						<Box className="car-topbar__actions">
							<Button className="ghost" onClick={() => setFilterDrawerOpen(true)} startIcon={<TuneRoundedIcon />}>
								Filters
							</Button>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{filterSortName}
							</Button>
						</Box>
					</Box>

					<Box className="car-layout">
						<Box className="car-grid">
							{cars.length === 0 ? (
								<div className={'no-data'}>
									<img src="/img/icons/icoAlert.svg" alt="" />
									<p>No Cars found!</p>
								</div>
							) : (
								cars.map((car: Car) => <CarCard car={car} likeCarHandler={likeCarHandler} key={car._id} />)
							)}
						</Box>
					</Box>

					<Stack className="car-pagination">
						{cars.length !== 0 && totalPages > 1 && (
							<Stack className="pagination-box">
								<Pagination
									page={currentPage}
									count={totalPages}
									onChange={handlePaginationChange}
									shape="circular"
									color="primary"
								/>
							</Stack>
						)}
						{cars.length !== 0 && <span>Total {(total ?? 0).toLocaleString()} cars available</span>}
					</Stack>
				</Stack>

				<Drawer anchor="bottom" open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
					<Box className="car-filter-drawer">
						<CarFilter
							value={searchFilter}
							onChange={async (next) => {
								await applyAndRefetch(next);
							}}
							onReset={resetFilters}
						/>
					</Box>
				</Drawer>

				<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
					<MenuItem onClick={sortingHandler} id={'recent'} disableRipple>
						Recent
					</MenuItem>
					<MenuItem onClick={sortingHandler} id={'old'} disableRipple>
						Oldest
					</MenuItem>
					<MenuItem onClick={sortingHandler} id={'price_low'} disableRipple>
						Lowest Price
					</MenuItem>
					<MenuItem onClick={sortingHandler} id={'price_high'} disableRipple>
						Highest Price
					</MenuItem>
					<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>
						Likes
					</MenuItem>
					<MenuItem onClick={sortingHandler} id={'views'} disableRipple>
						Views
					</MenuItem>
				</Menu>
			</Stack>
		);
	}

	return (
		<Stack className="car-page">
			<Stack className="container">
				<Box className="car-topbar">
					<Box className="car-topbar__title">
						<strong>Cars</strong>
						<span>{(total ?? 0).toLocaleString()} available</span>
					</Box>
					<Box className="car-topbar__actions">
						<Button className="ghost" onClick={resetFilters} startIcon={<TuneRoundedIcon />}>
							Reset
						</Button>
						<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
							{filterSortName}
						</Button>
					</Box>
				</Box>

				<Box className="car-layout">
					<Box className="car-aside">
						<CarFilter
							value={searchFilter}
							onChange={async (next) => {
								await applyAndRefetch(next);
							}}
							onReset={resetFilters}
						/>
					</Box>

					<Box className="car-main">
						<Box className="car-grid">
							{cars.length === 0 ? (
								<div className={'no-data'}>
									<img src="/img/icons/icoAlert.svg" alt="" />
									<p>No Cars found!</p>
								</div>
							) : (
								cars.map((car: Car) => <CarCard car={car} likeCarHandler={likeCarHandler} key={car._id} />)
							)}
						</Box>

						<Stack className="car-pagination">
							{cars.length !== 0 && totalPages > 1 && (
								<Stack className="pagination-box">
									<Pagination
										page={currentPage}
										count={totalPages}
										onChange={handlePaginationChange}
										shape="circular"
										color="primary"
									/>
								</Stack>
							)}
							{cars.length !== 0 && <span>Total {(total ?? 0).toLocaleString()} cars available</span>}
						</Stack>
					</Box>
				</Box>

			</Stack>

			<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
				<MenuItem onClick={sortingHandler} id={'recent'} disableRipple>
					Recent
				</MenuItem>
				<MenuItem onClick={sortingHandler} id={'old'} disableRipple>
					Oldest
				</MenuItem>
				<MenuItem onClick={sortingHandler} id={'price_low'} disableRipple>
					Lowest Price
				</MenuItem>
				<MenuItem onClick={sortingHandler} id={'price_high'} disableRipple>
					Highest Price
				</MenuItem>
				<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>
					Likes
				</MenuItem>
				<MenuItem onClick={sortingHandler} id={'views'} disableRipple>
					Views
				</MenuItem>
			</Menu>
		</Stack>
	);
};

CarList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {},
	},
};

export default withLayoutBasic(CarList);
