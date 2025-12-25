import Head from 'next/head';
import React, { useState } from 'react';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import PaymentIcon from '@mui/icons-material/Payment';
import AdminShell from '../../components/admin/AdminShell';
import StatsCard from '../../libs/components/admin/StatsCard';
import { BarChartCard, DonutChartCard, LineChartCard, BarPoint, LinePoint, PieSlice } from '../../libs/components/admin/Charts';
import RecentBookingsTable, { BookingRow } from '../../libs/components/admin/RecentBookingsTable';
import RecentUsersList, { RecentUser } from '../../components/admin/RecentUsersList';

const stats = [
	{ title: 'Total Users', value: 12840, subtitle: 'All-time', delta: '+3.4% vs last week', icon: <PeopleAltIcon /> },
	{ title: 'Active Bookings', value: 312, subtitle: 'Right now', delta: '+12', icon: <BookOnlineIcon /> },
	{ title: 'Available Cars', value: 184, subtitle: 'Ready to rent', delta: '+6 new', icon: <DirectionsCarFilledIcon /> },
	{ title: 'Total Revenue', value: '$4,820,300', subtitle: 'All-time', delta: '+5.2%', icon: <PaymentIcon /> },
];

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
	{ label: 'ADMIN', value: 12, color: '#7f6bff' },
	{ label: 'AGENT', value: 64, color: '#4f8bff' },
	{ label: 'USER', value: 580, color: '#ff8a5c' },
];

const recentBookings: BookingRow[] = [
	{ id: 'BK-2112', user: 'Olivia Wilde', car: 'Tesla Model 3', status: 'CONFIRMED', price: 180, createdAt: '2025-12-25' },
	{ id: 'BK-2111', user: 'James Park', car: 'BMW M4', status: 'PENDING', price: 240, createdAt: '2025-12-24' },
	{ id: 'BK-2110', user: 'Sara Lee', car: 'Audi A6', status: 'CANCELLED', price: 130, createdAt: '2025-12-24' },
	{ id: 'BK-2109', user: 'Daniel Cho', car: 'Hyundai Ioniq', status: 'CONFIRMED', price: 95, createdAt: '2025-12-23' },
];

const recentUsers: RecentUser[] = [
	{ id: 'U-01', name: 'Emily Carter', role: 'ADMIN' },
	{ id: 'U-02', name: 'Michael Kim', role: 'AGENT' },
	{ id: 'U-03', name: 'Sara Lee', role: 'USER' },
	{ id: 'U-04', name: 'Daniel Cho', role: 'USER' },
];

const AdminDashboardPage = () => {
	const [range, setRange] = useState<'today' | '7d' | '30d'>('7d');

	return (
		<>
			<Head>
				<title>Carento Admin | Dashboard</title>
			</Head>
			<AdminShell
				title="Dashboard"
				subtitle="Premium overview of bookings, revenue, and fleet"
				range={range}
				onRangeChange={setRange}
				activePath="/_admin"
			>
				<section className="admin-stats-grid admin-stats-grid--row">
					{stats.map((s) => (
						<StatsCard key={s.title} title={s.title} value={s.value} subtitle={s.subtitle} delta={s.delta} icon={s.icon} />
					))}
				</section>

				<section className="analytics-wrap">
					<div className="analytics-main">
						<LineChartCard title="Bookings trend" data={lineData} />
					</div>
					<div className="analytics-side">
						<BarChartCard title="Revenue per day" data={barData} />
						<DonutChartCard title="Users by role" data={pieData} />
					</div>
				</section>

				<section className="dashboard-activity">
					<div className="activity-bookings">
						<RecentBookingsTable rows={recentBookings} />
					</div>
					<div className="activity-users">
						<RecentUsersList users={recentUsers} />
					</div>
				</section>
			</AdminShell>
		</>
	);
};

export default AdminDashboardPage;
