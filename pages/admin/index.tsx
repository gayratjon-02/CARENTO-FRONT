import Head from 'next/head';
import React, { useMemo, useState } from 'react';

import BookOnlineIcon from '@mui/icons-material/BookOnline';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import AdminShell from '../../components/admin/AdminShell';
import StatsCard from '../../libs/components/admin/StatsCard';
import { BarPoint, LinePoint, PieSlice, LineChartCard, BarChartCard, DonutChartCard } from '../../libs/components/admin/Charts';
import RecentBookingsTable, { BookingRow } from '../../libs/components/admin/RecentBookingsTable';
import { useQuery } from '@apollo/client';
import { GET_ADMIN_BOOKINGS, GET_AGENTS, GET_CARS } from '../../apollo/user/query';
import { Direction } from '../../libs/enums/common.enum';

type RangeKey = 'today' | '7d' | '30d';

const AdminDashboard = () => {
	const [range, setRange] = useState<RangeKey>('7d');

	const {
		data: bookingsData,
		loading: bookingsLoading,
	} = useQuery(GET_ADMIN_BOOKINGS, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 50,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {},
			},
		},
	});

	const { data: carsData } = useQuery(GET_CARS, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 1, search: {} } },
	});

	const { data: agentsData } = useQuery(GET_AGENTS, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 1, search: {} } },
	});

	const bookingsList = bookingsData?.getAdminBookingsByAdmin?.list ?? [];
	const bookingsTotal = bookingsData?.getAdminBookingsByAdmin?.metaCounter?.[0]?.total ?? 0;
	const totalCars = carsData?.getCars?.metaCounter?.[0]?.total ?? 0;
	const totalUsers = agentsData?.getAgents?.metaCounter?.[0]?.total ?? 0;

	const rangeLabel = useMemo(() => {
		if (range === 'today') return 'Today';
		if (range === '7d') return 'Last 7 days';
		return 'Last 30 days';
	}, [range]);

	const computedStats = useMemo(() => {
		const activeBookings = bookingsList.filter((b: any) => (b?.bookingStatus || '').toUpperCase() === 'CONFIRMED').length;
		const totalRevenue = bookingsList.reduce((sum: number, b: any) => sum + (Number(b?.totalPrice) || 0), 0);
		return {
			totalBookings: bookingsTotal,
			activeBookings,
			totalRevenue,
			totalCars,
			totalUsers,
		};
	}, [bookingsList, bookingsTotal, totalCars, totalUsers]);

	const recentRows: BookingRow[] = useMemo(
		() =>
			bookingsList.slice(0, 8).map((b: any) => ({
				id: b?._id ?? '',
				user: b?.userId ?? 'User',
				car: b?.carId ?? 'Car',
				status: (b?.bookingStatus || 'PENDING').toUpperCase() as any,
				price: Number(b?.totalPrice ?? 0),
				createdAt: b?.createdAt ? new Date(b.createdAt).toISOString().slice(0, 10) : '',
			})),
		[bookingsList],
	);

	const pieData: PieSlice[] = useMemo(() => {
		const counts: Record<string, number> = { PENDING: 0, CONFIRMED: 0, CANCELLED: 0 };
		bookingsList.forEach((b: any) => {
			const key = (b?.bookingStatus || 'PENDING').toUpperCase();
			counts[key] = (counts[key] || 0) + 1;
		});
		return [
			{ label: 'PENDING', value: counts.PENDING ?? 0, color: '#ffb347' },
			{ label: 'CONFIRMED', value: counts.CONFIRMED ?? 0, color: '#4f8bff' },
			{ label: 'CANCELLED', value: counts.CANCELLED ?? 0, color: '#ff6a70' },
		];
	}, [bookingsList]);

	const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const lineData: LinePoint[] = useMemo(() => {
		const counts = Array(7).fill(0);
		bookingsList.forEach((b: any) => {
			if (!b?.createdAt) return;
			const d = new Date(b.createdAt);
			const day = d.getDay(); // 0 Sunday
			const idx = day === 0 ? 6 : day - 1;
			counts[idx] += 1;
		});
		return counts.map((v, idx) => ({ label: dayLabels[idx], value: v }));
	}, [bookingsList]);

	const barData: BarPoint[] = useMemo(() => {
		const sums = Array(7).fill(0);
		bookingsList.forEach((b: any) => {
			if (!b?.createdAt) return;
			const d = new Date(b.createdAt);
			const day = d.getDay();
			const idx = day === 0 ? 6 : day - 1;
			sums[idx] += Number(b?.totalPrice ?? 0);
		});
		return sums.map((v, idx) => ({ label: dayLabels[idx], value: v }));
	}, [bookingsList]);

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
				<div className="admin-page">
					<section className="kpi-row">
						<StatsCard title="Total Users" value={computedStats.totalUsers} subtitle="All members" icon={<PeopleAltIcon />} />
						<StatsCard title="Total Bookings" value={computedStats.totalBookings} subtitle={rangeLabel} icon={<BookOnlineIcon />} />
						<StatsCard
							title="Active Bookings"
							value={computedStats.activeBookings}
							subtitle="Confirmed"
							icon={<TrendingUpIcon />}
						/>
						<StatsCard
							title="Total Revenue"
							value={`$${computedStats.totalRevenue.toLocaleString()}`}
							subtitle={rangeLabel}
							icon={<PaymentIcon />}
						/>
						<StatsCard title="Total Cars" value={computedStats.totalCars} subtitle="Fleet size" icon={<DirectionsCarFilledIcon />} />
					</section>

					<section className="analytics-wrap">
						<div className="analytics-main chart-card chart-card--line bounded">
							<div className="chart-card__head">
								<h4>Bookings trend</h4>
								<span className="hint">{rangeLabel}</span>
							</div>
							<div className="chart-fixed h-300">
								<LineChartCard title="Bookings trend" data={lineData} />
							</div>
						</div>
						<div className="analytics-side">
							<div className="chart-card chart-card--bar bounded h-220">
								<BarChartCard title="Revenue per day" data={barData} />
							</div>
							<div className="chart-card chart-card--donut bounded h-220">
								<DonutChartCard title="Users by status" data={pieData} />
							</div>
						</div>
					</section>

					<section className="dashboard-activity">
						<div className="activity-bookings bounded">
							<div className="card-head">
								<h3>Recent bookings</h3>
								<span className="muted">Latest activity</span>
							</div>
							<RecentBookingsTable rows={recentRows} loading={bookingsLoading} />
						</div>
					</section>
				</div>
			</AdminShell>
		</>
	);
};

export default AdminDashboard;
