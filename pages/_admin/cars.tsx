import Head from 'next/head';
import React, { useEffect, useMemo, useState } from 'react';
import AdminShell from '../../components/admin/AdminShell';

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';

import { useMutation, useQuery } from '@apollo/client';

import { GET_ALL_CARS_BY_ADMIN } from '../../apollo/admin/query';
import { REMOVE_CAR_BY_ADMIN, UPDATE_CAR_BY_ADMIN } from '../../apollo/admin/mutation';

type RangeKey = 'today' | '7d' | '30d';

type CarStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'INACTIVE';

type CarRow = {
	id: string;
	name: string;
	specs: string;
	status: CarStatus;
	pricePerDay: number;
	location: string;
	createdAt: string;
	rawStatus?: string; //
};

const normalizeStatus = (raw?: string): CarStatus => {
	const s = (raw || '').toUpperCase();

	// backend shu 4 tasidan birini qaytarsa — aynan o‘zi
	if (s === 'AVAILABLE' || s === 'RENTED' || s === 'MAINTENANCE' || s === 'INACTIVE') return s;

	if (s === 'ACTIVE') return 'AVAILABLE';
	if (s === 'DISABLED' || s === 'BLOCKED') return 'INACTIVE';

	return 'INACTIVE';
};

const AdminCarsPage = () => {
	const [range, setRange] = useState<RangeKey>('7d');
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState<'ALL' | CarStatus>('ALL');
	const [isMobile, setIsMobile] = useState(false);

	const [page] = useState(1);
	const limit = 50;

	useEffect(() => {
		const onResize = () => setIsMobile(window.innerWidth < 780);
		onResize();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	const queryInput = useMemo(
		() => ({
			page,
			limit,
			search: {},
		}),
		[page],
	);

	const { data, loading, error, refetch } = useQuery(GET_ALL_CARS_BY_ADMIN, {
		variables: { input: queryInput },
		fetchPolicy: 'cache-and-network',
		notifyOnNetworkStatusChange: true,
	});

	const [removeCarByAdmin, { loading: removing }] = useMutation(REMOVE_CAR_BY_ADMIN, {
		// listni yangilab olish uchun
		onCompleted: () => refetch(),
	});

	const [updateCarByAdmin, { loading: updating }] = useMutation(UPDATE_CAR_BY_ADMIN, {
		onCompleted: () => refetch(),
	});

	const carsFromApi: CarRow[] = useMemo(() => {
		const list = data?.getAllCarsByAdmin?.list ?? [];

		return list.map((c: any) => {
			const specsParts = [
				c?.brandType ? String(c.brandType) : null,
				c?.year ? String(c.year) : null,
				c?.fuelType ? String(c.fuelType) : null,
				c?.transmission ? String(c.transmission) : null,
				c?.seats ? `${c.seats} seats` : null,
			].filter(Boolean);

			return {
				id: c?._id,
				name: c?.carTitle ?? '—',
				specs: specsParts.length ? specsParts.join(' • ') : '—',
				status: normalizeStatus(c?.carStatus),
				rawStatus: c?.carStatus,
				pricePerDay: Number(c?.pricePerDay ?? 0),
				location: c?.carLocation ?? '—',
				createdAt: (c?.createdAt ?? '').slice(0, 10) || '—',
			};
		});
	}, [data]);

	const filtered = useMemo(() => {
		const s = search.trim().toLowerCase();

		return carsFromApi.filter((c) => {
			const matchesSearch = s
				? c.name.toLowerCase().includes(s) ||
				  c.location.toLowerCase().includes(s) ||
				  c.id.toLowerCase().includes(s) ||
				  c.specs.toLowerCase().includes(s) ||
				  (c.rawStatus || '').toLowerCase().includes(s)
				: true;

			const matchesStatus = status === 'ALL' ? true : c.status === status;

			return matchesSearch && matchesStatus;
		});
	}, [carsFromApi, search, status]);

	const styles: Record<string, React.CSSProperties> = {
		page: { display: 'flex', flexDirection: 'column', gap: 12 },

		filtersCard: {
			background: 'rgba(255,255,255,.92)',
			border: '1px solid rgba(16, 24, 40, 0.10)',
			borderRadius: 18,
			boxShadow: '0 10px 26px rgba(16,24,40,.08)',
			padding: 12,
			display: 'flex',
			flexWrap: 'wrap',
			gap: 10,
			alignItems: 'center',
			justifyContent: 'space-between',
		},

		left: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', flex: 1, minWidth: 260 },
		right: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' },

		inputWrap: { position: 'relative', minWidth: 260, flex: 1 },

		input: {
			height: 40,
			width: '100%',
			padding: '0 12px 0 40px',
			borderRadius: 14,
			border: '1px solid rgba(16, 24, 40, 0.12)',
			background: '#fff',
			outline: 'none',
			fontSize: 13.5,
			fontWeight: 800,
			color: '#0b1220',
			boxShadow: '0 6px 16px rgba(16,24,40,.06)',
		},

		inputIcon: {
			position: 'absolute',
			left: 12,
			top: '50%',
			transform: 'translateY(-50%)',
			color: '#667085',
			opacity: 0.9,
		},

		select: {
			height: 40,
			padding: '0 12px',
			borderRadius: 14,
			border: '1px solid rgba(16, 24, 40, 0.12)',
			background: '#fff',
			outline: 'none',
			fontSize: 13.5,
			fontWeight: 850,
			color: '#0b1220',
			boxShadow: '0 6px 16px rgba(16,24,40,.06)',
			cursor: 'pointer',
		},

		count: {
			height: 40,
			padding: '0 12px',
			borderRadius: 14,
			border: '1px solid rgba(79, 139, 255, 0.18)',
			background: 'rgba(79, 139, 255, 0.08)',
			fontSize: 13,
			fontWeight: 950,
			color: '#2b63ff',
			display: 'inline-flex',
			alignItems: 'center',
			whiteSpace: 'nowrap',
		},

		primaryBtn: {
			height: 40,
			padding: '0 12px',
			borderRadius: 14,
			border: '1px solid rgba(79, 139, 255, 0.22)',
			background: 'linear-gradient(135deg, rgba(79,139,255,.95), rgba(127,107,255,.95))',
			color: '#fff',
			fontSize: 13,
			fontWeight: 950,
			letterSpacing: -0.2,
			cursor: 'pointer',
			display: 'inline-flex',
			alignItems: 'center',
			gap: 8,
			boxShadow: '0 10px 22px rgba(79,139,255,.18)',
			opacity: loading ? 0.7 : 1,
		},

		card: {
			background: '#fff',
			border: '1px solid rgba(16, 24, 40, 0.10)',
			borderRadius: 18,
			boxShadow: '0 10px 26px rgba(16,24,40,.08)',
			overflow: 'hidden',
		},

		head: {
			padding: '14px 14px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: 10,
			borderBottom: '1px solid rgba(16, 24, 40, 0.08)',
			background: 'rgba(255,255,255,.92)',
		},

		h4: { margin: 0, fontSize: 13.5, fontWeight: 950, letterSpacing: -0.2, color: '#0b1220' },
		hint: { fontSize: 12.5, fontWeight: 800, color: '#667085' },

		empty: { padding: 18, fontSize: 13, fontWeight: 750, color: '#667085' },
		errorBox: { padding: 18, fontSize: 13, fontWeight: 750, color: '#b42318' },

		mobileList: { display: 'flex', flexDirection: 'column', gap: 10, padding: 12 },

		mobileItem: {
			border: '1px solid rgba(16, 24, 40, 0.10)',
			borderRadius: 16,
			background: '#fff',
			boxShadow: '0 10px 22px rgba(16,24,40,.06)',
			padding: 12,
			display: 'flex',
			flexDirection: 'column',
			gap: 10,
		},

		mobileTop: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },

		mobileTitle: {
			margin: 0,
			fontSize: 14,
			fontWeight: 950,
			letterSpacing: -0.25,
			color: '#0b1220',
			display: 'flex',
			alignItems: 'center',
			gap: 8,
		},

		mobileSub: { margin: 0, fontSize: 12.5, fontWeight: 750, color: '#667085' },
		mobileMeta: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
		mobileId: { fontSize: 12, fontWeight: 850, color: '#475467', letterSpacing: 0.2 },

		pill: {
			display: 'inline-flex',
			alignItems: 'center',
			gap: 7,
			padding: '5px 10px',
			borderRadius: 999,
			border: '1px solid rgba(16, 24, 40, 0.10)',
			fontSize: 12,
			fontWeight: 900,
			letterSpacing: 0.2,
		},

		dot: { width: 7, height: 7, borderRadius: 999 },

		actionBtn: {
			width: 34,
			height: 34,
			borderRadius: 12,
			border: '1px solid rgba(16, 24, 40, 0.10)',
			background: '#fff',
			cursor: 'pointer',
			display: 'grid',
			placeItems: 'center',
		},
	};

	const statusPill = (s: CarStatus) => {
		if (s === 'AVAILABLE')
			return { bg: 'rgba(16,185,129,.12)', border: 'rgba(16,185,129,.22)', fg: '#067647', dot: '#10b981' };
		if (s === 'RENTED')
			return { bg: 'rgba(79,139,255,.12)', border: 'rgba(79,139,255,.22)', fg: '#2b63ff', dot: '#4f8bff' };
		if (s === 'MAINTENANCE')
			return { bg: 'rgba(245,158,11,.14)', border: 'rgba(245,158,11,.25)', fg: '#92400e', dot: '#f59e0b' };
		return { bg: 'rgba(148,163,184,.16)', border: 'rgba(148,163,184,.26)', fg: '#334155', dot: '#94a3b8' };
	};

	const onRemove = async (carId: string) => {
		if (removing) return;
		const ok = window.confirm('Remove this car? This action may be irreversible.');
		if (!ok) return;

		await removeCarByAdmin({ variables: { input: carId } });
	};

	const onQuickToggleInactive = async (carId: string, current: CarStatus) => {
		if (updating) return;

		const next = current === 'INACTIVE' ? 'AVAILABLE' : 'INACTIVE';

		await updateCarByAdmin({
			variables: {
				input: {
					_id: carId,
					carStatus: next,
				},
			},
		});
	};

	return (
		<>
			<Head>
				<title>Carento Admin | Cars</title>
			</Head>

			<AdminShell
				title="Cars"
				subtitle="Fleet overview"
				range={range}
				onRangeChange={setRange}
				activePath="/_admin/cars"
			>
				<div style={styles.page}>
					{/* Filters */}
					<div style={styles.filtersCard}>
						<div style={styles.left}>
							<div style={styles.inputWrap}>
								<span style={styles.inputIcon}>
									<SearchIcon fontSize="small" />
								</span>
								<input
									style={styles.input}
									placeholder="Search by title, location, status, or ID"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>

							<select style={styles.select} value={status} onChange={(e) => setStatus(e.target.value as any)}>
								<option value="ALL">All status</option>
								<option value="AVAILABLE">Available</option>
								<option value="RENTED">Rented</option>
								<option value="MAINTENANCE">Maintenance</option>
								<option value="INACTIVE">Inactive</option>
							</select>
						</div>

						<div style={styles.right}>
							<span style={styles.count}>{loading ? 'Loading…' : `${filtered.length} results`}</span>
						</div>
					</div>

					{/* List */}
					<div style={styles.card}>
						<div style={styles.head}>
							<h4 style={styles.h4}>Fleet</h4>
							<span style={styles.hint}>
								{loading ? 'Fetching…' : 'Ready'} • Range: {range}
							</span>
						</div>

						{error ? (
							<div style={styles.errorBox}>
								<strong>Query error</strong>
								<div style={{ marginTop: 6 }}>{error.message}</div>
							</div>
						) : loading && carsFromApi.length === 0 ? (
							<div style={styles.empty}>Loading…</div>
						) : filtered.length === 0 ? (
							<div style={styles.empty}>No cars found.</div>
						) : isMobile ? (
							<div style={styles.mobileList}>
								{filtered.map((c) => {
									const sp = statusPill(c.status);

									return (
										<div key={c.id} style={styles.mobileItem}>
											<div style={styles.mobileTop}>
												<div style={{ minWidth: 0 }}>
													<p style={styles.mobileTitle}>
														<DirectionsCarFilledIcon fontSize="small" />
														{c.name}
													</p>
													<p style={styles.mobileSub}>
														{c.specs} • {c.location} • ${c.pricePerDay}/day
													</p>
												</div>

												<button
													type="button"
													style={styles.actionBtn}
													aria-label="Actions"
													onClick={() => onRemove(c.id)}
												>
													<MoreHorizIcon />
												</button>
											</div>

											<div style={styles.mobileMeta}>
												<span style={styles.mobileId}>{c.id}</span>

												<span style={{ ...styles.pill, background: sp.bg, borderColor: sp.border, color: sp.fg }}>
													<span style={{ ...styles.dot, background: sp.dot }} />
													{c.status}
												</span>

												<span style={{ ...styles.pill, background: 'rgba(2,6,23,.04)' }}>{c.createdAt}</span>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<CarsTableDesktop rows={filtered} onRemove={onRemove} onToggle={onQuickToggleInactive} />
						)}
					</div>
				</div>
			</AdminShell>
		</>
	);
};

const CarsTableDesktop: React.FC<{
	rows: CarRow[];
	onRemove: (id: string) => void;
	onToggle: (id: string, current: CarStatus) => void;
}> = ({ rows, onRemove, onToggle }) => {
	const [hoverId, setHoverId] = useState<string | null>(null);

	const styles: Record<string, React.CSSProperties> = {
		wrap: { overflowX: 'auto' },
		table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 1100 },

		th: {
			position: 'sticky',
			top: 0,
			zIndex: 2,
			textAlign: 'left',
			fontSize: 12,
			fontWeight: 900,
			color: '#475467',
			background: '#fbfcff',
			borderBottom: '1px solid rgba(16, 24, 40, 0.08)',
			padding: '12px 12px',
			whiteSpace: 'nowrap',
		},

		td: {
			padding: '12px 12px',
			borderBottom: '1px solid rgba(16, 24, 40, 0.06)',
			fontSize: 13.5,
			fontWeight: 750,
			color: '#0b1220',
			whiteSpace: 'nowrap',
			verticalAlign: 'middle',
		},

		tdMuted: { fontWeight: 750, color: '#667085', fontSize: 13 },
		zebra: { background: 'rgba(2, 6, 23, 0.02)' },
		rowHover: { background: 'rgba(79, 139, 255, 0.06)' },

		pill: {
			display: 'inline-flex',
			alignItems: 'center',
			gap: 7,
			padding: '5px 10px',
			borderRadius: 999,
			border: '1px solid rgba(16, 24, 40, 0.10)',
			fontSize: 12,
			fontWeight: 900,
			letterSpacing: 0.2,
		},

		dot: { width: 7, height: 7, borderRadius: 999 },

		actionBtn: {
			width: 34,
			height: 34,
			borderRadius: 12,
			border: '1px solid rgba(16, 24, 40, 0.10)',
			background: '#fff',
			cursor: 'pointer',
			display: 'grid',
			placeItems: 'center',
		},

		actionInline: {
			display: 'inline-flex',
			gap: 8,
			alignItems: 'center',
			justifyContent: 'flex-end',
		},
	};

	const statusPill = (s: CarStatus) => {
		if (s === 'AVAILABLE')
			return { bg: 'rgba(16,185,129,.12)', border: 'rgba(16,185,129,.22)', fg: '#067647', dot: '#10b981' };
		if (s === 'RENTED')
			return { bg: 'rgba(79,139,255,.12)', border: 'rgba(79,139,255,.22)', fg: '#2b63ff', dot: '#4f8bff' };
		if (s === 'MAINTENANCE')
			return { bg: 'rgba(245,158,11,.14)', border: 'rgba(245,158,11,.25)', fg: '#92400e', dot: '#f59e0b' };
		return { bg: 'rgba(148,163,184,.16)', border: 'rgba(148,163,184,.26)', fg: '#334155', dot: '#94a3b8' };
	};

	return (
		<div style={styles.wrap}>
			<table style={styles.table}>
				<thead>
					<tr>
						<th style={styles.th}>Car ID</th>
						<th style={styles.th}>Car</th>
						<th style={styles.th}>Specs</th>
						<th style={styles.th}>Status</th>
						<th style={styles.th}>Location</th>
						<th style={styles.th}>Price/day</th>
						<th style={styles.th}>Created</th>
						<th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
					</tr>
				</thead>

				<tbody>
					{rows.map((c, idx) => {
						const sp = statusPill(c.status);
						const baseBg = idx % 2 === 1 ? styles.zebra : undefined;
						const hovered = hoverId === c.id ? styles.rowHover : undefined;

						return (
							<tr
								key={c.id}
								style={{ ...(baseBg as any), ...(hovered as any) }}
								onMouseEnter={() => setHoverId(c.id)}
								onMouseLeave={() => setHoverId(null)}
							>
								<td style={styles.td}>{c.id}</td>
								<td style={styles.td}>{c.name}</td>
								<td style={{ ...styles.td, ...styles.tdMuted }}>{c.specs}</td>

								<td style={styles.td}>
									<span style={{ ...styles.pill, background: sp.bg, borderColor: sp.border, color: sp.fg }}>
										<span style={{ ...styles.dot, background: sp.dot }} />
										{c.status}
									</span>
								</td>

								<td style={{ ...styles.td, ...styles.tdMuted }}>{c.location}</td>
								<td style={styles.td}>${c.pricePerDay.toLocaleString()}</td>
								<td style={{ ...styles.td, ...styles.tdMuted }}>{c.createdAt}</td>

								<td style={{ ...styles.td, textAlign: 'right' }}>
									<div style={styles.actionInline}>
										<button
											type="button"
											style={{
												...styles.actionBtn,
												opacity: hoverId === c.id ? 1 : 0,
												pointerEvents: hoverId === c.id ? 'auto' : 'none',
												transition: 'opacity .12s ease',
											}}
											onClick={() => onRemove(c.id)}
											aria-label="Remove car"
											title="Remove"
										>
											<MoreHorizIcon />
										</button>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default AdminCarsPage;
