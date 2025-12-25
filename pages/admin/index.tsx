import Head from 'next/head';
import React, { useMemo, useState } from 'react';

import BookOnlineIcon from '@mui/icons-material/BookOnline';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PaymentIcon from '@mui/icons-material/Payment';

import AdminShell from '../../components/admin/AdminShell';

import StatsCard from '../../libs/components/admin/StatsCard';
import Charts, { BarPoint, LinePoint, PieSlice } from '../../libs/components/admin/Charts';
import RecentBookingsTable, { BookingRow } from '../../libs/components/admin/RecentBookingsTable';

type RangeKey = 'today' | '7d' | '30d';

const mockedStats = {
	totalBookings: 1240,
	activeBookings: 218,
	totalRevenue: 482300,
	totalCars: 156,
};

const lineData: LinePoint[] = [
	{ label: 'Mon', value: 32 },
	{ label: 'Tue', value: 54 },
	{ label: 'Wed', value: 48 },
	{ label: 'Thu', value: 62 },
	{ label: 'Fri', value: 71 },
	{ label: 'Sat', value: 58 },
	{ label: 'Sun', value: 45 },
];

const barData: BarPoint[] = [
	{ label: 'Mon', value: 12000 },
	{ label: 'Tue', value: 15200 },
	{ label: 'Wed', value: 13800 },
	{ label: 'Thu', value: 18600 },
	{ label: 'Fri', value: 21000 },
	{ label: 'Sat', value: 17400 },
	{ label: 'Sun', value: 13200 },
];

const pieData: PieSlice[] = [
	{ label: 'PENDING', value: 28, color: '#ffb347' },
	{ label: 'CONFIRMED', value: 62, color: '#4f8bff' },
	{ label: 'CANCELLED', value: 10, color: '#ff6a70' },
];

const recentRows: BookingRow[] = [
	{
		id: 'BK-1023',
		user: 'Olivia Wilde',
		car: 'Tesla Model 3',
		status: 'CONFIRMED',
		price: 180,
		createdAt: '2025-12-25',
	},
	{ id: 'BK-1022', user: 'James Park', car: 'BMW M4', status: 'PENDING', price: 240, createdAt: '2025-12-25' },
	{ id: 'BK-1021', user: 'Sara Lee', car: 'Audi A6', status: 'CANCELLED', price: 130, createdAt: '2025-12-24' },
	{ id: 'BK-1020', user: 'Daniel Cho', car: 'Hyundai Ioniq', status: 'CONFIRMED', price: 95, createdAt: '2025-12-24' },
];

const AdminDashboard = () => {
	const [range, setRange] = useState<RangeKey>('7d');

	const rangeLabel = useMemo(() => {
		if (range === 'today') return 'Today';
		if (range === '7d') return 'Last 7 days';
		return 'Last 30 days';
	}, [range]);

	const styles = useMemo(() => {
		const c = {
			panel: '#ffffff',
			border: 'rgba(16, 24, 40, 0.10)',
			shadow: '0 10px 30px rgba(16,24,40,.08)',
			shadowSoft: '0 6px 18px rgba(16,24,40,.06)',
			text: '#0b1220',
			muted: '#667085',
		};

		return {
			page: {
				maxWidth: 1280,
				margin: '0 auto',
				display: 'flex',
				flexDirection: 'column',
				gap: 14,
			} as React.CSSProperties,

			kpiGrid: {
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
				gap: 12,
			} as React.CSSProperties,

			card: {
				background: c.panel,
				border: `1px solid ${c.border}`,
				borderRadius: 18,
				boxShadow: c.shadowSoft,
				overflow: 'hidden',
			} as React.CSSProperties,

			cardHeader: {
				padding: '12px 14px',
				borderBottom: `1px solid ${c.border}`,
				display: 'flex',
				alignItems: 'baseline',
				justifyContent: 'space-between',
				gap: 10,
			} as React.CSSProperties,

			cardTitle: {
				margin: 0,
				fontSize: 13.5,
				fontWeight: 850,
				letterSpacing: -0.2,
				color: c.text,
			} as React.CSSProperties,

			cardMeta: {
				margin: 0,
				fontSize: 12,
				color: c.muted,
				whiteSpace: 'nowrap',
			} as React.CSSProperties,

			cardBody: {
				padding: 14,
			} as React.CSSProperties,

			// Charts juda “cho‘zilib” ketmasligi uchun containerga limit beramiz.
			chartBody: {
				padding: 14,
				height: 380,
				minHeight: 380,
				overflow: 'hidden',
			} as React.CSSProperties,

			// Table ham “hero” bo‘lib ketmasin — balans.
			tableBody: {
				padding: 0,
			} as React.CSSProperties,
		};
	}, []);

	return (
		<>
			<Head>
				<title>Admin Dashboard</title>
			</Head>

			<AdminShell
				title="Dashboard"
				subtitle="Overview of bookings, revenue, and activity"
				range={range}
				onRangeChange={setRange}
				activePath="/_admin"
			>
				<div style={styles.page}>
					<section style={styles.kpiGrid}>
						<StatsCard
							title="Total Bookings"
							value={mockedStats.totalBookings}
							subtitle={rangeLabel}
							icon={<BookOnlineIcon />}
						/>
						<StatsCard
							title="Active Bookings"
							value={mockedStats.activeBookings}
							subtitle="Currently in progress"
							icon={<TrendingUpIcon />}
						/>
						<StatsCard
							title="Total Revenue"
							value={`$${mockedStats.totalRevenue.toLocaleString()}`}
							subtitle={rangeLabel}
							icon={<PaymentIcon />}
						/>
						<StatsCard
							title="Total Cars"
							value={mockedStats.totalCars}
							subtitle="Fleet size"
							icon={<DirectionsCarFilledIcon />}
						/>
					</section>

					<section style={styles.card}>
						<div style={styles.cardHeader}>
							<h3 style={styles.cardTitle}>Analytics</h3>
							<p style={styles.cardMeta}>{rangeLabel}</p>
						</div>

						<div style={styles.chartBody}>
							<Charts lineData={lineData} barData={barData} pieData={pieData} />
						</div>
					</section>

					<section style={styles.card}>
						<div style={styles.cardHeader}>
							<h3 style={styles.cardTitle}>Recent bookings</h3>
							<p style={styles.cardMeta}>Latest activity</p>
						</div>

						<div style={styles.tableBody}>
							<RecentBookingsTable rows={recentRows} />
						</div>
					</section>
				</div>
			</AdminShell>
		</>
	);
};

export default AdminDashboard;
