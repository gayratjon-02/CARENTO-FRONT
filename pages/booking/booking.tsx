import { useMemo, useState, useCallback } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';

import {
	Alert,
	Box,
	Button,
	Checkbox,
	Chip,
	Container,
	Divider,
	FormControlLabel,
	Paper,
	Radio,
	RadioGroup,
	Skeleton,
	Stack,
	TextField,
	Typography,
	Grid,
} from '@mui/material';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LocalGasStationRoundedIcon from '@mui/icons-material/LocalGasStationRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';

import { userVar } from 'apollo/store';
import { GET_CAR, GET_MY_BOOKINGS } from 'apollo/user/query';
import { Booking } from 'libs/types/booking/booking';
import { Car } from 'libs/types/car/cars';

function toStr(v: unknown) {
	if (typeof v === 'string') return v;
	if (Array.isArray(v)) return typeof v[0] === 'string' ? v[0] : '';
	return '';
}

function formatMoney(amount?: number | null) {
	if (amount === null || amount === undefined) return '-';
	try {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0,
		}).format(amount);
	} catch {
		return String(amount);
	}
}

function formatDate(iso?: string | null) {
	if (!iso) return '-';
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleString();
}

export default function CheckoutBookings() {
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const carId = useMemo(() => toStr(router.query.id), [router.query.id]);

	// --- UI state (dummy payment) ---
	const [agree, setAgree] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
	const [paying, setPaying] = useState(false);

	// Driver details (prefill minimal)
	const [firstName, setFirstName] = useState<string>((user as any)?.memberNick || '');
	const [lastName, setLastName] = useState<string>('');
	const [email, setEmail] = useState<string>((user as any)?.memberEmail || '');
	const [phone, setPhone] = useState<string>((user as any)?.memberPhone || '');
	const [flightNo, setFlightNo] = useState<string>('');

	// Card fields (dummy)
	const [cardName, setCardName] = useState<string>('');
	const [cardNumber, setCardNumber] = useState<string>('');
	const [cardExp, setCardExp] = useState<string>('');
	const [cardCvc, setCardCvc] = useState<string>('');

	const {
		data: carData,
		loading: carLoading,
		error: carError,
	} = useQuery(GET_CAR, {
		fetchPolicy: 'network-only',
		skip: !carId,
		variables: { input: carId },
	});

	const car: Car | undefined = carData?.getCar;

	const {
		data: bookingsData,
		loading: bookingsLoading,
		error: bookingsError,
	} = useQuery(GET_MY_BOOKINGS, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 50 } },
		notifyOnNetworkStatusChange: true,
	});

	const bookingForThisCar: Booking | undefined = useMemo(() => {
		const list: Booking[] = bookingsData?.getMyBookings?.list ?? [];
		if (!carId) return undefined;

		const related = list.filter((b) => String(b?.carId) === String(carId));
		if (related.length === 0) return undefined;

		return related.sort((a, b) => {
			const ta = new Date((a as any)?.createdAt).getTime() || 0;
			const tb = new Date((b as any)?.createdAt).getTime() || 0;
			return tb - ta;
		})[0];
	}, [bookingsData, carId]);

	const rentalFee = (bookingForThisCar as any)?.totalPrice ?? 0;
	const taxes = 0;
	const discount = 0;
	const total = Math.max(0, rentalFee + taxes - discount);

	const carImage = useMemo(() => {
		const imgs = (car as any)?.carImages;
		if (Array.isArray(imgs) && imgs.length > 0) return imgs[0];
		return '';
	}, [car]);

	const isReadyToPay = Boolean(
		car?._id &&
			bookingForThisCar?._id &&
			agree &&
			firstName.trim() &&
			email.trim() &&
			phone.trim() &&
			(paymentMethod === 'paypal' ||
				(paymentMethod === 'card' && cardNumber.trim() && cardExp.trim() && cardCvc.trim() && cardName.trim())),
	);

	const onPay = useCallback(async () => {
		if (!isReadyToPay) return;

		try {
			setPaying(true);

			// Dummy payment: keyinchalik shu joyni Stripe bilan almashtirasiz:
			// 1) backend -> createPaymentIntent(total, bookingId)
			// 2) Stripe Elements -> confirmCardPayment
			await new Promise((r) => setTimeout(r, 900));

			alert('Payment successful (dummy). Keyin Stripe integratsiya qilasiz.');
		} finally {
			setPaying(false);
		}
	}, [isReadyToPay]);

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#f6f7fb', py: 3 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
					<Button
						variant="text"
						startIcon={<ArrowBackRoundedIcon />}
						onClick={() => router.back()}
						sx={{ textTransform: 'none', fontWeight: 700 }}
					>
						Orqaga
					</Button>

					<Typography variant="h6" sx={{ fontWeight: 900 }}>
						Checkout
					</Typography>

					<Box sx={{ width: 90 }} />
				</Stack>

				{/* Errors */}
				{carError ? (
					<Alert severity="error" sx={{ mb: 2 }}>
						Mashina ma’lumotini olishda xatolik yuz berdi.
					</Alert>
				) : null}
				{bookingsError ? (
					<Alert severity="error" sx={{ mb: 2 }}>
						Booking ma’lumotini olishda xatolik yuz berdi.
					</Alert>
				) : null}

				<Grid container spacing={2}>
					{/* LEFT: Car + Driver + Payment */}
					<Grid item xs={12} md={8}>
						<Stack spacing={2}>
							{/* Car Card (rasmga o‘xshashroq) */}
							<Paper sx={{ p: 2.25, borderRadius: 3 }}>
								<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
									{/* Image */}
									<Box
										sx={{
											width: { xs: '100%', sm: 220 },
											height: 140,
											borderRadius: 2.5,
											bgcolor: 'action.hover',
											overflow: 'hidden',
											display: 'grid',
											placeItems: 'center',
										}}
									>
										{carLoading ? (
											<Skeleton variant="rectangular" width="100%" height="100%" />
										) : carImage ? (
											<img src={carImage} alt="car" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
										) : (
											<DirectionsCarRoundedIcon style={{ fontSize: 42, opacity: 0.6 }} />
										)}
									</Box>

									{/* Info */}
									<Box sx={{ flex: 1, minWidth: 0 }}>
										{carLoading ? (
											<>
												<Skeleton width="55%" />
												<Skeleton width="35%" />
											</>
										) : (
											<>
												<Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
													<Typography variant="h6" sx={{ fontWeight: 900 }} noWrap>
														{(car as any)?.carTitle || (car as any)?.brandType || 'Selected car'}
													</Typography>
													<Chip size="small" label={(car as any)?.carType || 'Economy'} />
												</Stack>

												<Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.5 }}>
													<PlaceRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
													<Typography variant="body2" color="text.secondary" noWrap>
														{(car as any)?.carLocation || 'Location'}
													</Typography>
												</Stack>
											</>
										)}

										<Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
											<Chip
												size="small"
												icon={<SettingsRoundedIcon />}
												label={(car as any)?.transmission || 'Automatic'}
												variant="outlined"
											/>
											<Chip
												size="small"
												icon={<LocalGasStationRoundedIcon />}
												label={(car as any)?.fuelType || 'Fuel'}
												variant="outlined"
											/>
											<Chip
												size="small"
												icon={<PeopleAltRoundedIcon />}
												label={(car as any)?.seats ? `${(car as any)?.seats} seats` : 'Seats'}
												variant="outlined"
											/>
										</Stack>

										{/* Included in price */}
										<Stack spacing={0.6} sx={{ mt: 1.5 }}>
											<Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
												Included in the price
											</Typography>

											<Stack direction="row" spacing={1} alignItems="center">
												<CheckCircleRoundedIcon sx={{ fontSize: 18, color: 'success.main' }} />
												<Typography variant="body2" color="text.secondary">
													Free cancellation (demo)
												</Typography>
											</Stack>

											<Stack direction="row" spacing={1} alignItems="center">
												<CheckCircleRoundedIcon sx={{ fontSize: 18, color: 'success.main' }} />
												<Typography variant="body2" color="text.secondary">
													Instant confirmation (demo)
												</Typography>
											</Stack>

											<Stack direction="row" spacing={1} alignItems="center">
												<CheckCircleRoundedIcon sx={{ fontSize: 18, color: 'success.main' }} />
												<Typography variant="body2" color="text.secondary">
													Theft protection (demo)
												</Typography>
											</Stack>
										</Stack>
									</Box>

									{/* Price */}
									<Box sx={{ textAlign: { xs: 'left', sm: 'right' }, minWidth: 110 }}>
										{carLoading ? (
											<Skeleton width={80} />
										) : (
											<Typography variant="h6" sx={{ fontWeight: 900 }}>
												{formatMoney((car as any)?.pricePerDay ?? (car as any)?.pricePerHour)}
											</Typography>
										)}
										<Typography variant="caption" color="text.secondary">
											{(car as any)?.pricePerDay ? 'per day' : (car as any)?.pricePerHour ? 'per hour' : ''}
										</Typography>
									</Box>
								</Stack>
							</Paper>

							<Alert severity="info" sx={{ borderRadius: 3 }}>
								Instant Confirmation: This vehicle is available now. You will get your confirmation immediately.
							</Alert>

							{/* Driver Details */}
							<Paper sx={{ p: 2.25, borderRadius: 3 }}>
								<Typography variant="h6" sx={{ fontWeight: 900, mb: 1.5 }}>
									Driver Details
								</Typography>

								<Grid container spacing={1.5}>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="First Name"
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="Last Name"
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="Mobile Number"
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											fullWidth
											label="Flight Number (optional)"
											value={flightNo}
											onChange={(e) => setFlightNo(e.target.value)}
											helperText="This can help ensure your vehicle is available if your flight is delayed."
										/>
									</Grid>
								</Grid>
							</Paper>

							{/* Payment Details */}
							<Paper sx={{ p: 2.25, borderRadius: 3 }}>
								<Typography variant="h6" sx={{ fontWeight: 900, mb: 1.5 }}>
									Payment Details
								</Typography>

								<RadioGroup row value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
									<FormControlLabel value="card" control={<Radio />} label="Credit / Debit Card" />
									<FormControlLabel value="paypal" control={<Radio />} label="PayPal (demo)" />
								</RadioGroup>

								<Divider sx={{ my: 1.5 }} />

								{paymentMethod === 'card' ? (
									<Grid container spacing={1.5}>
										<Grid item xs={12}>
											<TextField
												fullWidth
												label="Name on card"
												value={cardName}
												onChange={(e) => setCardName(e.target.value)}
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												fullWidth
												label="Card number"
												placeholder="4242 4242 4242 4242"
												value={cardNumber}
												onChange={(e) => setCardNumber(e.target.value)}
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<TextField
												fullWidth
												label="Expiry"
												placeholder="MM/YY"
												value={cardExp}
												onChange={(e) => setCardExp(e.target.value)}
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<TextField
												fullWidth
												label="CVC"
												placeholder="123"
												value={cardCvc}
												onChange={(e) => setCardCvc(e.target.value)}
											/>
										</Grid>
									</Grid>
								) : (
									<Alert severity="warning" sx={{ borderRadius: 2 }}>
										PayPal demo holatida. Keyin Stripe/PayPal integratsiya qilasiz.
									</Alert>
								)}
							</Paper>
						</Stack>
					</Grid>

					{/* RIGHT: Summary (sticky) */}
					<Grid item xs={12} md={4}>
						<Box sx={{ position: { md: 'sticky' }, top: { md: 90 } }}>
							<Stack spacing={2}>
								{/* Pick-up / Drop-off */}
								<Paper sx={{ p: 2.25, borderRadius: 3 }}>
									<Stack spacing={1.5}>
										<Box>
											<Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
												Pick-up
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{bookingsLoading ? 'Loading...' : formatDate((bookingForThisCar as any)?.startDate)}
											</Typography>
											<Typography variant="body2" sx={{ mt: 0.25 }}>
												{(car as any)?.carLocation || 'Location'}
											</Typography>
										</Box>

										<Divider />

										<Box>
											<Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
												Drop-off
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{bookingsLoading ? 'Loading...' : formatDate((bookingForThisCar as any)?.endDate)}
											</Typography>
											<Typography variant="body2" sx={{ mt: 0.25 }}>
												{(car as any)?.carLocation || 'Location'}
											</Typography>
										</Box>

										<Button
											variant="text"
											onClick={() => router.back()}
											sx={{ textTransform: 'none', justifyContent: 'flex-start', px: 0, fontWeight: 800 }}
										>
											Modify search
										</Button>
									</Stack>
								</Paper>

								{/* Price Summary */}
								<Paper sx={{ p: 2.25, borderRadius: 3 }}>
									<Typography variant="h6" sx={{ fontWeight: 900, mb: 1.5 }}>
										Price Summary
									</Typography>

									<Stack spacing={1}>
										<Stack direction="row" justifyContent="space-between">
											<Typography variant="body2" color="text.secondary"></Typography>
											<Typography variant="body2" sx={{ fontWeight: 800 }}>
												{bookingsLoading ? '...' : formatMoney(rentalFee)}
											</Typography>
										</Stack>

										<Stack direction="row" justifyContent="space-between">
											<Typography variant="body2" color="text.secondary">
												Taxes
											</Typography>
											<Typography variant="body2" sx={{ fontWeight: 800 }}>
												{formatMoney(taxes)}
											</Typography>
										</Stack>

										<Stack direction="row" justifyContent="space-between">
											<Typography variant="body2" color="text.secondary">
												Discount
											</Typography>
											<Typography variant="body2" sx={{ fontWeight: 800 }}>
												-{formatMoney(discount)}
											</Typography>
										</Stack>

										<Divider sx={{ my: 0.5 }} />

										<Stack direction="row" justifyContent="space-between" alignItems="baseline">
											<Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
												Total Amount
											</Typography>
											<Typography variant="h5" sx={{ fontWeight: 900 }}>
												{bookingsLoading ? '...' : formatMoney(total)}
											</Typography>
										</Stack>

										<FormControlLabel
											control={<Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />}
											label={
												<Typography variant="body2">
													I understand & agree with the <b>Terms & Conditions</b>
												</Typography>
											}
											sx={{ mt: 0.5, alignItems: 'flex-start' }}
										/>

										<Button
											fullWidth
											variant="contained"
											size="large"
											disabled={!isReadyToPay || carLoading || bookingsLoading || paying}
											onClick={onPay}
											sx={{
												mt: 1,
												borderRadius: 2.5,
												textTransform: 'none',
												fontWeight: 900,
												height: 48,
											}}
										>
											{paying ? 'Processing...' : 'Book Now'}
										</Button>
									</Stack>
								</Paper>

								{/* Small fallback loaders */}
								{(carLoading || bookingsLoading) && (
									<Paper sx={{ p: 2.25, borderRadius: 3 }}>
										<Skeleton width="60%" />
										<Skeleton />
										<Skeleton />
									</Paper>
								)}
							</Stack>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
