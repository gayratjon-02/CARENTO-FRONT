import React from 'react';
import { Stack, Button, IconButton } from '@mui/material';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { CarType } from '../../enum/car.enum';

type CarTypeCard = {
	type: CarType;
	label: string;
	count: number;
	thumb?: string;
	gradient: string;
};

const CAR_TYPE_CARDS: CarTypeCard[] = [
	{ type: CarType.SUV, label: 'SUV', count: 180, gradient: 'var(--card-grad-1)', thumb: '/img/types/SUV.cms' },
	{ type: CarType.HATCHBACK, label: 'Hatchback', count: 24, gradient: 'var(--card-grad-2)', thumb: '/img/types/Hatchback.jpg' },
	{ type: CarType.SEDAN, label: 'Sedan', count: 16, gradient: 'var(--card-grad-3)', thumb: '/img/types/Sedan.jpeg' },
	{ type: CarType.CROSSOVER, label: 'Crossover', count: 150, gradient: 'var(--card-grad-4)', thumb: '/img/types/Crossover.jpg' },
	{ type: CarType.MINIVAN, label: 'Minivan', count: 25, gradient: 'var(--card-grad-5)', thumb: '/img/types/Minivan.jpg' },
	{ type: CarType.COUPE, label: 'Coupe', count: 56, gradient: 'var(--card-grad-6)', thumb: '/img/types/Coupe.jpeg' },
	{ type: CarType.SPORT, label: 'Sport Cars', count: 25, gradient: 'var(--card-grad-7)', thumb: '/img/types/Sport%20Cars.jpeg' },
	{ type: CarType.CONVERTIBLE, label: 'Convertible', count: 125, gradient: 'var(--card-grad-8)', thumb: '/img/types/Convertible.jpg' },
];

const ChooseByCarType = () => {
	return (
		<Stack className="choose-by-type">
			<Stack className="container">
				<Stack className="info">
					<div className="heading">
						<h3>Browse by Type</h3>
						<p>Find the perfect ride for any occasion</p>
					</div>
					<Button className="view-more" variant="contained" color="success" endIcon={<ArrowForwardIosRoundedIcon />}>
						View More
					</Button>
				</Stack>

				<div className="grid">
					{CAR_TYPE_CARDS.map((item) => (
						<div key={item.type} className="type-card">
							<div className="thumb" style={{ backgroundImage: item.thumb ? `url(${item.thumb})` : item.gradient }}>
								{!item.thumb && <span className="thumb-badge">{item.label}</span>}
							</div>
							<div className="card-body">
								<div className="title">{item.label}</div>
								<div className="card-footer">
									<span className="count-pill">{item.count} Vehicles</span>
									<IconButton size="small" className="arrow-btn" aria-label={`View ${item.label}`}>
										<ArrowForwardIosRoundedIcon fontSize="small" />
									</IconButton>
								</div>
							</div>
						</div>
					))}
				</div>
			</Stack>
		</Stack>
	);
};

export default ChooseByCarType;
