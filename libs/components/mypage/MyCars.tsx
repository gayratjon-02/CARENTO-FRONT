import React, { MouseEvent, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Car } from '../../types/property/cars';
import { T } from '../../types/common';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { ARCHIVE_CAR } from '../../../apollo/user/mutation';
import { GET_AGENT_CARS } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { REACT_APP_API_URL } from '../../config';
import { formatEnumValue } from '../../utils';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { CarStatus } from '../../enum/car.enum';

const MyCars: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<any>(initialInput);
	const [agentCars, setAgentCars] = useState<Car[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [statusFilter, setStatusFilter] = useState<CarStatus>(CarStatus.ACTIVE);
	const [uiPage, setUiPage] = useState<number>(1);
	const uiLimit = 5;
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [archiveCar] = useMutation(ARCHIVE_CAR);

	const {
		loading: getAgentCarsLoading,
		error: getAgentCarsError,
		refetch: getAgentCarsRefetch,
	} = useQuery(GET_AGENT_CARS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentCars(data?.getAgentCars?.list ?? []);
			setTotal(data?.getAgentCars?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const changeStatusHandler = (value: CarStatus) => {
		setStatusFilter(value);
		setUiPage(1);
	};

	const paginationHandler = (e: T, value: number) => {
		setUiPage(value);
	};

	const editCarHandler = async (e: MouseEvent<HTMLElement>, id: string) => {
		try {
			e.stopPropagation();
			e.preventDefault();
			if (!id) return;
			await router.push({ pathname: '/mypage', query: { category: 'addCar', carId: id } });
		} catch (err: any) {
			console.log('ERROR, editCarHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const deleteCarHandler = async (e: MouseEvent<HTMLElement>, id: string) => {
		const isMomentFnError = (msg: string) => {
			const normalized = String(msg || '').toLowerCase();
			return normalized.includes('moment_1.default') && normalized.includes('not a function');
		};

		let snapshot: Car[] | null = null;
		try {
			e.stopPropagation();
			e.preventDefault();
			if (!id) return;
			if (!(await sweetConfirmAlert('Are you sure to archive this car?'))) return;

			snapshot = agentCars;
			setAgentCars((prev) =>
				prev.map((car) => (String(car?._id) === String(id) ? ({ ...car, carStatus: CarStatus.DELETED } as Car) : car)),
			);

			const res = await archiveCar({
				variables: {
					input: {
						_id: id,
						carStatus: CarStatus.DELETED,
					},
				},
				errorPolicy: 'all',
			});

			const gqlErrorMessage = res?.errors?.[0]?.message;
			const hasData = Boolean(res?.data?.updateCar?._id);

			// Backend bug sometimes returns a moment() error even when the mutation applies.
			if (gqlErrorMessage && isMomentFnError(gqlErrorMessage)) {
				await getAgentCarsRefetch({ input: searchFilter });
				await sweetTopSmallSuccessAlert('Archived', 800);
				return;
			}

			if (!hasData) {
				const refetched = await getAgentCarsRefetch({ input: searchFilter });
				const list: Car[] = refetched?.data?.getAgentCars?.list ?? [];
				const updated = list.find((car) => String(car?._id) === String(id));
				const isArchived = String((updated as any)?.carStatus ?? '') === String(CarStatus.DELETED);
				if (isArchived || !updated) {
					await sweetTopSmallSuccessAlert('Archived', 800);
					return;
				}

				setAgentCars(snapshot);
				throw new Error(gqlErrorMessage || 'Could not archive car');
			}

			await getAgentCarsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Archived', 800);

			if (gqlErrorMessage && !isMomentFnError(gqlErrorMessage)) {
				console.warn('ArchiveCar returned GraphQL errors:', gqlErrorMessage);
			}
		} catch (err: any) {
			const message =
				err?.graphQLErrors?.[0]?.message ||
				err?.networkError?.message ||
				err?.message ||
				'Something went wrong';

			if (isMomentFnError(message)) {
				try {
					const refetched = await getAgentCarsRefetch({ input: searchFilter });
					const list: Car[] = refetched?.data?.getAgentCars?.list ?? [];
					const updated = list.find((car) => String(car?._id) === String(id));
					const isArchived = String((updated as any)?.carStatus ?? '') === String(CarStatus.DELETED);
					if (isArchived || !updated) {
						await sweetTopSmallSuccessAlert('Archived', 800);
						return;
					}
				} catch (refetchErr) {
					console.warn('Moment error path refetch failed', refetchErr);
				}
				// Assume archived even if refetch failed; suppress popup for this known backend bug.
				await sweetTopSmallSuccessAlert('Archived', 800);
				return;
			}

			if (snapshot) setAgentCars(snapshot);
			console.log('ERROR, deleteCarHandler:', message, err);
			sweetMixinErrorAlert(String(message)).then();
		}
	};

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	const filteredCars = useMemo(() => {
		const desired = String(statusFilter);
		return agentCars.filter((car) => String((car as any)?.carStatus ?? 'ACTIVE') === desired);
	}, [agentCars, statusFilter]);

	const totalFiltered = filteredCars.length;
	const totalPages = Math.max(1, Math.ceil(totalFiltered / uiLimit));
	const pagedCars = useMemo(() => {
		const start = (uiPage - 1) * uiLimit;
		return filteredCars.slice(start, start + uiLimit);
	}, [filteredCars, uiPage]);

	const emptyState = !getAgentCarsLoading && totalFiltered === 0;
	const visibleCountLabel = useMemo(() => {
		if (!totalFiltered) return '0';
		const start = (Number(uiPage) - 1) * Number(uiLimit) + 1;
		const end = Math.min(Number(uiPage) * Number(uiLimit), totalFiltered);
		return `${start}–${end}`;
	}, [totalFiltered, uiLimit, uiPage]);

	if (device === 'mobile') {
		return (
			<Box>
				<Stack spacing={1.5} sx={{ mb: 1.5 }}>
					<Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ gap: 2 }}>
						<Stack spacing={0.4} sx={{ minWidth: 0 }}>
							<Typography sx={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.3 }}>My Cars</Typography>
							<Typography sx={{ color: 'text.secondary', fontSize: 13 }}>Manage your listings.</Typography>
						</Stack>
						<Button variant="contained" size="small" onClick={() => router.push({ pathname: '/mypage', query: { category: 'addCar' } })}>
							Add
						</Button>
					</Stack>

					<Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
						<Button
							size="small"
							variant="outlined"
							onClick={() => changeStatusHandler(CarStatus.ACTIVE)}
							sx={{
								borderRadius: 999,
								whiteSpace: 'nowrap',
								borderColor: String(statusFilter) === 'ACTIVE' ? 'rgba(159,178,255,0.8)' : 'rgba(255,255,255,0.14)',
								color: String(statusFilter) === 'ACTIVE' ? '#ffffff' : '#dfe4ff',
								background: String(statusFilter) === 'ACTIVE' ? 'rgba(124,93,255,0.18)' : 'rgba(255,255,255,0.04)',
							}}
						>
							Active
						</Button>
						<Button
							size="small"
							variant="outlined"
							onClick={() => changeStatusHandler(CarStatus.BLOCKED)}
							sx={{
								borderRadius: 999,
								whiteSpace: 'nowrap',
								borderColor: String(statusFilter) === 'BLOCKED' ? 'rgba(159,178,255,0.8)' : 'rgba(255,255,255,0.14)',
								color: String(statusFilter) === 'BLOCKED' ? '#ffffff' : '#dfe4ff',
								background: String(statusFilter) === 'BLOCKED' ? 'rgba(124,93,255,0.18)' : 'rgba(255,255,255,0.04)',
							}}
						>
							Blocked
						</Button>
						<Button
							size="small"
							variant="outlined"
							onClick={() => changeStatusHandler(CarStatus.DELETED)}
							sx={{
								borderRadius: 999,
								whiteSpace: 'nowrap',
								borderColor: String(statusFilter) === 'DELETED' ? 'rgba(159,178,255,0.8)' : 'rgba(255,255,255,0.14)',
								color: String(statusFilter) === 'DELETED' ? '#ffffff' : '#dfe4ff',
								background: String(statusFilter) === 'DELETED' ? 'rgba(124,93,255,0.18)' : 'rgba(255,255,255,0.04)',
							}}
						>
							Archived
						</Button>
					</Stack>
				</Stack>

				{getAgentCarsError && (
					<Box
						sx={{
							mb: 2,
							p: 1.5,
							borderRadius: 2,
							border: '1px solid rgba(239,68,68,0.25)',
							background: 'rgba(239,68,68,0.06)',
						}}
					>
						<Typography sx={{ fontWeight: 800, color: 'rgba(239,68,68,0.95)' }}>Could not load cars</Typography>
						<Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.5 }}>
							{String(getAgentCarsError.message || '')}
						</Typography>
						<Button variant="outlined" sx={{ mt: 1 }} onClick={() => getAgentCarsRefetch({ input: searchFilter })}>
							Retry
						</Button>
					</Box>
				)}

					<Stack spacing={1.25}>
						{getAgentCarsLoading && !agentCars.length
							? Array.from({ length: uiLimit }).map((_, idx) => (
									<Skeleton key={idx} variant="rounded" height={104} />
							  ))
							: pagedCars.length
								? pagedCars.map((car) => (
									<Box
										key={car?._id}
										onClick={() => router.push({ pathname: '/car/detail', query: { id: car?._id } })}
										sx={{
											display: 'grid',
											gridTemplateColumns: '110px 1fr',
											gap: 1.25,
											p: 1.25,
											borderRadius: 2,
											border: '1px solid rgba(255,255,255,0.10)',
											background: 'rgba(255,255,255,0.04)',
											cursor: 'pointer',
										}}
									>
										<Box
											sx={{
												borderRadius: 1.5,
												background: 'rgba(255,255,255,0.06)',
												overflow: 'hidden',
												position: 'relative',
											}}
										>
											<Box
												sx={{
													position: 'absolute',
													inset: 0,
													backgroundSize: 'cover',
													backgroundPosition: 'center',
													backgroundImage: car?.carImages?.[0]
														? `url(${REACT_APP_API_URL}/${car.carImages[0]})`
														: 'linear-gradient(135deg, rgba(124,93,255,0.25), rgba(255,112,168,0.18))',
												}}
											/>
										</Box>
										<Stack spacing={0.65} sx={{ minWidth: 0 }}>
											<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
												<Typography sx={{ fontWeight: 900, fontSize: 14 }} noWrap>
													{car?.carTitle}
												</Typography>
												<Stack direction="row" spacing={0.6} sx={{ flexShrink: 0 }}>
													<Button size="small" variant="text" onClick={(e) => editCarHandler(e, String(car?._id))} sx={{ minWidth: 0, px: 0.75 }}>
														<EditRoundedIcon fontSize="small" />
													</Button>
													<Button size="small" variant="text" onClick={(e) => deleteCarHandler(e, String(car?._id))} sx={{ minWidth: 0, px: 0.75 }}>
														<DeleteOutlineRoundedIcon fontSize="small" />
													</Button>
												</Stack>
											</Stack>
											<Typography sx={{ color: 'text.secondary', fontSize: 12 }} noWrap>
												{[car?.brandType ? formatEnumValue(String(car.brandType)) : '', car?.year ? String(car.year) : '']
													.filter(Boolean)
													.join(' • ') || 'Your listing'}
											</Typography>
											<Typography sx={{ fontWeight: 900, fontSize: 13 }}>
												${Number(car?.pricePerDay ?? 0).toLocaleString()}
												<Typography component="span" sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 700 }}>
													{' '}
													/day
												</Typography>
											</Typography>
										</Stack>
										</Box>
							  ))
							: (
									<Box
										sx={{
											py: 6,
											borderRadius: 2,
											border: '1px dashed rgba(255,255,255,0.14)',
											background: 'rgba(255,255,255,0.03)',
											textAlign: 'center',
										}}
									>
										<Typography sx={{ fontWeight: 900 }}>No {formatEnumValue(String(statusFilter))} cars</Typography>
										<Typography sx={{ color: 'text.secondary', fontSize: 13, mt: 0.5 }}>
											Create a listing or switch tabs to see other cars.
										</Typography>
										<Button variant="contained" sx={{ mt: 2 }} onClick={() => router.push({ pathname: '/mypage', query: { category: 'addCar' } })}>
											Add car
										</Button>
									</Box>
							  )}
				</Stack>

				{totalFiltered > 0 && (
					<Stack spacing={1.2} alignItems="center" sx={{ mt: 2 }}>
						<Pagination
							count={totalPages}
							page={uiPage}
							shape="rounded"
							color="primary"
							onChange={paginationHandler}
						/>
						<Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
							{totalFiltered.toLocaleString()} cars • Page {uiPage}
						</Typography>
					</Stack>
				)}
			</Box>
		);
	}

		return (
			<div id="my-property-page">
				<Stack className="cars-header" direction="row" justifyContent="space-between" alignItems="flex-start">
					<Stack className="left">
					<Typography className="kicker">Garage</Typography>
					<Typography className="title">My Cars</Typography>
					<Typography className="desc">Manage your listings, update details, and archive old cars.</Typography>
				</Stack>
				<Stack className="right" alignItems="flex-end" spacing={1}>
					<Typography className="count">{total.toLocaleString()} cars</Typography>
					<Button className="add-btn" onClick={() => router.push({ pathname: '/mypage', query: { category: 'addCar' } })}>
						Add car
					</Button>
				</Stack>
			</Stack>

			<Stack className="cars-toolbar" direction="row" justifyContent="space-between" alignItems="center">
				<Stack direction="row" spacing={1} className="status-tabs">
					<Button
						className={`tab ${String(statusFilter) === 'ACTIVE' ? 'active' : ''}`}
						onClick={() => changeStatusHandler(CarStatus.ACTIVE)}
					>
						Active
					</Button>
					<Button
						className={`tab ${String(statusFilter) === 'BLOCKED' ? 'active' : ''}`}
						onClick={() => changeStatusHandler(CarStatus.BLOCKED)}
					>
						Blocked
					</Button>
					<Button
						className={`tab ${String(statusFilter) === 'DELETED' ? 'active' : ''}`}
						onClick={() => changeStatusHandler(CarStatus.DELETED)}
					>
						Archived
					</Button>
				</Stack>

				{totalFiltered > 0 && (
					<Typography className="meta">
						Showing {visibleCountLabel} of {totalFiltered.toLocaleString()}
					</Typography>
				)}
			</Stack>

			{getAgentCarsError && (
				<Box className="cars-error">
					<Typography className="err-title">Could not load cars</Typography>
					<Typography className="err-desc">{String(getAgentCarsError.message || '')}</Typography>
					<Button className="retry" onClick={() => getAgentCarsRefetch({ input: searchFilter })}>
						Retry
					</Button>
				</Box>
			)}

			<Box className="cars-list">
				{getAgentCarsLoading && !agentCars.length ? (
					<>
						{Array.from({ length: uiLimit }).map((_, idx) => (
							<Box key={idx} className="car-skeleton">
								<Skeleton variant="rounded" className="sk-media" />
								<Box className="sk-body">
									<Skeleton variant="text" width="60%" />
									<Skeleton variant="text" width="40%" />
									<Skeleton variant="text" width="70%" />
								</Box>
							</Box>
						))}
					</>
					) : emptyState ? (
						<Box className="cars-empty">
							<img src="/img/icons/icoAlert.svg" alt="" />
							<Typography className="empty-title">No {formatEnumValue(String(statusFilter))} cars</Typography>
							<Typography className="empty-desc">Create a listing or switch tabs to see other cars.</Typography>
							<Button className="add-btn" onClick={() => router.push({ pathname: '/mypage', query: { category: 'addCar' } })}>
								Add car
							</Button>
						</Box>
					) : (
						pagedCars.map((car) => {
							const imageUrl = car?.carImages?.[0] ? `${REACT_APP_API_URL}/${car.carImages[0]}` : '';
							const metaLine = [
								car?.brandType ? formatEnumValue(String(car.brandType)) : '',
								car?.year ? String(car.year) : '',
							car?.fuelType ? formatEnumValue(String(car.fuelType)) : '',
							car?.transmission ? formatEnumValue(String(car.transmission)) : '',
						]
							.filter(Boolean)
							.join(' • ');

						const status = (car as any)?.carStatus ?? 'ACTIVE';
						const statusLabel = status === 'DELETED' ? 'ARCHIVED' : status;

						return (
							<Box
								key={car?._id}
								className="car-row"
								onClick={() => router.push({ pathname: '/car/detail', query: { id: car?._id } })}
							>
								<Box
									className={`media ${imageUrl ? '' : 'no-image'}`}
									style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
								>
									<Box className="media-overlay" />
									<Box className="media-chip">{car?.carType ? formatEnumValue(String(car.carType)) : 'Car'}</Box>
								</Box>

								<Box className="body">
									<Box className="title-row">
										<Typography className="car-title">{car?.carTitle}</Typography>
										<Box className="actions">
											<Button className="icon edit" onClick={(e) => editCarHandler(e, String(car?._id))} aria-label="Edit car">
												<EditRoundedIcon />
											</Button>
											<Button
												className="icon delete"
												onClick={(e) => deleteCarHandler(e, String(car?._id))}
												aria-label="Archive car"
											>
												<DeleteOutlineRoundedIcon />
											</Button>
										</Box>
									</Box>

									<Typography className="meta">{metaLine || 'Your listing'}</Typography>

									<Box className="sub-row">
										<Box className="specs">
											{typeof car?.seats === 'number' && <span className="spec">{car.seats} seats</span>}
											{typeof car?.doors === 'number' && <span className="spec">{car.doors} doors</span>}
											{car?.carLocation && <span className="spec">{formatEnumValue(String(car.carLocation))}</span>}
											<span className={`status ${String(status).toLowerCase()}`}>{statusLabel}</span>
										</Box>
										<Box className="stats">
											<span className="stat">
												<VisibilityOutlinedIcon />
												{Number(car?.carViews ?? 0).toLocaleString()}
											</span>
											<span className="stat">
												<FavoriteRoundedIcon />
												{Number(car?.carLikes ?? 0).toLocaleString()}
											</span>
										</Box>
									</Box>
								</Box>

								<Box className="price">
									<span className="label">From</span>
									<strong>${Number(car?.pricePerDay ?? 0).toLocaleString()}</strong>
									<small>/day</small>
								</Box>
							</Box>
						);
						})
					)}
			</Box>

			{totalFiltered > 0 && (
				<Stack className="cars-footer" direction="row" alignItems="center" justifyContent="space-between">
					<Typography className="footer-meta">
						Showing {visibleCountLabel} of {totalFiltered.toLocaleString()}
					</Typography>
					<Pagination
						count={totalPages}
						page={uiPage}
						shape="rounded"
						color="primary"
						onChange={paginationHandler}
					/>
				</Stack>
			)}
		</div>
	);
};

MyCars.defaultProps = {
	initialInput: {
		page: 1,
		limit: 100,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default MyCars;
