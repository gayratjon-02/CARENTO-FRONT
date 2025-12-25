import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useLazyQuery, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { GET_CAR, GET_MY_BOOKINGS } from '../../apollo/user/query';
import { Direction } from '../../libs/enums/common.enum';
import { REACT_APP_API_URL } from '../../libs/config';

type BookingRecord = {
	_id: string;
	carId: string;
	agentId?: string | null;
	userId?: string | null;
	startDate?: string | null;
	endDate?: string | null;
	totalPrice?: number | null;
	bookingStatus?: string | null;
	paymentStatus?: string | null;
};

type CarRecord = {
	_id: string;
	carTitle?: string;
	carType?: string;
	carImages?: string[];
	seats?: number;
	doors?: number;
	brandType?: string;
	transmission?: string;
	fuelType?: string;
	pricePerDay?: number;
};

const fmtDate = (v?: string | null) => {
	if (!v) return '—';
	const d = new Date(v);
	if (Number.isNaN(d.getTime())) return '—';
	return d.toLocaleDateString();
};

const Booking = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { id } = router.query;
	const [bookings, setBookings] = useState<BookingRecord[]>([]);
	const [carsMap, setCarsMap] = useState<Record<string, CarRecord>>({});

	const [fetchCar] = useLazyQuery(GET_CAR, { fetchPolicy: 'cache-first' });

	const { loading: bookingsLoading } = useQuery(GET_MY_BOOKINGS, {
		variables: {
			input: {
				page: 1,
				limit: 30,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {},
			},
		},
		skip: !user?._id,
		onCompleted: async (data) => {
			const list = data?.getMyBookings?.list ?? [];
			setBookings(list);
			await hydrateCars(list);
		},
	});

	const hydrateCars = async (list: BookingRecord[]) => {
		const missingIds = list.map((b) => b.carId).filter((cid) => cid && !carsMap[cid]);
		if (!missingIds.length) return;

		const results = await Promise.all(
			missingIds.map(async (cid) => {
				try {
					const res = await fetchCar({ variables: { input: cid }, fetchPolicy: 'network-only' });
					const car = (res?.data as any)?.getCar as CarRecord | undefined;
					return car?._id ? car : null;
				} catch {
					return null;
				}
			}),
		);

		const nextMap: Record<string, CarRecord> = {};
		results.forEach((car) => {
			if (car?._id) nextMap[car._id] = car;
		});
		if (Object.keys(nextMap).length) {
			setCarsMap((prev) => ({ ...prev, ...nextMap }));
		}
	};

	const cards = useMemo(() => {
		if (!bookings.length) return [];
		return bookings.map((b) => {
			const car = carsMap[b.carId];
			const firstImage = Array.isArray(car?.carImages) && car?.carImages[0] ? `${REACT_APP_API_URL}/${car!.carImages![0]}` : '/img/cars/hero-car.jpg';
			const specs: string[] = [];
			if (car?.seats) specs.push(`${car.seats} seats`);
			if (car?.doors) specs.push(`${car.doors} doors`);
			if (car?.transmission) specs.push(car.transmission);
			if (car?.fuelType) specs.push(car.fuelType);

			return {
				id: b._id,
				carId: b.carId,
				title: car?.carTitle || 'Booked car',
				category: car?.carType || '—',
				image: firstImage,
				price: b.totalPrice ?? car?.pricePerDay ?? 0,
				specs: specs.length ? specs : ['Details pending'],
				benefits: [
					`Start: ${fmtDate(b.startDate)}`,
					`End: ${fmtDate(b.endDate)}`,
					`Status: ${b.bookingStatus ?? '—'}`,
					`Payment: ${b.paymentStatus ?? '—'}`,
				],
			};
		});
	}, [bookings, carsMap]);

	return (
		<>
			<Head>
				<title>Carento | Booking</title>
			</Head>
			<div className="booking-page">
				<div className="booking-hero">
					<div className="hero-text">
						<p className="eyebrow">Book a car / No advance payment</p>
						<h2>Pick, compare, and drive.</h2>
						<p className="sub">Tailored filters, transparent pricing, and quick online confirmation.</p>
					</div>
					<div className="hero-badge">Trip ID: {id ?? '—'}</div>
				</div>

				<div className="booking-layout">
					<aside className="filters">
						<h4>Filter cars by</h4>
						<ul>
							<li>Car Type</li>
							<li>Customer recommendation</li>
							<li>Car Specifications</li>
							<li>Weekly price</li>
							<li>Number of seats</li>
							<li>Supplier rating</li>
							<li>Payment type</li>
							<li>Mileage</li>
						</ul>
						<div className="map-placeholder">Map preview</div>
					</aside>

					<section className="booking-content">
						<div className="search-bar">
							<div className="field">
								<label>Car Brand</label>
								<select>
									<option>Any</option>
									<option>BMW</option>
									<option>Hyundai</option>
									<option>Tesla</option>
								</select>
							</div>
							<div className="field">
								<label>Pick-up location</label>
								<input placeholder="New York, USA" />
							</div>
							<div className="field">
								<label>Pick-up date</label>
								<input type="date" />
							</div>
							<div className="field">
								<label>Drop-off date</label>
								<input type="date" />
							</div>
							<button className="search-btn">Search car now</button>
						</div>

						<div className="cards">
							{!user?._id && <div className="empty">Please login to view your bookings.</div>}
							{user?._id && bookingsLoading && <div className="empty">Loading bookings…</div>}
							{user?._id && !bookingsLoading && !cards.length && <div className="empty">No bookings yet.</div>}
							{cards.map((car) => (
								<div className="card" key={car.id}>
									<div className="card__media">
										<img src={car.image} alt={car.title} />
									</div>
									<div className="card__body">
										<div className="card__header">
											<div>
												<h3>{car.title}</h3>
												<span className="badge badge-muted">{car.category}</span>
											</div>
											<div className="price">
												<span>${(car.price || 0).toLocaleString()}</span>
												<small>Cost of rental</small>
											</div>
										</div>

										<div className="card__specs">
											{car.specs.map((s) => (
												<span className="pill" key={s}>
													{s}
												</span>
											))}
										</div>

										<div className="card__benefits">
											{car.benefits.map((b) => (
												<div className="benefit" key={b}>
													<span className="tick">✓</span>
													{b}
												</div>
											))}
										</div>

										<div className="card__footer">
											<div className="perks">
												<span className="perk">Free cancellation</span>
												<span className="perk">Online check-in</span>
											</div>
											<button className="book-btn" onClick={() => router.push(`/booking/booking?id=${car.carId || car.id}`)}>
												View booking
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</section>
				</div>
			</div>
		</>
	);
};

export default Booking;
