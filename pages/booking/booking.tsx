import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

type BookingItem = {
	id: string;
	title: string;
	category: string;
	image: string;
	price: number;
	specs: string[];
	benefits: string[];
};

const cars: BookingItem[] = [
	{
		id: 'hyundai',
		title: 'Hyundai i30',
		category: 'Compact',
		image: '/img/cars/hyundai-motor-group-DxysNzamx4g-unsplash.jpg',
		price: 2500,
		specs: ['5 seats', '2 bags', '5 doors', 'Manual', 'A/C'],
		benefits: ['Mileage: 1400 miles per rental', 'Collision Damage Waiver', 'Airport surcharge', 'VAT (value added tax)'],
	},
	{
		id: 'fiat',
		title: 'Fiat 500',
		category: 'Economy',
		image: '/img/cars/josh-berquist-_4sWbzH5fp8-unsplash.jpg',
		price: 1800,
		specs: ['4 seats', '1 bag', '2 doors', 'Manual', 'A/C'],
		benefits: ['Mileage: 665 miles per rental', 'Roadside Assistance', 'VAT included'],
	},
	{
		id: 'skoda',
		title: 'Skoda Octavia',
		category: 'Standard',
		image: '/img/cars/serjan-midili-Hjl6WPNNI_c-unsplash.jpg',
		price: 3000,
		specs: ['5 seats', '2 bags', '5 doors', 'Automatic', 'A/C'],
		benefits: ['Unlimited mileage', 'Free cancellation', 'Online check-in available'],
	},
];

const Booking = () => {
	const router = useRouter();
	const { id } = router.query;

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
							{cars.map((car) => (
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
												<span>${car.price.toLocaleString()}</span>
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
											<button className="book-btn">Book now</button>
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
