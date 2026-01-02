import React, { ChangeEvent, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Drawer, Menu, MenuItem, Pagination, Stack } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Direction } from '../../libs/enums/common.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CARS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { LIKE_TARGET_CAR } from '../../apollo/user/mutation';
import { Message } from '../../libs/enums/common.enum';
import CarCard from '../../libs/components/car/CarCard';
import CarFilter from '../../libs/components/car/CarFilter';
import { CarsInquiry } from 'libs/types/car/cars.input';
import { Car } from 'libs/types/car/cars';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const parseQueryInput = (raw: unknown): any | null => {
	if (typeof raw !== 'string' || raw.trim() === '') return null;
	try {
		return JSON.parse(decodeURIComponent(raw));
	} catch {
		try {
			return JSON.parse(raw);
		} catch {
			return null;
		}
	}
};

const normalizeRange = (range: any): any | undefined => {
	if (!range || typeof range !== 'object') return undefined;
	const start = typeof range.start === 'number' ? range.start : Number(range.start);
	const end = typeof range.end === 'number' ? range.end : Number(range.end);
	const hasStart = Number.isFinite(start);
	const hasEnd = Number.isFinite(end);
	if (!hasStart && !hasEnd) return undefined;
	return { start: hasStart ? start : 0, end: hasEnd ? end : 999999 };
};

const sanitizeCarsInquiry = (input: any, fallback: CarsInquiry): CarsInquiry => {
	const safe: CarsInquiry = {
		page: Number.isFinite(Number(input?.page)) ? Math.max(1, Number(input.page)) : fallback.page,
		limit: Number.isFinite(Number(input?.limit)) ? Math.max(1, Number(input.limit)) : fallback.limit,
		sort: typeof input?.sort === 'string' ? input.sort : fallback.sort,
		direction: Object.values(Direction).includes(input?.direction) ? input.direction : fallback.direction,
		search: typeof input?.search === 'object' && input.search ? input.search : fallback.search ?? {},
	};

	const allowedSorts = new Set(['createdAt', 'carLikes', 'carViews', 'carRank']);
	if (!safe.sort || !allowedSorts.has(safe.sort)) {
		safe.sort = fallback.sort;
		safe.direction = fallback.direction;
	}

	// Ranges: backend requires both start/end when object is present.
	const search: any = { ...(safe.search ?? {}) };
	const allowedSearchKeys = new Set([
		'carStatus',
		'carLocation',
		'carType',
		'brandType',
		'fuelType',
		'transmission',
		'seats',
		'year',
		'pricePerDay',
		'pricePerHour',
		'mileage',
		'text',
	]);
	Object.keys(search).forEach((k) => {
		if (!allowedSearchKeys.has(k)) delete search[k];
	});

	const arrayKeys = ['carLocation', 'carType', 'brandType', 'fuelType', 'transmission', 'seats', 'year'] as const;
	arrayKeys.forEach((k) => {
		const v = search[k];
		if (v === undefined || v === null) return;
		if (Array.isArray(v)) {
			search[k] = v.filter((x) => x !== undefined && x !== null);
			return;
		}
		search[k] = [v];
	});
	(['seats', 'year'] as const).forEach((k) => {
		if (!Array.isArray(search[k])) return;
		search[k] = (search[k] as any[])
			.map((x) => (typeof x === 'number' ? x : Number(x)))
			.filter((x) => Number.isFinite(x));
	});

	search.pricePerDay = normalizeRange(search.pricePerDay);
	search.pricePerHour = normalizeRange(search.pricePerHour);
	search.mileage = normalizeRange(search.mileage);

	Object.keys(search).forEach((k) => {
		const v = search[k];
		if (Array.isArray(v) && v.length === 0) delete search[k];
		if (typeof v === 'string' && v.trim() === '') delete search[k];
		if (v === undefined) delete search[k];
	});

	safe.search = search;
	return safe;
};

const serializeCarsInquiry = (input: CarsInquiry) => encodeURIComponent(JSON.stringify(input));

const CarList: NextPage = ({ initialInput }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();

	const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('Likes');

	const [searchFilter, setSearchFilter] = useState<CarsInquiry>(() => {
		const parsed = parseQueryInput(router?.query?.input);
		return sanitizeCarsInquiry(parsed ?? initialInput, initialInput);
	});
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
		const parsed = parseQueryInput(router.query.input);
		const next = sanitizeCarsInquiry(parsed ?? searchFilterRef.current ?? initialInput, initialInput);
		setSearchFilter(next);
		setCurrentPage(next?.page ?? 1);

		switch (next?.sort) {
			case 'carLikes':
				setFilterSortName('Likes');
				break;
			case 'carViews':
				setFilterSortName('Views');
				break;
			case 'createdAt':
				setFilterSortName(next?.direction === Direction.ASC ? 'Oldest' : 'Recent');
				break;
			default:
				setFilterSortName('Likes');
				break;
		}

		const desired = serializeCarsInquiry(next);
		const raw = typeof router.query.input === 'string' ? router.query.input : '';
		const rawLooksEncoded = raw.includes('%7B') || raw.includes('%22');
		const rawDecodedOk = !rawLooksEncoded && raw.startsWith('{');
		const isSame =
			raw === desired ||
			(rawDecodedOk && raw === JSON.stringify(next)) ||
			(!raw && desired === serializeCarsInquiry(searchFilterRef.current ?? next));
		if (!isSame) {
			router.replace(`/car?input=${desired}`, undefined, { scroll: false });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady, router.query.input]);

	/** HANDLERS **/
	const applyAndRefetch = async (next: CarsInquiry) => {
		const safeNext = sanitizeCarsInquiry(next, initialInput);
		setSearchFilter(safeNext);
		setCurrentPage(safeNext.page ?? 1);
		const encoded = serializeCarsInquiry(safeNext);
		await router.replace(`/car?input=${encoded}`, undefined, { scroll: false });

		const refetchRes = await getCarsRefetch({ input: safeNext });
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

				<CarFilter
					value={searchFilter}
					onChange={async (next) => {
						await applyAndRefetch(next);
					}}
					onReset={resetFilters}
				/>

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
			</Stack>

			<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
				<MenuItem onClick={sortingHandler} id={'recent'} disableRipple>
					Recent
				</MenuItem>
				<MenuItem onClick={sortingHandler} id={'old'} disableRipple>
					Oldest
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
		sort: 'carLikes',
		direction: Direction.DESC,
		search: {},
	},
	
};

export default withLayoutBasic(CarList);
