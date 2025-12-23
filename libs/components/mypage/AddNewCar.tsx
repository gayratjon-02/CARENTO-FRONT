import React, { DragEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import axios from 'axios';
import { getJwtToken } from '../../auth';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { CREATE_CAR, UPDATE_CAR } from '../../../apollo/user/mutation';
import { GET_CAR } from '../../../apollo/user/query';
import { BrandType, CarLocation, CarStatus, CarType, FuelType, Transmission } from '../../enum/car.enum';
import { REACT_APP_API_URL } from '../../config';
import { formatEnumValue } from '../../utils';
import { T } from '../../types/common';

type CarFormState = {
	carTitle: string;
	carDescription: string;
	brandType: BrandType | '';
	year: number | '';
	fuelType: FuelType | '';
	transmission: Transmission | '';
	seats: number | '';
	doors: number | '';
	mileage: number | '';
	engine: string;
	carType: CarType | '';
	carLocation: CarLocation | '';
	pricePerDay: number | '';
	pricePerHour: number | '';
	carImages: string[];
	carStatus?: CarStatus;
};

const AddCar = ({ initialValues }: { initialValues: CarFormState }) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [dragActive, setDragActive] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] = useState<CarFormState>(initialValues);

	const token = getJwtToken();
	const carId = typeof router.query.carId === 'string' ? router.query.carId : '';
	const isEditing = Boolean(carId);

	const yearOptions = useMemo(() => {
		const current = new Date().getFullYear();
		return Array.from({ length: 36 }, (_, idx) => current - idx);
	}, []);

	const seatsOptions = [2, 4, 5, 6, 7, 8, 9];
	const doorsOptions = [2, 3, 4, 5];

	/** APOLLO REQUESTS **/
	const [createCar] = useMutation(CREATE_CAR);
	const [updateCar] = useMutation(UPDATE_CAR);

	useQuery(GET_CAR, {
		fetchPolicy: 'network-only',
		skip: !isEditing,
		variables: { input: carId },
		onCompleted(data: T) {
			const car = data?.getCar;
			if (!car) return;
			setForm((prev) => ({
				...prev,
				carTitle: car?.carTitle ?? '',
				carDescription: car?.carDescription ?? '',
				brandType: car?.brandType ?? '',
				year: car?.year ?? '',
				fuelType: car?.fuelType ?? '',
				transmission: car?.transmission ?? '',
				seats: car?.seats ?? '',
				doors: car?.doors ?? '',
				mileage: car?.mileage ?? '',
				engine: car?.engine ?? '',
				carType: car?.carType ?? '',
				carLocation: car?.carLocation ?? '',
				pricePerDay: car?.pricePerDay ?? '',
				pricePerHour: car?.pricePerHour ?? '',
				carImages: Array.isArray(car?.carImages) ? car.carImages : [],
				carStatus: car?.carStatus ?? undefined,
			}));
		},
	});

	/** HELPERS **/
	const disabled = useMemo(() => {
		const hasBasics =
			form.carTitle.trim() &&
			form.brandType &&
			form.year &&
			form.fuelType &&
			form.transmission &&
			form.seats &&
			form.doors &&
			form.mileage !== '' &&
			form.carType &&
			form.carLocation;

		const hasPricing = form.pricePerDay !== '' && form.pricePerHour !== '';
		const hasImages = Array.isArray(form.carImages) && form.carImages.length > 0;

		return !(hasBasics && hasPricing && hasImages) || submitting;
	}, [form, submitting]);

	const uploadFiles = async (filesInput: FileList | File[]) => {
		try {
			if (!token) throw new Error('Please login first.');

			const files = Array.from(filesInput ?? []);
			if (files.length === 0) return;
			const maxImages = 5;
			if (files.length > maxImages) throw new Error(`Cannot upload more than ${maxImages} images at once.`);
			if ((form.carImages?.length ?? 0) + files.length > maxImages) {
				throw new Error(`You can upload up to ${maxImages} images total.`);
			}

			const formData = new FormData();
			const variables = { files: new Array(files.length).fill(null), target: 'cars' };
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
				  }`,
					variables,
				}),
			);

			const map: Record<string, string[]> = {};
			files.forEach((_, idx) => {
				map[String(idx)] = [`variables.files.${idx}`];
			});
			formData.append('map', JSON.stringify(map));
			files.forEach((file, idx) => {
				formData.append(String(idx), file);
			});

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const uploaded = response?.data?.data?.imagesUploader ?? [];
			if (!Array.isArray(uploaded)) return;

			setForm((prev) => ({ ...prev, carImages: [...(prev.carImages ?? []), ...uploaded] }));
		} catch (err: any) {
			console.log('uploadFiles err:', err.message);
			await sweetMixinErrorAlert(err.message);
		}
	};

	const onBrowseClick = () => inputRef.current?.click();

	const onFileChange = async () => {
		const files = inputRef.current?.files;
		if (!files?.length) return;
		await uploadFiles(files);
		if (inputRef.current) inputRef.current.value = '';
	};

	const onDrop = async (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragActive(false);
		if (e.dataTransfer?.files?.length) await uploadFiles(e.dataTransfer.files);
	};

	const removeImage = (idx: number) => setForm((prev) => ({ ...prev, carImages: prev.carImages.filter((_, i) => i !== idx) }));

	const submitHandler = useCallback(async () => {
		try {
			if (!token) throw new Error('Please login first.');

			setSubmitting(true);

			const input: any = {
				carTitle: form.carTitle.trim(),
				carDescription: form.carDescription?.trim() || '',
				brandType: form.brandType,
				year: Number(form.year),
				fuelType: form.fuelType,
				transmission: form.transmission,
				seats: Number(form.seats),
				doors: Number(form.doors),
				mileage: Number(form.mileage),
				engine: form.engine?.trim() || undefined,
				carType: form.carType,
				carLocation: form.carLocation,
				carImages: form.carImages,
				pricePerDay: Number(form.pricePerDay),
				pricePerHour: Number(form.pricePerHour),
			};

			if (isEditing) {
				await updateCar({ variables: { input: { _id: carId, ...input } } });
				await sweetMixinSuccessAlert('Car updated successfully.');
			} else {
				const res = await createCar({ variables: { input } });
				await sweetMixinSuccessAlert('Car created successfully.');
				const createdId = res?.data?.createCar?._id as string | undefined;
				if (createdId) {
					await router.push({ pathname: '/car/detail', query: { id: createdId } });
					return;
				}
			}

			await router.push({ pathname: '/mypage', query: { category: 'myCars' } });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		} finally {
			setSubmitting(false);
		}
	}, [carId, createCar, form, isEditing, router, token, updateCar]);

	if (user?.memberType !== 'AGENT') return null;

	if (device === 'mobile') {
		return (
			<Box>
				<Stack spacing={1.5} sx={{ mb: 2 }}>
					<Typography sx={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.3 }}>{isEditing ? 'Edit Car' : 'Add Car'}</Typography>
					<Typography sx={{ color: 'text.secondary', fontSize: 13 }}>Create your listing in a minute.</Typography>
				</Stack>
				<Button variant="outlined" onClick={onBrowseClick} sx={{ mb: 1.5 }}>
					Upload photos ({form.carImages.length}/8)
				</Button>
				<input ref={inputRef} type="file" hidden multiple accept="image/jpg, image/jpeg, image/png" onChange={onFileChange} />
				<Button variant="contained" fullWidth disabled={disabled} onClick={submitHandler}>
					{submitting ? 'Saving...' : 'Save'}
				</Button>
			</Box>
		);
	}

	const coverImage = form.carImages?.[0] ? `${REACT_APP_API_URL}/${form.carImages[0]}` : '';
	const previewMeta = [
		form.brandType ? formatEnumValue(String(form.brandType)) : '',
		form.year ? String(form.year) : '',
		form.fuelType ? formatEnumValue(String(form.fuelType)) : '',
		form.transmission ? formatEnumValue(String(form.transmission)) : '',
	]
		.filter(Boolean)
		.join(' • ');

	return (
		<div id="add-car-page">
			<Stack className="addcar-header" direction="row" justifyContent="space-between" alignItems="flex-start">
				<Stack className="left">
					<Typography className="kicker">Listing</Typography>
					<Typography className="title">{isEditing ? 'Edit Car' : 'Add Car'}</Typography>
					<Typography className="desc">Create a clean, high-converting listing with great photos.</Typography>
				</Stack>
				<Stack className="right" alignItems="flex-end" spacing={1}>
					<Typography className="count">{form.carImages.length} photos</Typography>
					<Button className="primary" disabled={disabled} onClick={submitHandler}>
						{submitting ? 'Saving...' : isEditing ? 'Update' : 'Publish'}
					</Button>
				</Stack>
			</Stack>

			<div className="addcar-grid">
				<div className="panel media">
					<div className={`cover ${coverImage ? '' : 'empty'}`} style={coverImage ? { backgroundImage: `url(${coverImage})` } : undefined}>
						<div className="cover-overlay" />
						<div className="cover-badge">{form.carType ? formatEnumValue(String(form.carType)) : 'Car'}</div>
						<div className="cover-price">
							<span>From</span>
							<strong>${Number(form.pricePerDay || 0).toLocaleString()}</strong>
							<small>/day</small>
						</div>
					</div>

					<div className="cover-info">
						<strong className="name">{form.carTitle || 'Car title'}</strong>
						<span className="meta">{previewMeta || 'Brand • Year • Fuel • Transmission'}</span>
					</div>

					<div
						className={`dropzone ${dragActive ? 'active' : ''}`}
						onDragEnter={() => setDragActive(true)}
						onDragLeave={() => setDragActive(false)}
						onDragOver={(e) => e.preventDefault()}
						onDrop={onDrop}
					>
						<div className="dz-text">
							<strong>Upload photos</strong>
							<span>Drag & drop or browse (max 8)</span>
						</div>
						<Button className="browse" onClick={onBrowseClick}>
							Browse
						</Button>
						<input ref={inputRef} type="file" hidden multiple accept="image/jpg, image/jpeg, image/png" onChange={onFileChange} />
					</div>

					{form.carImages.length > 0 && (
						<div className="gallery">
							{form.carImages.map((img, idx) => {
								const imagePath = `${REACT_APP_API_URL}/${img}`;
								return (
									<div className="thumb" key={`${img}-${idx}`}>
										<img src={imagePath} alt="" />
										<button className="remove" type="button" onClick={() => removeImage(idx)} aria-label="Remove image">
											×
										</button>
									</div>
								);
							})}
						</div>
					)}
				</div>

				<div className="panel form">
					<div className="section">
						<div className="section-head">
							<strong>Basics</strong>
							<span>Title + description that sells the ride.</span>
						</div>
						<div className="field">
							<label>Title</label>
							<input
								value={form.carTitle}
								placeholder="e.g. BMW M5 Competition"
								onChange={(e) => setForm((prev) => ({ ...prev, carTitle: e.target.value }))}
							/>
						</div>
						<div className="field">
							<label>Description</label>
							<textarea
								value={form.carDescription}
								placeholder="Highlight comfort, features, condition, and pickup details..."
								onChange={(e) => setForm((prev) => ({ ...prev, carDescription: e.target.value }))}
							/>
						</div>
					</div>

					<div className="section">
						<div className="section-head">
							<strong>Specs</strong>
							<span>Help users filter and compare.</span>
						</div>
						<div className="row row-2">
							<div className="field">
								<label>Brand</label>
								<select
									value={form.brandType || ''}
									onChange={(e) => setForm((prev) => ({ ...prev, brandType: (e.target.value as BrandType) || '' }))}
								>
									<option value="" disabled>
										Select brand
									</option>
									{Object.values(BrandType).map((v) => (
										<option value={v} key={v}>
											{formatEnumValue(String(v))}
										</option>
									))}
								</select>
							</div>
							<div className="field">
								<label>Year</label>
								<select
									value={form.year === '' ? '' : String(form.year)}
									onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value ? Number(e.target.value) : '' }))}
								>
									<option value="" disabled>
										Select year
									</option>
									{yearOptions.map((y) => (
										<option value={y} key={y}>
											{y}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="row row-3">
							<div className="field">
								<label>Fuel</label>
								<select
									value={form.fuelType || ''}
									onChange={(e) => setForm((prev) => ({ ...prev, fuelType: (e.target.value as FuelType) || '' }))}
								>
									<option value="" disabled>
										Select fuel
									</option>
									{Object.values(FuelType).map((v) => (
										<option value={v} key={v}>
											{formatEnumValue(String(v))}
										</option>
									))}
								</select>
							</div>
							<div className="field">
								<label>Transmission</label>
								<select
									value={form.transmission || ''}
									onChange={(e) => setForm((prev) => ({ ...prev, transmission: (e.target.value as Transmission) || '' }))}
								>
									<option value="" disabled>
										Select transmission
									</option>
									{Object.values(Transmission).map((v) => (
										<option value={v} key={v}>
											{formatEnumValue(String(v))}
										</option>
									))}
								</select>
							</div>
							<div className="field">
								<label>Type</label>
								<select
									value={form.carType || ''}
									onChange={(e) => setForm((prev) => ({ ...prev, carType: (e.target.value as CarType) || '' }))}
								>
									<option value="" disabled>
										Select type
									</option>
									{Object.values(CarType).map((v) => (
										<option value={v} key={v}>
											{formatEnumValue(String(v))}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="row row-3">
							<div className="field">
								<label>Seats</label>
								<select
									value={form.seats === '' ? '' : String(form.seats)}
									onChange={(e) => setForm((prev) => ({ ...prev, seats: e.target.value ? Number(e.target.value) : '' }))}
								>
									<option value="" disabled>
										Select seats
									</option>
									{seatsOptions.map((v) => (
										<option value={v} key={v}>
											{v}
										</option>
									))}
								</select>
							</div>
							<div className="field">
								<label>Doors</label>
								<select
									value={form.doors === '' ? '' : String(form.doors)}
									onChange={(e) => setForm((prev) => ({ ...prev, doors: e.target.value ? Number(e.target.value) : '' }))}
								>
									<option value="" disabled>
										Select doors
									</option>
									{doorsOptions.map((v) => (
										<option value={v} key={v}>
											{v}
										</option>
									))}
								</select>
							</div>
							<div className="field">
								<label>Mileage (km)</label>
								<input
									type="number"
									min={0}
									value={form.mileage}
									onChange={(e) => setForm((prev) => ({ ...prev, mileage: e.target.value === '' ? '' : Number(e.target.value) }))}
								/>
							</div>
						</div>

						<div className="row row-2">
							<div className="field">
								<label>Location</label>
								<select
									value={form.carLocation || ''}
									onChange={(e) =>
										setForm((prev) => ({ ...prev, carLocation: (e.target.value as CarLocation) || '' }))
									}
								>
									<option value="" disabled>
										Select location
									</option>
									{Object.values(CarLocation).map((v) => (
										<option value={v} key={v}>
											{formatEnumValue(String(v))}
										</option>
									))}
								</select>
							</div>
							<div className="field">
								<label>Engine (optional)</label>
								<input
									value={form.engine}
									placeholder="e.g. 3.0L Turbo"
									onChange={(e) => setForm((prev) => ({ ...prev, engine: e.target.value }))}
								/>
							</div>
						</div>
					</div>

					<div className="section">
						<div className="section-head">
							<strong>Pricing</strong>
							<span>Set competitive rates.</span>
						</div>
						<div className="row row-2">
							<div className="field">
								<label>Price per day ($)</label>
								<input
									type="number"
									min={0}
									value={form.pricePerDay}
									onChange={(e) =>
										setForm((prev) => ({ ...prev, pricePerDay: e.target.value === '' ? '' : Number(e.target.value) }))
									}
								/>
							</div>
							<div className="field">
								<label>Price per hour ($)</label>
								<input
									type="number"
									min={0}
									value={form.pricePerHour}
									onChange={(e) =>
										setForm((prev) => ({ ...prev, pricePerHour: e.target.value === '' ? '' : Number(e.target.value) }))
									}
								/>
							</div>
						</div>
					</div>

					<div className="actions">
						<Button className="ghost" onClick={() => router.push({ pathname: '/mypage', query: { category: 'myCars' } })}>
							Cancel
						</Button>
						<Button className="primary" disabled={disabled} onClick={submitHandler}>
							{submitting ? 'Saving...' : isEditing ? 'Update car' : 'Publish car'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

AddCar.defaultProps = {
	initialValues: {
		carTitle: '',
		carDescription: '',
		brandType: '',
		year: '',
		fuelType: '',
		transmission: '',
		seats: '',
		doors: '',
		mileage: '',
		engine: '',
		carType: '',
		carLocation: '',
		pricePerDay: '',
		pricePerHour: '',
		carImages: [],
		carStatus: 'ACTIVE',
	},
};

export default AddCar;
