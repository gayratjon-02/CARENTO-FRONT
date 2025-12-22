import React, { useMemo } from 'react';
import { Box, Button, Divider, Stack } from '@mui/material';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { BrandType, CarLocation, CarType, FuelType, Transmission } from '../../enum/car.enum';
import { formatEnumValue } from '../../utils';
import { CarsInquiry } from '../../types/property/property.input';

type Search = CarsInquiry['search'] & {
	carLocation?: CarLocation[];
	carType?: CarType[];
	brandType?: BrandType[];
	fuelType?: FuelType[];
	transmission?: Transmission[];
	seats?: number[];
	year?: number[];
};

interface CarFilterProps {
	value: CarsInquiry;
	onChange: (next: CarsInquiry) => void;
	onReset: () => void;
}

const toggleArrayValue = <T,>(arr: T[] | undefined, v: T): T[] => {
	const next = Array.isArray(arr) ? [...arr] : [];
	const idx = next.findIndex((x) => String(x) === String(v));
	if (idx >= 0) next.splice(idx, 1);
	else next.push(v);
	return next;
};

const withCleanSearch = (search: Search): Search => {
	const next: any = { ...search };
	Object.keys(next).forEach((k) => {
		if (Array.isArray(next[k]) && next[k].length === 0) delete next[k];
	});
	return next;
};

const CarFilter = (props: CarFilterProps) => {
	const { value, onChange, onReset } = props;

	const search = (value?.search ?? {}) as Search;

	const activeCount = useMemo(() => {
		const keys = ['carLocation', 'carType', 'brandType', 'fuelType', 'transmission', 'seats', 'year'] as const;
		return keys.reduce((acc, k) => acc + (Array.isArray((search as any)[k]) ? (search as any)[k].length : 0), 0);
	}, [search]);

	const setSearch = (nextSearch: Search) => {
		onChange({ ...value, page: 1, search: withCleanSearch(nextSearch) });
	};

	const chipGroup = <T,>(
		key: keyof Search,
		label: string,
		options: T[],
		selected?: T[],
		render?: (v: T) => string,
	) => (
		<Box className="car-filter__group">
			<Box className="car-filter__label">{label}</Box>
			<Box className="car-filter__chips">
				{options.map((opt) => {
					const isActive = Array.isArray(selected) && selected.some((x) => String(x) === String(opt));
					return (
						<Button
							key={String(opt)}
							className={`chip ${isActive ? 'active' : ''}`}
							onClick={() => setSearch({ ...search, [key]: toggleArrayValue(selected as any, opt) } as any)}
						>
							{render ? render(opt) : String(opt)}
						</Button>
					);
				})}
			</Box>
		</Box>
	);

	return (
		<Stack className="car-filter">
			<Box className="car-filter__header">
				<Box className="title">
					<TuneRoundedIcon />
					<span>Filters</span>
					{activeCount > 0 && <small>{activeCount}</small>}
				</Box>
				<Button className="reset" onClick={onReset} startIcon={<RestartAltRoundedIcon />}>
					Reset
				</Button>
			</Box>

			<Divider />

			{chipGroup('brandType', 'Brand', Object.values(BrandType), search.brandType, (v) => formatEnumValue(String(v)))}
			{chipGroup('carType', 'Type', Object.values(CarType), search.carType, (v) => formatEnumValue(String(v)))}
			{chipGroup('fuelType', 'Fuel', Object.values(FuelType), search.fuelType, (v) => formatEnumValue(String(v)))}
			{chipGroup(
				'transmission',
				'Transmission',
				Object.values(Transmission),
				search.transmission,
				(v) => formatEnumValue(String(v)),
			)}
			{chipGroup('seats', 'Seats', [2, 4, 5, 7, 8], search.seats, (v) => `${v}`)}
			{chipGroup('carLocation', 'Location', Object.values(CarLocation), search.carLocation, (v) => formatEnumValue(String(v)))}
			{chipGroup('year', 'Year', [2015, 2018, 2020, 2022, 2024], search.year, (v) => `${v}`)}
		</Stack>
	);
};

export default CarFilter;
