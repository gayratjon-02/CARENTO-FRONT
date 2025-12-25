import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Stack, Box, Button, Chip } from '@mui/material';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AirlineSeatReclineNormalRoundedIcon from '@mui/icons-material/AirlineSeatReclineNormalRounded';
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded';

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

const Booking: NextPage = () => {
	return (
		<>
			<Head>
				<title>Carento | Booking</title>
			</Head>
			<div className="booking-page">
				<Stack className="booking-layout">
					<Stack className="filters">
						<h4>Filter Cars By</h4>
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
					</Stack>

					<Stack className="content">
						<Box className="search-bar">
							<Box className="field">
								<span>Car Brand</span>
								<select>
									<option>Any</option>
									<option>BMW</option>
									<option>Hyundai</option>
									<option>Tesla</option>
								</select>
							</Box>
							<Box className="field">
								<span>Pick-up location</span>
								<Box className="input-like">
									<LocationOnRoundedIcon />
									<input placeholder="New York, USA" />
								</Box>
							</Box>
							<Box className="field">
								<span>Pick-up date</span>
								<Box className="input-like">
									<CalendarMonthRoundedIcon />
									<input placeholder="Select date" />
								</Box>
							</Box>
							<Box className="field">
								<span>Drop-off date</span>
								<Box className="input-like">
									<CalendarMonthRoundedIcon />
									<input placeholder="Select date" />
								</Box>
							</Box>
							<Button className="search-btn" variant="contained">
								Search car now
							</Button>
						</Box>

						<Stack className="list">
							{cars.map((car) => (
								<Box key={car.id} className="card">
									<Box className="card-body">
										<div className="thumb">
											<img src={car.image} alt={car.title} />
										</div>
										<div className="info">
											<h5>{car.title}</h5>
											<span className="category">{car.category}</span>
											<div className="specs">
												{car.specs.map((s) => (
													<Chip key={s} label={s} />
												))}
											</div>
											<ul className="benefits">
												{car.benefits.map((b) => (
													<li key={b}>
														<CheckRoundedIcon /> {b}
													</li>
												))}
											</ul>
										</div>
										<div className="pricing">
											<div className="price">${car.price.toLocaleString()}</div>
											<small>Cost of rental</small>
											<div className="perks">
												<Chip label="Free cancellation" />
												<Chip label="Online check-in" />
											</div>
											<Button className="book-btn" variant="contained">
												Book now
											</Button>
										</div>
									</Box>
								</Box>
							))}
						</Stack>
					</Stack>
				</Stack>
			</div>

			<style jsx>{`
				.booking-page {
					padding: 30px 0 60px;
					background: linear-gradient(180deg, #f7f8fb 0%, #f0f2f8 60%, #ffffff 100%);
					min-height: 100vh;
				}
				.booking-layout {
					max-width: 1400px;
					margin: 0 auto;
					padding: 0 20px;
					flex-direction: row;
					gap: 18px;
				}
				.filters {
					flex: 0 0 240px;
					background: #fff;
					border: 1px solid #e5e7eb;
					border-radius: 12px;
					padding: 16px;
					box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
					height: fit-content;
				}
				.filters h4 {
					margin: 0 0 12px;
					font-size: 15px;
					text-transform: uppercase;
					letter-spacing: 0.5px;
					color: #374151;
				}
				.filters ul {
					list-style: none;
					padding: 0;
					margin: 0 0 20px;
					display: grid;
					gap: 10px;
					color: #4b5563;
					font-size: 14px;
				}
				.filters li {
					display: flex;
					align-items: center;
					gap: 8px;
				}
				.filters li::before {
					content: '▾';
					color: #f3b018;
					font-size: 12px;
				}
				.map-placeholder {
					height: 120px;
					border-radius: 10px;
					background: linear-gradient(135deg, #e5e7eb, #f3f4f6);
					display: flex;
					align-items: center;
					justify-content: center;
					color: #6b7280;
					font-size: 13px;
				}

				.content {
					flex: 1;
					gap: 18px;
				}
				.search-bar {
					display: grid;
					grid-template-columns: repeat(5, minmax(0, 1fr));
					gap: 12px;
					background: #fff;
					border: 1px solid #e5e7eb;
					border-radius: 12px;
					padding: 14px;
					align-items: end;
					box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
				}
				.field {
					display: flex;
					flex-direction: column;
					gap: 6px;
					font-size: 13px;
					color: #4b5563;
				}
				select,
				.input-like {
					height: 40px;
					border-radius: 10px;
					border: 1px solid #e5e7eb;
					background: #f9fafb;
					padding: 0 10px;
					display: flex;
					align-items: center;
					gap: 8px;
					color: #374151;
					font-size: 13px;
				}
				input {
					border: none;
					outline: none;
					background: transparent;
					flex: 1;
					font-size: 13px;
					color: #111827;
				}
				.search-btn {
					height: 40px;
					border-radius: 10px;
					background: #f3b018;
					color: #111827;
					font-weight: 700;
					text-transform: uppercase;
				}
				.list {
					display: flex;
					flex-direction: column;
					gap: 14px;
				}
				.card {
					background: #fff;
					border: 1px solid #e5e7eb;
					border-radius: 12px;
					box-shadow: 0 12px 32px rgba(15, 23, 42, 0.07);
					padding: 12px;
				}
				.card-body {
					display: grid;
					grid-template-columns: 220px 1fr 180px;
					gap: 18px;
					align-items: center;
				}
				.thumb {
					border-radius: 12px;
					overflow: hidden;
					background: #f9fafb;
					border: 1px solid #eef2f7;
				}
				.thumb img {
					width: 100%;
					height: 140px;
					object-fit: cover;
				}
				.info h5 {
					margin: 0;
					font-size: 18px;
					color: #0f172a;
				}
				.category {
					display: inline-block;
					color: #6b7280;
					font-size: 12px;
					margin-bottom: 8px;
				}
				.specs {
					display: flex;
					flex-wrap: wrap;
					gap: 6px;
					margin-bottom: 10px;
				}
				.benefits {
					list-style: none;
					padding: 0;
					margin: 0;
					display: grid;
					gap: 6px;
					color: #374151;
					font-size: 13px;
				}
				.benefits li {
					display: flex;
					align-items: center;
					gap: 6px;
				}
				.benefits svg {
					color: #f3b018;
				}
				.pricing {
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					gap: 8px;
				}
				.price {
					font-size: 26px;
					font-weight: 700;
					color: #0f172a;
				}
				.perks {
					display: grid;
					gap: 6px;
					width: 100%;
				}
				.perks :global(.MuiChip-root) {
					background: #fef3c7;
					color: #92400e;
					border-radius: 8px;
				}
				.book-btn {
					background: #f3b018;
					color: #111827;
					font-weight: 700;
					border-radius: 10px;
					padding: 10px 16px;
					text-transform: uppercase;
				}

				@media (max-width: 1100px) {
					.booking-layout {
						flex-direction: column;
					}
					.filters {
						width: 100%;
						flex: 1;
						display: grid;
						grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
						gap: 12px;
					}
					.search-bar {
						grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
					}
					.card-body {
						grid-template-columns: 1fr;
					}
					.thumb img {
						height: 200px;
					}
					.pricing {
						align-items: flex-start;
					}
				}
			`}</style>
		</>
	);
};

export default Booking;
