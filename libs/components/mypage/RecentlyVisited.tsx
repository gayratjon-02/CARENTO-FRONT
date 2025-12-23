import React, { MouseEvent, useMemo, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box, Button, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useRouter } from 'next/router';
import { T } from '../../types/common';
import { useMutation, useQuery } from '@apollo/client';
import { GET_VISITED } from '../../../apollo/user/query';
import { LIKE_TARGET_CAR } from '../../../apollo/user/mutation';
import { Messages, REACT_APP_API_URL } from '../../config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Car } from '../../types/property/cars';
import { formatEnumValue } from '../../utils';
import { getJwtToken } from '../../auth';

const RecentlyVisited: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [recentlyVisited, setRecentlyVisited] = useState<Car[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchVisited, setSearchVisited] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/
	const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);

	const {
		loading: getVisitedLoading,
		error: getVisitedError,
		refetch: getVisitedRefetch,
	} = useQuery(GET_VISITED, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchVisited,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data: T) {
			setRecentlyVisited(data?.getVisited?.list ?? []);
			setTotal(data?.getVisited?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchVisited({ ...searchVisited, page: value });
	};

	const toggleFavoriteHandler = async (e: MouseEvent<HTMLElement>, id: string, isFavorite: boolean) => {
		try {
			e.stopPropagation();
			e.preventDefault();
			if (!id) return;
			const jwt = getJwtToken();
			if (!jwt) throw new Error(Messages.error2);

			await likeTargetCar({ variables: { input: id } });
			await getVisitedRefetch({ input: searchVisited });
			await sweetTopSmallSuccessAlert(isFavorite ? 'Removed' : 'Saved', 700);
		} catch (err: any) {
			console.log('ERROR, toggleFavoriteHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const emptyState = !getVisitedLoading && recentlyVisited.length === 0;
	const visibleCountLabel = useMemo(() => {
		if (!total) return '0';
		const start = (Number(searchVisited.page) - 1) * Number(searchVisited.limit) + 1;
		const end = Math.min(Number(searchVisited.page) * Number(searchVisited.limit), total);
		return `${start}–${end}`;
	}, [searchVisited.limit, searchVisited.page, total]);

	if (device === 'mobile') {
		return (
			<Box>
				<Stack spacing={1.5} sx={{ mb: 1.5 }}>
					<Typography sx={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.3 }}>Recently Visited</Typography>
					<Typography sx={{ color: 'text.secondary', fontSize: 13 }}>Pick up where you left off.</Typography>
				</Stack>

				{getVisitedError && (
					<Box
						sx={{
							mb: 2,
							p: 1.5,
							borderRadius: 2,
							border: '1px solid rgba(239,68,68,0.25)',
							background: 'rgba(239,68,68,0.06)',
						}}
					>
						<Typography sx={{ fontWeight: 800, color: 'rgba(239,68,68,0.95)' }}>
							Could not load recently visited
						</Typography>
						<Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.5 }}>
							{String(getVisitedError.message || '')}
						</Typography>
						<Button variant="outlined" sx={{ mt: 1 }} onClick={() => getVisitedRefetch({ input: searchVisited })}>
							Retry
						</Button>
					</Box>
				)}

				<Stack spacing={1.25}>
					{getVisitedLoading && !recentlyVisited.length
						? Array.from({ length: searchVisited.limit }).map((_, idx) => (
								<Skeleton key={idx} variant="rounded" height={104} />
						  ))
						: recentlyVisited.length
							? recentlyVisited.map((car) => {
									const isFavorite = !!car?.meLiked?.[0]?.myFavorite;
									return (
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
												<Typography sx={{ fontWeight: 900, fontSize: 14 }} noWrap>
													{car?.carTitle}
												</Typography>
												<Typography sx={{ color: 'text.secondary', fontSize: 12 }} noWrap>
													{[car?.brandType ? formatEnumValue(String(car.brandType)) : '', car?.year ? String(car.year) : '']
														.filter(Boolean)
														.join(' • ') || 'Viewed ride'}
												</Typography>
												<Stack direction="row" alignItems="center" justifyContent="space-between">
													<Typography sx={{ fontWeight: 900, fontSize: 13 }}>
														${Number(car?.pricePerDay ?? 0).toLocaleString()}
														<Typography component="span" sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 700 }}>
															{' '}
															/day
														</Typography>
													</Typography>
													<Button
														size="small"
														variant="text"
														onClick={(e) => toggleFavoriteHandler(e, String(car?._id), isFavorite)}
														sx={{ minWidth: 0, px: 1 }}
													>
														{isFavorite ? <FavoriteRoundedIcon fontSize="small" /> : <FavoriteBorderRoundedIcon fontSize="small" />}
													</Button>
												</Stack>
											</Stack>
										</Box>
									);
							  })
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
										<Typography sx={{ fontWeight: 900 }}>No recently visited cars</Typography>
										<Typography sx={{ color: 'text.secondary', fontSize: 13, mt: 0.5 }}>
											Start browsing and your history will appear here.
										</Typography>
										<Button variant="contained" sx={{ mt: 2 }} onClick={() => router.push('/car')}>
											Browse cars
										</Button>
									</Box>
							  )}
				</Stack>

				{total > 0 && (
					<Stack spacing={1.2} alignItems="center" sx={{ mt: 2 }}>
						<Pagination
							count={Math.ceil(total / searchVisited.limit)}
							page={searchVisited.page}
							shape="rounded"
							color="primary"
							onChange={paginationHandler}
						/>
						<Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
							{total.toLocaleString()} visited • Page {searchVisited.page}
						</Typography>
					</Stack>
				)}
			</Box>
		);
	} else {
		return (
			<div id="my-recently-visited-page">
				<Stack className="favorites-header" direction="row" justifyContent="space-between" alignItems="flex-start">
					<Stack className="left">
						<Typography className="kicker">History</Typography>
						<Typography className="title">Recently Visited</Typography>
						<Typography className="desc">Pick up where you left off.</Typography>
					</Stack>
					<Stack className="right" alignItems="flex-end" spacing={1}>
						<Typography className="count">{total.toLocaleString()} visited</Typography>
						<Button className="browse-btn" onClick={() => router.push('/car')}>
							Browse cars
						</Button>
					</Stack>
				</Stack>

				{getVisitedError && (
					<Box className="favorites-error">
						<Typography className="err-title">Could not load recently visited</Typography>
						<Typography className="err-desc">{String(getVisitedError.message || '')}</Typography>
						<Button className="retry" onClick={() => getVisitedRefetch({ input: searchVisited })}>
							Retry
						</Button>
					</Box>
				)}

				<Box className="favorites-list">
					{getVisitedLoading && !recentlyVisited.length ? (
						<>
							{Array.from({ length: searchVisited.limit }).map((_, idx) => (
								<Box key={idx} className="favorite-skeleton">
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
						<Box className="favorites-empty">
							<img src="/img/icons/icoAlert.svg" alt="" />
							<Typography className="empty-title">No recently visited cars</Typography>
							<Typography className="empty-desc">Start browsing and your history will appear here.</Typography>
							<Button className="browse-btn" onClick={() => router.push('/car')}>
								Browse cars
							</Button>
						</Box>
					) : (
						recentlyVisited.map((car) => {
							const imageUrl = car?.carImages?.[0] ? `${REACT_APP_API_URL}/${car.carImages[0]}` : '';
							const isFavorite = !!car?.meLiked?.[0]?.myFavorite;
							const metaLine = [
								car?.brandType ? formatEnumValue(String(car.brandType)) : '',
								car?.year ? String(car.year) : '',
								car?.fuelType ? formatEnumValue(String(car.fuelType)) : '',
								car?.transmission ? formatEnumValue(String(car.transmission)) : '',
							]
								.filter(Boolean)
								.join(' • ');

							return (
								<Box
									key={car?._id}
									className="favorite-row"
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
											<Button
												className={`remove ${isFavorite ? '' : 'not-fav'}`}
												onClick={(e) => toggleFavoriteHandler(e, String(car?._id), isFavorite)}
												aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
											>
												{isFavorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
											</Button>
										</Box>

										<Typography className="meta">{metaLine || 'Viewed ride'}</Typography>

										<Box className="sub-row">
											<Box className="specs">
												{typeof car?.seats === 'number' && <span className="spec">{car.seats} seats</span>}
												{typeof car?.doors === 'number' && <span className="spec">{car.doors} doors</span>}
												{car?.carLocation && <span className="spec">{formatEnumValue(String(car.carLocation))}</span>}
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

				{total > 0 && (
					<Stack className="favorites-footer" direction="row" alignItems="center" justifyContent="space-between">
						<Typography className="footer-meta">
							Showing {visibleCountLabel} of {total.toLocaleString()}
						</Typography>
						<Pagination
							count={Math.ceil(total / searchVisited.limit)}
							page={searchVisited.page}
							shape="rounded"
							color="primary"
							onChange={paginationHandler}
						/>
					</Stack>
				)}
			</div>
		);
	}
};

export default RecentlyVisited;
