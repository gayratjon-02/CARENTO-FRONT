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
				<Stack className={'info'}>
					<h3>Premium Brands</h3>
					<p>Unveil the finest selection of high-end vehicles</p>
				</Stack>

				<Stack className={'brand-grid'}>
					{BRANDS.map((brand) => (
						<Stack key={brand.name} className={'brand-card'}>
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
