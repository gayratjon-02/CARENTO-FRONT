import { Stack } from '@mui/material';

const BRANDS = [
	{ name: 'BMW', logo: '/img/brands/bmw.png' },
	{ name: 'MERCEDES', logo: '/img/brands/MERCEDES.svg' },
	{ name: 'VOLKSWAGEN', logo: '/img/brands/VOLKSWAGEN.png' },
	{ name: 'JAGUAR', logo: '/img/brands/JAGUAR.png' },
	{ name: 'LEXUS', logo: '/img/brands/LEXUS.png' },
	{ name: 'AUDI', logo: '/img/brands/audi.png' },
	{ name: 'HONDA', logo: '/img/brands/HONDA.png' },
	{ name: 'KIA', logo: '/img/brands/KIA.webp' },
	{ name: 'HYUNDAI', logo: '/img/brands/HYUNDAI.png' },
	{ name: 'TESLA', logo: '/img/brands/TESLA.jpg' },
	{ name: 'CHEVROLET', logo: '/img/brands/CHEVROLET.png' },
	{ name: 'GENESIS', logo: '/img/brands/GENESIS.avif' },
];

const CarBrands = () => {
	return (
		<Stack className={'car-brands'}>
			<Stack className={'container'}>
				<Stack className={'info-row'}>
					<Stack className={'info-left'}>
						<h3>
							<span className="gradient-text">Premium Brands</span>
						</h3>
						<p>Unveil the finest selection of high-end vehicles</p>
						<div className="accent-bar" />
					</Stack>
				</Stack>

				<Stack className={'brand-grid'}>
					{BRANDS.map((brand) => (
						<Stack key={brand.name} className={'brand-card'}>
							<div className="ring"></div>
							<img src={brand.logo} alt={`${brand.name} logo`} loading="lazy" />
							<span className={'brand-name'}>{brand.name}</span>
						</Stack>
					))}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default CarBrands;
