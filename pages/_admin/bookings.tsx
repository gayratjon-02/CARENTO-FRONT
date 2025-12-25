import Head from 'next/head';
import React, { useMemo, useState } from 'react';
import AdminShell from '../../components/admin/AdminShell';

type RangeKey = 'today' | '7d' | '30d';
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
type PayStatus = 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';

type BookingRow = {
	id: string;
	user: string;
	email: string;
	car: string;
	status: BookingStatus;
	payment: PayStatus;
	amount: number;
	createdAt: string;
};

const mockRows: BookingRow[] = [
	{
		id: 'BK-2112',
		user: 'Olivia Wilde',
		email: 'olivia@carento.com',
		car: 'Tesla Model 3',
		status: 'CONFIRMED',
		payment: 'PAID',
		amount: 180,
		createdAt: '2025-12-25',
	},
	{
		id: 'BK-2111',
		user: 'James Park',
		email: 'james@carento.com',
		car: 'BMW M4',
		status: 'PENDING',
		payment: 'PENDING',
		amount: 240,
		createdAt: '2025-12-24',
	},
	{
		id: 'BK-2110',
		user: 'Sara Lee',
		email: 'sara@carento.com',
		car: 'Audi A6',
		status: 'CANCELLED',
		payment: 'REFUNDED',
		amount: 130,
		createdAt: '2025-12-24',
	},
	{
		id: 'BK-2109',
		user: 'Daniel Cho',
		email: 'daniel@carento.com',
		car: 'Hyundai Ioniq',
		status: 'CONFIRMED',
		payment: 'PAID',
		amount: 95,
		createdAt: '2025-12-23',
	},
	{
		id: 'BK-2108',
		user: 'Emily Carter',
		email: 'emily@carento.com',
		car: 'Mercedes E-Class',
		status: 'PENDING',
		payment: 'PENDING',
		amount: 310,
		createdAt: '2025-12-23',
	},
];

const AdminBookingsPage = () => {
	const [range, setRange] = useState<RangeKey>('7d');

	// filters
	const [q, setQ] = useState('');
	const [status, setStatus] = useState<'ALL' | BookingStatus>('ALL');
	const [payment, setPayment] = useState<'ALL' | PayStatus>('ALL');
	const [minAmount, setMinAmount] = useState<string>('');
	const [maxAmount, setMaxAmount] = useState<string>('');

	// UI state
	const [menuId, setMenuId] = useState<string | null>(null);
	const [selected, setSelected] = useState<BookingRow | null>(null);

	const rangeLabel = useMemo(() => {
		if (range === 'today') return 'Today';
		if (range === '7d') return 'Last 7 days';
		return 'Last 30 days';
	}, [range]);

	const filtered = useMemo(() => {
		const needle = q.trim().toLowerCase();

		return mockRows.filter((r) => {
			const matchesQ = needle
				? r.id.toLowerCase().includes(needle) ||
				  r.user.toLowerCase().includes(needle) ||
				  r.email.toLowerCase().includes(needle) ||
				  r.car.toLowerCase().includes(needle)
				: true;

			const matchesStatus = status === 'ALL' ? true : r.status === status;
			const matchesPay = payment === 'ALL' ? true : r.payment === payment;

			const min = minAmount.trim() ? Number(minAmount) : null;
			const max = maxAmount.trim() ? Number(maxAmount) : null;

			const matchesMin = min === null ? true : r.amount >= min;
			const matchesMax = max === null ? true : r.amount <= max;

			return matchesQ && matchesStatus && matchesPay && matchesMin && matchesMax;
		});
	}, [q, status, payment, minAmount, maxAmount]);

	const stats = useMemo(() => {
		const total = filtered.length;
		const pending = filtered.filter((r) => r.status === 'PENDING').length;
		const confirmed = filtered.filter((r) => r.status === 'CONFIRMED').length;
		const cancelled = filtered.filter((r) => r.status === 'CANCELLED').length;
		const revenue = filtered.reduce((sum, r) => sum + (r.payment === 'PAID' ? r.amount : 0), 0);
		return { total, pending, confirmed, cancelled, revenue };
	}, [filtered]);

	const styles: Record<string, React.CSSProperties> = {
		page: { display: 'flex', flexDirection: 'column', gap: 12 },

		topBar: {
			background: 'rgba(255,255,255,.92)',
			border: '1px solid rgba(16, 24, 40, 0.10)',
			borderRadius: 18,
			boxShadow: '0 10px 26px rgba(16,24,40,.08)',
			padding: 12,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: 10,
			flexWrap: 'wrap',
		},

		topLeft: { display: 'flex', flexDirection: 'column', gap: 4 },
		title: { margin: 0, fontSize: 13.5, fontWeight: 950, letterSpacing: -0.2, color: '#0b1220' },
		sub: { margin: 0, fontSize: 12.5, fontWeight: 750, color: '#667085' },

		topRight: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },

		pill: {
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

		btnPrimary: {
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
			boxShadow: '0 10px 22px rgba(79,139,255,.18)',
			userSelect: 'none',
		},

		grid: {
			display: 'grid',
			gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
			gap: 12,
		},

		card: {
			background: '#fff',
			border: '1px solid rgba(16, 24, 40, 0.10)',
			borderRadius: 18,
			boxShadow: '0 10px 26px rgba(16,24,40,.08)',
			overflow: 'hidden',
		},

		cardHead: {
			padding: '14px 14px',
			display: 'flex',
			alignItems: 'baseline',
			justifyContent: 'space-between',
			gap: 10,
			borderBottom: '1px solid rgba(16, 24, 40, 0.08)',
			background: 'rgba(255,255,255,.92)',
		},

		cardTitle: { margin: 0, fontSize: 13.5, fontWeight: 950, letterSpacing: -0.2, color: '#0b1220' },
		cardHint: { fontSize: 12.5, fontWeight: 800, color: '#667085' },

		cardBody: { padding: 14, display: 'flex', flexDirection: 'column', gap: 12 },

		// stats
		statsRow: { display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: 12 },
		stat: {
			gridColumn: 'span 3 / span 3',
			border: '1px solid rgba(16,24,40,.10)',
			borderRadius: 18,
			background: 'linear-gradient(180deg, rgba(255,255,255,.98), rgba(248,250,252,.96))',
			boxShadow: '0 10px 22px rgba(16,24,40,.06)',
			padding: 14,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: 12,
			minHeight: 72,
			flexWrap: 'wrap',
		},
		statLeft: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 120 },
		statK: { margin: 0, fontSize: 12.5, fontWeight: 900, color: '#475467' },
		statV: { margin: 0, fontSize: 20, fontWeight: 1000, letterSpacing: -0.4, color: '#0b1220' },
		statS: { margin: 0, fontSize: 12.5, fontWeight: 800, color: '#667085' },
		statChip: {
			height: 28,
			padding: '0 10px',
			borderRadius: 999,
			border: '1px solid rgba(79,139,255,.18)',
			background: 'rgba(79,139,255,.08)',
			fontSize: 12.5,
			fontWeight: 950,
			color: '#2b63ff',
			display: 'inline-flex',
			alignItems: 'center',
			whiteSpace: 'nowrap',
		},

		// filters
		filters: {
			display: 'grid',
			gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
			gap: 10,
			alignItems: 'center',
		},
		field: { display: 'flex', flexDirection: 'column', gap: 6 },
		label: { fontSize: 12.5, fontWeight: 900, color: '#475467' },

		input: {
			height: 40,
			width: '100%',
			padding: '0 12px',
			borderRadius: 14,
			border: '1px solid rgba(16, 24, 40, 0.12)',
			background: '#fff',
			outline: 'none',
			fontSize: 13.5,
			fontWeight: 800,
			color: '#0b1220',
			boxShadow: '0 6px 16px rgba(16,24,40,.06)',
		},
		select: {
			height: 40,
			width: '100%',
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

		col4: { gridColumn: 'span 4 / span 4' },
		col3: { gridColumn: 'span 3 / span 3' },
		col2: { gridColumn: 'span 2 / span 2' },
		col12: { gridColumn: 'span 12 / span 12' },

		// table
		tableWrap: {
			width: '100%',
			overflowX: 'auto',
			WebkitOverflowScrolling: 'touch',
		},
		table: {
			width: '100%',
			borderCollapse: 'separate',
			borderSpacing: 0,
			minWidth: 920,
		},
		th: {
			textAlign: 'left',
			fontSize: 12.5,
			fontWeight: 950,
			color: '#475467',
			padding: '10px 12px',
			borderBottom: '1px solid rgba(16,24,40,.10)',
			background: 'rgba(248,250,252,.85)',
			position: 'sticky' as const,
			top: 0,
			zIndex: 1,
			whiteSpace: 'nowrap',
		},
		td: {
			fontSize: 13.5,
			fontWeight: 850,
			color: '#0b1220',
			padding: '12px 12px',
			borderBottom: '1px solid rgba(16,24,40,.06)',
			verticalAlign: 'middle',
			whiteSpace: 'nowrap',
			background: '#fff',
		},
		tdMuted: { color: '#667085', fontWeight: 800 },

		badge: {
			display: 'inline-flex',
			alignItems: 'center',
			height: 26,
			padding: '0 10px',
			borderRadius: 999,
			fontSize: 12.5,
			fontWeight: 950,
			border: '1px solid rgba(16,24,40,.12)',
			background: 'rgba(148,163,184,.12)',
			color: '#334155',
		},
		badgePending: { borderColor: 'rgba(255,179,71,.35)', background: 'rgba(255,179,71,.18)', color: '#92400e' },
		badgeConfirmed: { borderColor: 'rgba(79,139,255,.35)', background: 'rgba(79,139,255,.16)', color: '#1d4ed8' },
		badgeCancelled: { borderColor: 'rgba(255,106,112,.35)', background: 'rgba(255,106,112,.16)', color: '#9f1239' },

		badgePaid: { borderColor: 'rgba(34,197,94,.30)', background: 'rgba(34,197,94,.14)', color: '#166534' },
		badgePayPending: { borderColor: 'rgba(245,158,11,.30)', background: 'rgba(245,158,11,.14)', color: '#92400e' },
		badgeFailed: { borderColor: 'rgba(239,68,68,.30)', background: 'rgba(239,68,68,.14)', color: '#991b1b' },
		badgeRefunded: { borderColor: 'rgba(148,163,184,.30)', background: 'rgba(148,163,184,.14)', color: '#334155' },

		money: { textAlign: 'right' as const, fontVariantNumeric: 'tabular-nums' as const },

		// actions
		actionCell: { position: 'relative' as const, textAlign: 'right' as const },
		dotsBtn: {
			height: 34,
			width: 34,
			borderRadius: 12,
			border: '1px solid rgba(16,24,40,.10)',
			background: 'rgba(248,250,252,.95)',
			cursor: 'pointer',
			boxShadow: '0 6px 16px rgba(16,24,40,.08)',
			fontSize: 18,
			fontWeight: 900,
			lineHeight: '34px',
			textAlign: 'center' as const,
			userSelect: 'none',
		},
		menu: {
			position: 'absolute' as const,
			right: 0,
			top: 40,
			width: 170,
			borderRadius: 14,
			border: '1px solid rgba(16,24,40,.12)',
			background: '#fff',
			boxShadow: '0 18px 40px rgba(16,24,40,.18)',
			overflow: 'hidden',
			zIndex: 10,
		},
		menuItem: {
			padding: '10px 12px',
			fontSize: 13.5,
			fontWeight: 900,
			color: '#0b1220',
			cursor: 'pointer',
			borderBottom: '1px solid rgba(16,24,40,.06)',
			background: '#fff',
			userSelect: 'none',
		},
		menuItemDanger: { color: '#9f1239', background: 'rgba(255,106,112,.06)' },

		// modal
		overlay: {
			position: 'fixed' as const,
			inset: 0,
			background: 'rgba(15, 23, 42, .55)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			padding: 16,
			zIndex: 50,
		},
		modal: {
			width: 'min(720px, 100%)',
			borderRadius: 20,
			border: '1px solid rgba(255,255,255,.16)',
			background: 'rgba(255,255,255,.96)',
			boxShadow: '0 30px 80px rgba(0,0,0,.35)',
			overflow: 'hidden',
		},
		modalHead: {
			padding: 14,
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			gap: 10,
			borderBottom: '1px solid rgba(16,24,40,.08)',
			background: 'rgba(255,255,255,.92)',
		},
		modalTitle: { margin: 0, fontSize: 14, fontWeight: 1000, color: '#0b1220' },
		closeBtn: {
			height: 34,
			padding: '0 12px',
			borderRadius: 12,
			border: '1px solid rgba(16,24,40,.12)',
			background: 'rgba(248,250,252,.95)',
			cursor: 'pointer',
			fontSize: 13,
			fontWeight: 950,
			color: '#0b1220',
		},
		modalBody: { padding: 14, display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: 12 },
		kv: {
			gridColumn: 'span 6 / span 6',
			border: '1px solid rgba(16,24,40,.10)',
			borderRadius: 16,
			background: 'rgba(2,6,23,.02)',
			padding: 12,
			display: 'flex',
			flexDirection: 'column',
			gap: 6,
		},
		k: { fontSize: 12.5, fontWeight: 950, color: '#475467' },
		v: { fontSize: 13.5, fontWeight: 950, color: '#0b1220' },
		modalFoot: {
			padding: 14,
			display: 'flex',
			justifyContent: 'flex-end',
			gap: 10,
			borderTop: '1px solid rgba(16,24,40,.08)',
			background: 'rgba(255,255,255,.92)',
			flexWrap: 'wrap',
		},
		btnGhost: {
			height: 40,
			padding: '0 12px',
			borderRadius: 14,
			border: '1px solid rgba(16,24,40,.12)',
			background: 'rgba(248,250,252,.95)',
			cursor: 'pointer',
			fontSize: 13,
			fontWeight: 950,
			color: '#0b1220',
		},
		btnDanger: {
			height: 40,
			padding: '0 12px',
			borderRadius: 14,
			border: '1px solid rgba(255, 106, 112, 0.28)',
			background: 'linear-gradient(135deg, rgba(255,106,112,.95), rgba(255,138,92,.95))',
			color: '#fff',
			fontSize: 13,
			fontWeight: 950,
			cursor: 'pointer',
			boxShadow: '0 10px 22px rgba(255,106,112,.16)',
		},
	};

	const badgeForStatus = (s: BookingStatus) => {
		const base = styles.badge;
		if (s === 'PENDING') return { ...base, ...styles.badgePending };
		if (s === 'CONFIRMED') return { ...base, ...styles.badgeConfirmed };
		return { ...base, ...styles.badgeCancelled };
	};

	const badgeForPay = (p: PayStatus) => {
		const base = styles.badge;
		if (p === 'PAID') return { ...base, ...styles.badgePaid };
		if (p === 'PENDING') return { ...base, ...styles.badgePayPending };
		if (p === 'FAILED') return { ...base, ...styles.badgeFailed };
		return { ...base, ...styles.badgeRefunded };
	};

	const clearFilters = () => {
		setQ('');
		setStatus('ALL');
		setPayment('ALL');
		setMinAmount('');
		setMaxAmount('');
	};

	const openDetails = (row: BookingRow) => {
		setMenuId(null);
		setSelected(row);
	};

	const closeDetails = () => setSelected(null);

	const pretendAction = (msg: string) => {
		setMenuId(null);
		alert(`${msg} (demo). Keyinchalik API bilan ulaysiz.`);
	};

	return (
		<>
			<Head>
				<title>Carento Admin | Bookings</title>
			</Head>

			<AdminShell
				title="Bookings"
				subtitle="Manage bookings, statuses, and payments"
				range={range}
				onRangeChange={setRange}
				activePath="/_admin/bookings"
			>
				<div style={styles.page}>
					{/* Top header/action bar */}
					<div style={styles.topBar}>
						<div style={styles.topLeft}>
							<p style={styles.title}>Bookings</p>
							<p style={styles.sub}>{rangeLabel} • Search, filter, and review booking activity</p>
						</div>

						<div style={styles.topRight}>
							<span style={styles.pill}>Total: {stats.total}</span>
							<button type="button" style={styles.btnPrimary} onClick={() => pretendAction('Export CSV')}>
								Export
							</button>
						</div>
					</div>

					{/* Stats */}
					<div style={styles.statsRow}>
						<div style={styles.stat}>
							<div style={styles.statLeft}>
								<p style={styles.statK}>Total bookings</p>
								<p style={styles.statV}>{stats.total}</p>
								<p style={styles.statS}>{rangeLabel}</p>
							</div>
							<span style={styles.statChip}>All</span>
						</div>

						<div style={styles.stat}>
							<div style={styles.statLeft}>
								<p style={styles.statK}>Confirmed</p>
								<p style={styles.statV}>{stats.confirmed}</p>
								<p style={styles.statS}>Completed / active</p>
							</div>
							<span
								style={{
									...styles.statChip,
									background: 'rgba(79,139,255,.12)',
									borderColor: 'rgba(79,139,255,.22)',
									color: '#1d4ed8',
								}}
							>
								CONFIRMED
							</span>
						</div>

						<div style={styles.stat}>
							<div style={styles.statLeft}>
								<p style={styles.statK}>Pending</p>
								<p style={styles.statV}>{stats.pending}</p>
								<p style={styles.statS}>Needs attention</p>
							</div>
							<span
								style={{
									...styles.statChip,
									background: 'rgba(245,158,11,.12)',
									borderColor: 'rgba(245,158,11,.22)',
									color: '#92400e',
								}}
							>
								PENDING
							</span>
						</div>

						<div style={styles.stat}>
							<div style={styles.statLeft}>
								<p style={styles.statK}>Paid revenue</p>
								<p style={styles.statV}>${stats.revenue.toLocaleString()}</p>
								<p style={styles.statS}>Paid only</p>
							</div>
							<span
								style={{
									...styles.statChip,
									background: 'rgba(34,197,94,.12)',
									borderColor: 'rgba(34,197,94,.22)',
									color: '#166534',
								}}
							>
								PAID
							</span>
						</div>
					</div>

					{/* Filters */}
					<div style={styles.card}>
						<div style={styles.cardHead}>
							<h4 style={styles.cardTitle}>Filters</h4>
							<span style={styles.cardHint}>narrow results</span>
						</div>

						<div style={styles.cardBody}>
							<div style={styles.filters}>
								<div style={{ ...styles.field, ...styles.col4 }}>
									<div style={styles.label}>Search</div>
									<input
										style={styles.input}
										placeholder="Booking ID, user, email, car…"
										value={q}
										onChange={(e) => setQ(e.target.value)}
									/>
								</div>

								<div style={{ ...styles.field, ...styles.col3 }}>
									<div style={styles.label}>Status</div>
									<select style={styles.select} value={status} onChange={(e) => setStatus(e.target.value as any)}>
										<option value="ALL">All status</option>
										<option value="PENDING">Pending</option>
										<option value="CONFIRMED">Confirmed</option>
										<option value="CANCELLED">Cancelled</option>
									</select>
								</div>

								<div style={{ ...styles.field, ...styles.col3 }}>
									<div style={styles.label}>Payment</div>
									<select style={styles.select} value={payment} onChange={(e) => setPayment(e.target.value as any)}>
										<option value="ALL">All payments</option>
										<option value="PAID">Paid</option>
										<option value="PENDING">Pending</option>
										<option value="FAILED">Failed</option>
										<option value="REFUNDED">Refunded</option>
									</select>
								</div>

								<div style={{ ...styles.field, ...styles.col2 }}>
									<div style={styles.label}>Min $</div>
									<input
										style={styles.input}
										inputMode="numeric"
										placeholder="0"
										value={minAmount}
										onChange={(e) => setMinAmount(e.target.value)}
									/>
								</div>

								<div style={{ ...styles.field, ...styles.col2 }}>
									<div style={styles.label}>Max $</div>
									<input
										style={styles.input}
										inputMode="numeric"
										placeholder="9999"
										value={maxAmount}
										onChange={(e) => setMaxAmount(e.target.value)}
									/>
								</div>

								<div
									style={{ ...styles.col12, display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}
								>
									<button type="button" style={styles.btnGhost} onClick={clearFilters}>
										Clear
									</button>
									<button type="button" style={styles.btnPrimary} onClick={() => pretendAction('Apply (demo)')}>
										Apply
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Table */}
					<div style={styles.card}>
						<div style={styles.cardHead}>
							<h4 style={styles.cardTitle}>Results</h4>
							<span style={styles.cardHint}>{filtered.length} rows</span>
						</div>

						<div style={styles.tableWrap}>
							<table style={styles.table}>
								<thead>
									<tr>
										<th style={styles.th}>Booking</th>
										<th style={styles.th}>User</th>
										<th style={styles.th}>Car</th>
										<th style={styles.th}>Status</th>
										<th style={styles.th}>Payment</th>
										<th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
										<th style={styles.th}>Date</th>
										<th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
									</tr>
								</thead>

								<tbody>
									{filtered.length === 0 && (
										<tr>
											<td style={{ ...styles.td, ...styles.tdMuted }} colSpan={8}>
												No bookings found.
											</td>
										</tr>
									)}

									{filtered.map((row) => (
										<tr key={row.id}>
											<td style={styles.td}>{row.id}</td>

											<td style={styles.td}>
												<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
													<span style={{ fontWeight: 950 }}>{row.user}</span>
													<span style={{ ...styles.tdMuted, fontSize: 12.5 }}>{row.email}</span>
												</div>
											</td>

											<td style={styles.td}>{row.car}</td>

											<td style={styles.td}>
												<span style={badgeForStatus(row.status)}>{row.status}</span>
											</td>

											<td style={styles.td}>
												<span style={badgeForPay(row.payment)}>{row.payment}</span>
											</td>

											<td style={{ ...styles.td, ...styles.money }}>${row.amount.toLocaleString()}</td>

											<td style={styles.td}>{row.createdAt}</td>

											<td style={{ ...styles.td, ...styles.actionCell }}>
												<button
													type="button"
													style={styles.dotsBtn}
													onClick={() => setMenuId((prev) => (prev === row.id ? null : row.id))}
													aria-label="Row actions"
													title="Actions"
												>
													⋮
												</button>

												{menuId === row.id && (
													<div style={styles.menu}>
														<div style={styles.menuItem} onClick={() => openDetails(row)}>
															View details
														</div>
														<div style={styles.menuItem} onClick={() => pretendAction(`Mark ${row.id} as CONFIRMED`)}>
															Mark confirmed
														</div>
														<div style={styles.menuItem} onClick={() => pretendAction(`Refund ${row.id}`)}>
															Issue refund
														</div>
														<div
															style={{ ...styles.menuItem, ...styles.menuItemDanger }}
															onClick={() => pretendAction(`Cancel ${row.id}`)}
														>
															Cancel booking
														</div>
													</div>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Details modal */}
					{selected && (
						<div
							style={styles.overlay}
							onClick={(e) => {
								// close if click outside modal
								if (e.target === e.currentTarget) closeDetails();
							}}
						>
							<div style={styles.modal}>
								<div style={styles.modalHead}>
									<h3 style={styles.modalTitle}>Booking details • {selected.id}</h3>
									<button type="button" style={styles.closeBtn} onClick={closeDetails}>
										Close
									</button>
								</div>

								<div style={styles.modalBody}>
									<div style={styles.kv}>
										<div style={styles.k}>User</div>
										<div style={styles.v}>{selected.user}</div>
										<div style={{ ...styles.v, color: '#667085', fontWeight: 850, fontSize: 12.5 }}>
											{selected.email}
										</div>
									</div>

									<div style={styles.kv}>
										<div style={styles.k}>Car</div>
										<div style={styles.v}>{selected.car}</div>
									</div>

									<div style={styles.kv}>
										<div style={styles.k}>Status</div>
										<div style={styles.v}>
											<span style={badgeForStatus(selected.status)}>{selected.status}</span>
										</div>
									</div>

									<div style={styles.kv}>
										<div style={styles.k}>Payment</div>
										<div style={styles.v}>
											<span style={badgeForPay(selected.payment)}>{selected.payment}</span>
										</div>
									</div>

									<div style={styles.kv}>
										<div style={styles.k}>Amount</div>
										<div style={styles.v}>${selected.amount.toLocaleString()}</div>
									</div>

									<div style={styles.kv}>
										<div style={styles.k}>Created</div>
										<div style={styles.v}>{selected.createdAt}</div>
									</div>
								</div>

								<div style={styles.modalFoot}>
									<button
										type="button"
										style={styles.btnGhost}
										onClick={() => pretendAction(`Message user (${selected.email})`)}
									>
										Message user
									</button>
									<button
										type="button"
										style={styles.btnPrimary}
										onClick={() => pretendAction(`Confirm ${selected.id}`)}
									>
										Confirm
									</button>
									<button type="button" style={styles.btnDanger} onClick={() => pretendAction(`Cancel ${selected.id}`)}>
										Cancel
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</AdminShell>
		</>
	);
};

export default AdminBookingsPage;
