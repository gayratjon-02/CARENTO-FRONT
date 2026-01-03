import React, { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, CircularProgress, Pagination, Stack, Typography } from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import BrandingWatermarkOutlinedIcon from '@mui/icons-material/BrandingWatermarkOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import SpeedIcon from '@mui/icons-material/Speed';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { REACT_APP_API_URL } from '../../libs/config';
import { formatEnumValue, formatterStr } from '../../libs/utils';
import { Comment } from '../../libs/types/comment/comment';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { CREATE_BOOKING, CREATE_COMMENT, LIKE_TARGET_CAR } from '../../apollo/user/mutation';
import { GET_CAR, GET_CARS, GET_COMMENTS } from '../../apollo/user/query';
import ReviewCard from '../../libs/components/agent/ReviewCard';
import CarCard from '../../libs/components/car/CarCard';
import { CarsInquiry } from 'libs/types/car/cars.input';
import { Car } from 'libs/types/car/cars';
import { useTranslation } from 'next-i18next';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const toImageUrl = (p?: string) => (p ? `${REACT_APP_API_URL}/${p}` : '');

const CarDetail: NextPage = ({ initialComment }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');

	const carId = useMemo(() => (router.query.id ? String(router.query.id) : ''), [router.query.id]);
	const [activeImage, setActiveImage] = useState<string>('');

	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [comments, setComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.CARS,
		commentContent: '',
		commentRefId: '',
	});

	const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [createBooking] = useMutation(CREATE_BOOKING);

	const {
		loading: carLoading,
		data: carData,
		refetch: carRefetch,
	} = useQuery(GET_CAR, {
		fetchPolicy: 'network-only',
		variables: { input: carId },
		skip: !carId,
		onCompleted: (data: T) => {
			const car = data?.getCar as Car | undefined;
			const first = Array.isArray((car as any)?.carImages) ? (car as any)?.carImages?.[0] : '';
			setActiveImage((prev) => prev || first || '');
		},
	});

	const car: Car | null = (carData?.getCar as any) ?? null;
	const hasImages = Array.isArray(car?.carImages) && car!.carImages!.length > 0;
	const images = hasImages ? (car!.carImages as string[]) : [];

	const isLikedFromApi = useMemo(() => {
		const anyCar = car as any;
		if (!anyCar) return false;
		if (Array.isArray(anyCar?.meLiked) && anyCar.meLiked.length > 0) return Boolean(anyCar.meLiked[0]?.myFavorite);
		return Boolean(anyCar?.isLiked ?? anyCar?.liked ?? anyCar?.isFavorite ?? false);
	}, [car]);

	const [liked, setLiked] = useState<boolean>(false);
	useEffect(() => {
		setLiked(isLikedFromApi);
	}, [isLikedFromApi]);

	const likesCount = useMemo(() => {
		const v = (car as any)?.carLikes ?? 0;
		return typeof v === 'number' ? v : Number(v) || 0;
	}, [car]);

	const viewsCount = useMemo(() => {
		const v = (car as any)?.carViews ?? 0;
		return typeof v === 'number' ? v : Number(v) || 0;
	}, [car]);

	const similarInput: CarsInquiry | null = useMemo(() => {
		if (!car?._id) return null;
		const search: any = {};
		if (car?.carLocation) search.carLocation = [car.carLocation];
		if (car?.brandType) search.brandType = [car.brandType];
		return {
			page: 1,
			limit: 6,
			sort: 'carLikes',
			direction: Direction.DESC,
			search,
		};
	}, [car]);

	const [similarCars, setSimilarCars] = useState<Car[]>([]);

	const { refetch: similarRefetch } = useQuery(GET_CARS, {
		fetchPolicy: 'network-only',
		variables: { input: similarInput },
		skip: !similarInput,
		onCompleted: (data: T) => {
			const list = (data?.getCars?.list ?? []) as Car[];
			setSimilarCars(list.filter((c) => String(c?._id) !== String(car?._id)));
		},
	});

	const { refetch: commentsRefetch } = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		skip: !commentInquiry?.search?.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setComments(data?.getComments?.list ?? []);
			setCommentTotal(data?.getComments?.metaCounter?.[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		if (!carId) return;
		setCommentInquiry((prev) => ({ ...prev, search: { ...prev.search, commentRefId: carId } }));
		setInsertCommentData((prev) => ({ ...prev, commentRefId: carId }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [carId]);

	const onLike = async (e: MouseEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (!car?._id) return;

		const prev = liked;
		setLiked(!prev);

		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetCar({ variables: { input: String(car._id) } });
			await carRefetch({ input: String(car._id) });
			if (similarInput) await similarRefetch({ input: similarInput });
			await sweetTopSmallSuccessAlert('success', 700);
		} catch (err: any) {
			setLiked(prev);
			await sweetMixinErrorAlert(err.message);
		}
	};

	const createCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!insertCommentData.commentRefId) throw new Error(Message.INSERT_ALL_INPUTS);
			if (!insertCommentData.commentContent.trim()) throw new Error(Message.INSERT_ALL_INPUTS);

			await createComment({ variables: { input: insertCommentData } });
			setInsertCommentData((prev) => ({ ...prev, commentContent: '' }));
			await commentsRefetch({ input: commentInquiry });
			await sweetTopSmallSuccessAlert('success', 700);
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const commentPaginationChangeHandler = async (_: ChangeEvent<unknown>, value: number) => {
		const next = { ...commentInquiry, page: value };
		setCommentInquiry(next);
		await commentsRefetch({ input: next });
	};

	const likeCarCardHandler = async (userData: any, id: string) => {
		try {
			if (!id) return;
			if (!userData?._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetCar({ variables: { input: id } });
			if (similarInput) await similarRefetch({ input: similarInput });
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
			throw err;
		}
	};

	const handleBookOnline = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!car?._id) throw new Error(Message.NO_DATA_FOUND);

			const startDate = new Date();
			const endDate = new Date();
			endDate.setDate(startDate.getDate() + 1);

			const input = {
				userId: user._id,
				agentId: (car as any)?.memberData?._id ?? (car as any)?.memberId ?? null,
				carId: car._id,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
				totalPrice: Number((car as any)?.pricePerDay ?? 0),
			};

			await createBooking({ variables: { input } });
			await sweetTopSmallSuccessAlert('Booked', 900);
			await router.push(`/booking/booking?id=${car._id}`);
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (carLoading) {
		return (
			<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '60vh' }}>
				<CircularProgress size={'4rem'} />
			</Stack>
		);
	}

	if (!car) {
		return (
			<Stack className={`car-detail-page ${device === 'mobile' ? 'mobile' : ''}`}>
					<Stack className="container">
						<Box className="car-detail__empty">
							<Typography className="title">{t('Car not found', { defaultValue: 'Car not found' })}</Typography>
							<Typography className="sub">
								{t('Try going back to the list and open again.', {
									defaultValue: 'Try going back to the list and open again.',
								})}
							</Typography>
							<Button startIcon={<ArrowBackRoundedIcon />} className="back" onClick={() => router.push('/car')}>
								{t('Back to Cars', { defaultValue: 'Back to Cars' })}
							</Button>
						</Box>
					</Stack>
				</Stack>
			);
	}

	const title = car.carTitle ?? t('Car', { defaultValue: 'Car' });
	const brandRaw = car.brandType ? formatEnumValue(String(car.brandType)) : '';
	const fuelRaw = car.fuelType ? formatEnumValue(String(car.fuelType)) : '';
	const transmissionRaw = car.transmission ? formatEnumValue(String(car.transmission)) : '';
	const typeRaw = car.carType ? formatEnumValue(String(car.carType)) : '';
	const locationRaw = car.carLocation ? formatEnumValue(String(car.carLocation)) : '';
	const brand = brandRaw ? t(brandRaw, { defaultValue: brandRaw }) : '';
	const fuel = fuelRaw ? t(fuelRaw, { defaultValue: fuelRaw }) : '';
	const transmission = transmissionRaw ? t(transmissionRaw, { defaultValue: transmissionRaw }) : '';
	const type = typeRaw ? t(typeRaw, { defaultValue: typeRaw }) : '';
	const location = locationRaw ? t(locationRaw, { defaultValue: locationRaw }) : '';
	const year = car.year ? String(car.year) : '';
	const heroUrl = activeImage ? toImageUrl(activeImage) : images[0] ? toImageUrl(images[0]) : '';
	const mileage = Number(car?.mileage ?? 0);
	const priceDay = Number(car?.pricePerDay ?? 0);
	const priceHour = Number(car?.pricePerHour ?? 0);

	const facts = [
		{
			key: 'carType',
			label: t('Car Type', { defaultValue: 'Car Type' }),
			value: type || '—',
			icon: <DirectionsCarFilledOutlinedIcon />,
		},
		{
			key: 'mileage',
			label: t('Mileage', { defaultValue: 'Mileage' }),
			value: mileage ? t('{{value}} km', { value: mileage.toLocaleString(), defaultValue: `${mileage.toLocaleString()} km` }) : '—',
			icon: <SpeedIcon />,
		},
		{
			key: 'fuelType',
			label: t('Fuel Type', { defaultValue: 'Fuel Type' }),
			value: fuel || '—',
			icon: <LocalGasStationIcon />,
		},
		{
			key: 'engine',
			label: t('Engine', { defaultValue: 'Engine' }),
			value: car?.engine ? String(car.engine) : '—',
			icon: <SettingsOutlinedIcon />,
		},
		{
			key: 'seats',
			label: t('Seats', { defaultValue: 'Seats' }),
			value: car?.seats ? t('{{count}} seats', { count: car.seats, defaultValue: `${car.seats} seats` }) : '—',
			icon: <EventSeatIcon />,
		},
		{
			key: 'transmission',
			label: t('Transmission', { defaultValue: 'Transmission' }),
			value: transmission || '—',
			icon: <SettingsOutlinedIcon />,
		},
	] as const;

	const features = [
		{ key: 'brand', label: t('Brand', { defaultValue: 'Brand' }), value: brand || '—', icon: <BrandingWatermarkOutlinedIcon /> },
		{ key: 'year', label: t('Year', { defaultValue: 'Year' }), value: year || '—', icon: <CalendarTodayOutlinedIcon /> },
		{ key: 'location', label: t('Location', { defaultValue: 'Location' }), value: location || '—', icon: <LocationOnOutlinedIcon /> },
		{ key: 'type', label: t('Type', { defaultValue: 'Type' }), value: type || '—', icon: <DirectionsCarFilledOutlinedIcon /> },
		{ key: 'fuel', label: t('Fuel', { defaultValue: 'Fuel' }), value: fuel || '—', icon: <LocalGasStationIcon /> },
		{ key: 'trans', label: t('Transmission', { defaultValue: 'Transmission' }), value: transmission || '—', icon: <SettingsOutlinedIcon /> },
		{
			key: 'seats',
			label: t('Seats', { defaultValue: 'Seats' }),
			value: car?.seats ? t('{{count}} seats', { count: car.seats, defaultValue: `${car.seats} seats` }) : '—',
			icon: <EventSeatIcon />,
		},
		{ key: 'doors', label: t('Doors', { defaultValue: 'Doors' }), value: car?.doors ? String(car.doors) : '—', icon: <MeetingRoomOutlinedIcon /> },
		{
			key: 'mileage2',
			label: t('Mileage', { defaultValue: 'Mileage' }),
			value: mileage ? t('{{value}} km', { value: mileage.toLocaleString(), defaultValue: `${mileage.toLocaleString()} km` }) : '—',
			icon: <SpeedIcon />,
		},
		{ key: 'engine2', label: t('Engine', { defaultValue: 'Engine' }), value: car?.engine ? String(car.engine) : '—', icon: <SettingsOutlinedIcon /> },
		{ key: 'priceDay', label: t('Price/day', { defaultValue: 'Price/day' }), value: `$${formatterStr(priceDay)}`, icon: <AttachMoneyOutlinedIcon /> },
		{ key: 'priceHour', label: t('Price/hour', { defaultValue: 'Price/hour' }), value: `$${formatterStr(priceHour)}`, icon: <AttachMoneyOutlinedIcon /> },
	] as const;

	return (
		<Stack className={`car-detail-page ${device === 'mobile' ? 'mobile' : ''}`}>
			<Stack className="container">
				<Box className="car-detail__crumbs">
					<span className="link" onClick={() => router.push('/')}>
						{t('Home', { defaultValue: 'Home' })}
					</span>
					<span className="sep">/</span>
					<span className="link" onClick={() => router.push('/car')}>
						{t('Cars', { defaultValue: 'Cars' })}
					</span>
					<span className="sep">/</span>
					<span className="current">{title}</span>
				</Box>

				<Box className="car-detail__top">
					<Button startIcon={<ArrowBackRoundedIcon />} className="back" onClick={() => router.push('/car')}>
						{t('Back', { defaultValue: 'Back' })}
					</Button>
					<Box className="meta">
						<Box className="meta-item">
							<RemoveRedEyeOutlinedIcon />
							<span>{Number(viewsCount).toLocaleString()}</span>
						</Box>
						<Box className={`meta-like ${liked ? 'liked' : ''}`} onClick={onLike} role="button">
							{liked ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
							<span>{Number(likesCount).toLocaleString()}</span>
						</Box>
					</Box>
				</Box>

				<Box className="car-detail__grid">
					<Box className="car-detail__main">
						<Box className="car-detail__gallery">
							<Box
								className={`car-detail__hero ${heroUrl ? '' : 'no-image'}`}
								style={heroUrl ? { backgroundImage: `url(${heroUrl})` } : undefined}
							>
								<Box className="hero-overlay" />
								<Box className="hero-badges">
									{type && <span className="badge">{type}</span>}
									{location && (
										<span className="badge ghost">
											<LocationOnOutlinedIcon />
											{location}
										</span>
									)}
								</Box>
								<Box className="hero-price">
									<span>{t('From', { defaultValue: 'From' })}</span>
									<strong>${formatterStr(car?.pricePerDay ?? 0)}</strong>
									<small>{t('/day', { defaultValue: '/day' })}</small>
								</Box>
							</Box>

							{images.length > 1 && (
								<Box className="car-detail__thumbs">
									{images.slice(0, 10).map((img) => {
										const url = toImageUrl(img);
										const isActive = String(img) === String(activeImage || images[0]);
										return (
											<Box
												key={img}
												className={`thumb ${isActive ? 'active' : ''}`}
												style={{ backgroundImage: `url(${url})` }}
												onClick={() => setActiveImage(img)}
												role="button"
											/>
										);
									})}
								</Box>
							)}
						</Box>

						<Box className="car-detail__card">
							<Box className="header">
								<Box className="title">
									<Typography className="name">{title}</Typography>
									<Box className="sub">
										{brand && (
											<span className="pill">
												<span className="dot" />
												{brand}
											</span>
										)}
										{year && (
											<span className="pill">
												<CalendarTodayOutlinedIcon />
												{year}
											</span>
										)}
										{fuel && (
											<span className="pill">
												<LocalGasStationIcon />
												{fuel}
											</span>
										)}
										{transmission && (
											<span className="pill">
												<SettingsOutlinedIcon />
												{transmission}
											</span>
										)}
									</Box>
								</Box>
							</Box>

							<Box className="facts-grid">
								{facts.map((f) => (
									<Box className={`fact ${f.value === '—' ? 'muted' : ''}`} key={f.key}>
										<Box className="icon">{f.icon}</Box>
										<Box className="text">
											<span className="label">{f.label}</span>
											<strong className="value">{f.value}</strong>
										</Box>
									</Box>
								))}
							</Box>

							{car?.carDescription && <Box className="desc">{car.carDescription}</Box>}
						</Box>

						<Box className="car-detail__section features">
							<Box className="section-head">
								<Typography className="section-title">{t('Car Features', { defaultValue: 'Car Features' })}</Typography>
								<Typography className="section-sub">{t('Quick overview', { defaultValue: 'Quick overview' })}</Typography>
							</Box>

							<Box className="feature-grid">
								{features.map((f) => (
									<Box className={`feature ${f.value === '—' ? 'muted' : ''}`} key={f.key}>
										<Box className="icon">{f.icon}</Box>
										<span className="label">{f.label}</span>
										<strong className="value">{f.value}</strong>
									</Box>
								))}
							</Box>
						</Box>

						<Box className="car-detail__section">
							<Box className="section-head">
								<Typography className="section-title">{t('Reviews', { defaultValue: 'Reviews' })}</Typography>
								<Typography className="section-sub">
									{commentTotal
										? t('{{count}} total', { count: commentTotal, defaultValue: `${commentTotal} total` })
										: t('Be the first to review', { defaultValue: 'Be the first to review' })}
								</Typography>
							</Box>

							{commentTotal ? (
								<Stack className="review-list">
									{comments.map((c) => (
										<ReviewCard comment={c} key={c?._id} />
									))}
									{commentTotal > commentInquiry.limit && (
										<Box className="pagination-box">
											<Pagination
												page={commentInquiry.page}
												count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
												onChange={commentPaginationChangeHandler}
												shape="circular"
												color="primary"
											/>
										</Box>
									)}
								</Stack>
							) : (
								<Box className="empty">{t('No reviews yet.', { defaultValue: 'No reviews yet.' })}</Box>
							)}

							<Box className="leave-review">
								<Typography className="leave-title">{t('Leave a review', { defaultValue: 'Leave a review' })}</Typography>
								<textarea
									value={insertCommentData.commentContent}
									placeholder={
										user?._id
											? t('Share your experience…', { defaultValue: 'Share your experience…' })
											: t('Login to write a review', { defaultValue: 'Login to write a review' })
									}
									onChange={({ target: { value } }: any) => setInsertCommentData((prev) => ({ ...prev, commentContent: value }))}
									disabled={!user?._id}
								/>
								<Box className="leave-actions">
									<Button className="submit" onClick={createCommentHandler} disabled={!user?._id || !insertCommentData.commentContent.trim()}>
										{t('Submit', { defaultValue: 'Submit' })}
									</Button>
								</Box>
							</Box>
						</Box>

						{similarCars.length > 0 && (
							<Box className="car-detail__section">
								<Box className="section-head">
									<Typography className="section-title">{t('Similar cars', { defaultValue: 'Similar cars' })}</Typography>
									<Box className="section-chip">
										<AutoAwesomeRoundedIcon />
										<span>{t('Handpicked suggestions', { defaultValue: 'Handpicked suggestions' })}</span>
									</Box>
								</Box>
								<Box className="similar-grid">
									{similarCars.slice(0, 6).map((c) => (
										<CarCard car={c} likeCarHandler={likeCarCardHandler} key={c._id} />
									))}
								</Box>
							</Box>
						)}
					</Box>

					<Box className="car-detail__aside">
						<Box className="aside-card">
							<Box className="price">
								<span>{t('From', { defaultValue: 'From' })}</span>
								<strong>${formatterStr(car?.pricePerDay ?? 0)}</strong>
								<small>{t('/day', { defaultValue: '/day' })}</small>
							</Box>
							<Button className="cta" startIcon={<PhoneRoundedIcon />} href={car?.memberData?.memberPhone ? `tel:${car.memberData.memberPhone}` : undefined} disabled={!car?.memberData?.memberPhone}>
								{t('Call dealer', { defaultValue: 'Call dealer' })}
							</Button>
							<Button className="cta ghost" onClick={handleBookOnline}>
								{t('Book online', { defaultValue: 'Book online' })}
							</Button>
							<Button className="ghost" onClick={(e) => onLike(e as any)}>
								{liked ? t('Liked', { defaultValue: 'Liked' }) : t('Like', { defaultValue: 'Like' })}
							</Button>
						</Box>

						<Box className="dealer-card">
							<Box className="dealer-top" onClick={() => router.push(`/dealers/detail?agentId=${car?.memberData?._id}`)} role="button">
								<img
									src={
										car?.memberData?.memberImage
											? `${REACT_APP_API_URL}/${car.memberData.memberImage}`
											: '/img/profile/defaultUser.svg'
									}
									alt=""
								/>
								<Box className="dealer-meta">
									<strong>
										{car?.memberData?.memberFullName ?? car?.memberData?.memberNick ?? t('Dealer', { defaultValue: 'Dealer' })}
									</strong>
									<span className="sub">{car?.memberData?.memberAddress || t('Unknown location', { defaultValue: 'Unknown location' })}</span>
								</Box>
							</Box>
							<Box className="dealer-actions">
								<Button
									className="ghost"
									startIcon={<PhoneRoundedIcon />}
									href={car?.memberData?.memberPhone ? `tel:${car.memberData.memberPhone}` : undefined}
									disabled={!car?.memberData?.memberPhone}
								>
									{t('Call', { defaultValue: 'Call' })}
								</Button>
								<Button className="primary" onClick={() => router.push(`/dealers/detail?agentId=${car?.memberData?._id}`)}>
									{t('View dealer', { defaultValue: 'View dealer' })}
								</Button>
							</Box>
						</Box>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

CarDetail.defaultProps = {
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(CarDetail);
