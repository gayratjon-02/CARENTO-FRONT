import React, { MouseEvent, useMemo, useState } from 'react';
import { Box, Button, Checkbox, Divider, Menu, MenuItem, OutlinedInput, Stack } from '@mui/material';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { BrandType, CarLocation, CarType, FuelType, Transmission } from '../../enum/car.enum';
import { formatEnumValue } from '../../utils';
import { CarsInquiry } from 'libs/types/car/cars.input';
import { useTranslation } from 'next-i18next';

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
	const rangeKeys = ['pricePerDay', 'pricePerHour', 'mileage'] as const;
	rangeKeys.forEach((k) => {
		const r = next[k];
		if (!r) return;
		const hasStart = typeof r?.start === 'number' && !Number.isNaN(r.start);
		const hasEnd = typeof r?.end === 'number' && !Number.isNaN(r.end);
		if (!hasStart && !hasEnd) delete next[k];
	});
	return next;
};

type FilterKey = keyof Pick<
	Search,
	'brandType' | 'carType' | 'fuelType' | 'transmission' | 'seats' | 'carLocation' | 'year' | 'pricePerDay'
>;

const CarFilter = (props: CarFilterProps) => {
	const { value, onChange, onReset } = props;
	const search = (value?.search ?? {}) as Search;
	const { t } = useTranslation('common');

	const [openKey, setOpenKey] = useState<FilterKey | null>(null);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [priceDraft, setPriceDraft] = useState<{ start: string; end: string }>({ start: '', end: '' });

	const activeCount = useMemo(() => {
		const listKeys: FilterKey[] = ['brandType', 'carType', 'fuelType', 'transmission', 'seats', 'carLocation', 'year'];
		const listCount = listKeys.reduce((acc, k) => acc + (Array.isArray((search as any)[k]) ? (search as any)[k].length : 0), 0);
		const hasPrice =
			typeof (search as any)?.pricePerDay?.start === 'number' ||
			typeof (search as any)?.pricePerDay?.end === 'number';
		return listCount + (hasPrice ? 1 : 0);
	}, [search]);

	const setSearch = (nextSearch: Search) => {
		onChange({ ...value, page: 1, search: withCleanSearch(nextSearch) });
	};

	const openMenu = (key: FilterKey) => (e: MouseEvent<HTMLElement>) => {
		setOpenKey(key);
		setAnchorEl(e.currentTarget);
		if (key === 'pricePerDay') {
			const r = (search as any)?.pricePerDay;
			setPriceDraft({
				start: typeof r?.start === 'number' ? String(r.start) : '',
				end: typeof r?.end === 'number' ? String(r.end) : '',
			});
		}
	};

	const closeMenu = () => {
		setOpenKey(null);
		setAnchorEl(null);
	};

	const selectedCount = (key: FilterKey) => {
		if (key === 'pricePerDay') {
			const r = (search as any)?.pricePerDay;
			const hasStart = typeof r?.start === 'number' && !Number.isNaN(r.start);
			const hasEnd = typeof r?.end === 'number' && !Number.isNaN(r.end);
			return hasStart || hasEnd ? 1 : 0;
		}
		return Array.isArray((search as any)[key]) ? (search as any)[key].length : 0;
	};

	const toggle = (key: FilterKey, valueToToggle: any) => {
		setSearch({ ...search, [key]: toggleArrayValue((search as any)[key], valueToToggle) } as any);
	};

	const renderLabel = (key: FilterKey) => {
		if (key === 'pricePerDay') {
			const r = (search as any)?.pricePerDay;
			const hasStart = typeof r?.start === 'number' && !Number.isNaN(r.start);
			const hasEnd = typeof r?.end === 'number' && !Number.isNaN(r.end);
			if (hasStart || hasEnd) {
				const start = hasStart ? r.start : 0;
				const end = hasEnd ? r.end : 999999;
				const endLabel = end >= 999999 ? '∞' : end;
				return `${labels[key]} ${start}–${endLabel}`;
			}
			return labels[key];
		}
		const c = selectedCount(key);
		if (c > 0) return `${labels[key]} (${c})`;
		return labels[key];
	};

	const labels: Record<FilterKey, string> = {
		brandType: t('Brand', { defaultValue: 'Brand' }),
		carType: t('Type', { defaultValue: 'Type' }),
		fuelType: t('Fuel', { defaultValue: 'Fuel' }),
		transmission: t('Transmission', { defaultValue: 'Transmission' }),
		seats: t('Seats', { defaultValue: 'Seats' }),
		carLocation: t('Location', { defaultValue: 'Location' }),
		year: t('Year', { defaultValue: 'Year' }),
		pricePerDay: t('Price/day', { defaultValue: 'Price/day' }),
	};

	const options: Record<FilterKey, any[]> = {
		brandType: Object.values(BrandType),
		carType: Object.values(CarType),
		fuelType: Object.values(FuelType),
		transmission: Object.values(Transmission),
		seats: [2, 4, 5, 7, 8],
		carLocation: Object.values(CarLocation),
		year: [2015, 2018, 2020, 2022, 2024, 2025, 2026],
		pricePerDay: [],
	};

	const optionLabel = (key: FilterKey, v: any) => {
		if (key === 'seats') return `${v}`;
		if (key === 'year') return `${v}`;
		return formatEnumValue(String(v));
	};

	const applyPriceRange = () => {
		const rawStart = priceDraft.start.trim();
		const rawEnd = priceDraft.end.trim();
		const start = rawStart === '' ? undefined : Number(rawStart);
		const end = rawEnd === '' ? undefined : Number(rawEnd);

		const hasStart = typeof start === 'number' && !Number.isNaN(start);
		const hasEnd = typeof end === 'number' && !Number.isNaN(end);

		if (!hasStart && !hasEnd) {
			setSearch({ ...search, pricePerDay: undefined } as any);
			closeMenu();
			return;
		}

		const safeStart = hasStart ? start : 0;
		const safeEnd = hasEnd ? end : 999999;

		setSearch({ ...search, pricePerDay: { start: safeStart, end: safeEnd } } as any);
		closeMenu();
	};

	const pricePresets = [
		{ label: 'Any', value: null as any },
		{ label: '0–50', value: { start: 0, end: 50 } },
		{ label: '50–100', value: { start: 50, end: 100 } },
		{ label: '100–200', value: { start: 100, end: 200 } },
		{ label: '200–300', value: { start: 200, end: 300 } },
		{ label: '300+', value: { start: 300, end: 999999 } },
	];

	return (
		<Stack className="car-filterbar">
			<Box className="car-filterbar__row">
				<Box className="car-filterbar__left">
					{(Object.keys(labels) as FilterKey[]).map((k) => (
						<Button
							key={k}
							className={`filter-pill ${selectedCount(k) > 0 ? 'active' : ''}`}
							onClick={openMenu(k)}
							endIcon={<KeyboardArrowDownRoundedIcon />}
						>
							{renderLabel(k)}
						</Button>
					))}
				</Box>

				<Box className="car-filterbar__right">
					{activeCount > 0 && (
						<span className="active-count">
							{t('{{count}} selected', { count: activeCount, defaultValue: `${activeCount} selected` })}
						</span>
					)}
					<Button className="reset" onClick={onReset} startIcon={<RestartAltRoundedIcon />}>
						{t('Reset', { defaultValue: 'Reset' })}
					</Button>
				</Box>
			</Box>

			<Menu
				anchorEl={anchorEl}
				open={Boolean(openKey)}
				onClose={closeMenu}
				PaperProps={{ className: 'car-filterbar__menu' }}
			>
				{openKey && (
					<Box className="menu-head">
						<strong>{labels[openKey]}</strong>
						<span>
							{openKey === 'pricePerDay'
								? t('Set a range', { defaultValue: 'Set a range' })
								: t('Select one or multiple', { defaultValue: 'Select one or multiple' })}
						</span>
					</Box>
				)}
				<Divider />
				{openKey === 'pricePerDay' && (
					<Box className="price-menu" onClick={(e) => e.stopPropagation()}>
						<Box className="preset-row">
							{pricePresets.map((p) => (
								<Button
									key={p.label}
									className="preset"
									onClick={() => {
										if (!p.value) {
											setSearch({ ...search, pricePerDay: undefined } as any);
											closeMenu();
											return;
										}
										setSearch({ ...search, pricePerDay: { start: p.value.start, end: p.value.end } } as any);
										closeMenu();
									}}
								>
									{t(p.label, { defaultValue: p.label })}
								</Button>
							))}
						</Box>

						<Box className="price-grid">
							<Box className="field">
								<label>{t('Min', { defaultValue: 'Min' })}</label>
								<OutlinedInput
									value={priceDraft.start}
									onChange={(e) => setPriceDraft((prev) => ({ ...prev, start: e.target.value }))}
									placeholder="0"
									inputProps={{ inputMode: 'numeric' }}
								/>
							</Box>
							<Box className="field">
								<label>{t('Max', { defaultValue: 'Max' })}</label>
								<OutlinedInput
									value={priceDraft.end}
									onChange={(e) => setPriceDraft((prev) => ({ ...prev, end: e.target.value }))}
									placeholder="300"
									inputProps={{ inputMode: 'numeric' }}
								/>
							</Box>
						</Box>
						<Box className="price-actions">
							<Button className="apply" onClick={applyPriceRange}>
								{t('Apply', { defaultValue: 'Apply' })}
							</Button>
						</Box>
					</Box>
				)}

				{openKey &&
					openKey !== 'pricePerDay' &&
					options[openKey].map((opt) => {
						const isActive = Array.isArray((search as any)[openKey]) && (search as any)[openKey].some((x: any) => String(x) === String(opt));
						return (
							<MenuItem
								key={String(opt)}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									toggle(openKey, opt);
									closeMenu();
								}}
								disableRipple
								className={`menu-item ${isActive ? 'active' : ''}`}
							>
								<Checkbox checked={isActive} />
								<span>{optionLabel(openKey, opt)}</span>
							</MenuItem>
						);
					})}
			</Menu>
		</Stack>
	);
};

export default CarFilter;
