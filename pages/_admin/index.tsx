import Head from 'next/head';
import React, { useMemo, useState } from 'react';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import PaymentIcon from '@mui/icons-material/Payment';

import AdminShell from '../../components/admin/AdminShell';
import StatsCard from '../../libs/components/admin/StatsCard';
import {
	BarChartCard,
	DonutChartCard,
	LineChartCard,
	BarPoint,
	LinePoint,
	PieSlice,
} from '../../libs/components/admin/Charts';

import RecentBookingsTable, { BookingRow } from '../../libs/components/admin/RecentBookingsTable';
import RecentUsersList, { RecentUser } from '../../components/admin/RecentUsersList';

import { useQuery } from '@apollo/client';

// ✅ PATHNI O'ZINGIZDAGI JOYGA MOSLAB QO'YING
import { GET_ALL_MEMBERS_BY_ADMIN } from 'apollo/admin/query';
// yoki: import { GET_ALL_MEMBERS_BY_ADMIN } from '../../apollo/admin/query';

import { Member } from 'libs/types/member/member';

type RangeKey = 'today' | '7d' | '30d';

// Mock chart data (hozircha)
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

// Mock bookings (hozircha)
const recentBookings: BookingRow[] = [
	{
		id: 'BK-2112',
		user: 'Olivia Wilde',
		car: 'Tesla Model 3',
		status: 'CONFIRMED',
		price: 180,
		createdAt: '2025-12-25',
	},
	{ id: 'BK-2111', user: 'James Park', car: 'BMW M4', status: 'PENDING', price: 240, createdAt: '2025-12-24' },
	{ id: 'BK-2110', user: 'Sara Lee', car: 'Audi A6', status: 'CANCELLED', price: 130, createdAt: '2025-12-24' },
	{ id: 'BK-2109', user: 'Daniel Cho', car: 'Hyundai Ioniq', status: 'CONFIRMED', price: 95, createdAt: '2025-12-23' },
];

const AdminDashboardPage = () => {
	const [range, setRange] = useState<RangeKey>('7d');

	// ✅ MembersInquiry odatda page/limit/search talab qiladi
	const { data, loading, error } = useQuery<{
		getAllMembersByAdmin: { list: Member[]; metaCounter: { total: number } };
	}>(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'cache-and-network',
		notifyOnNetworkStatusChange: true,
		variables: {
			input: {
				page: 1,
				limit: 10,
				search: {}, // ✅ "search required" xatosini oldini oladi
			},
		},
	});

	const members = data?.getAllMembersByAdmin?.list ?? [];
	const totalMembers = data?.getAllMembersByAdmin?.metaCounter?.total ?? members.length;

	// Role count (memberType ga qarab)
	const roleCounts = useMemo(() => {
		const c = { ADMIN: 0, AGENT: 0, USER: 0, OTHER: 0 };

		for (const m of members as any[]) {
			const t = String(m?.memberType ?? '').toUpperCase();
			if (t === 'ADMIN') c.ADMIN += 1;
			else if (t === 'AGENT') c.AGENT += 1;
			else if (t === 'USER') c.USER += 1;
			else c.OTHER += 1;
		}

		return c;
	}, [members]);

	const pieData: PieSlice[] = useMemo(() => {
		const base: PieSlice[] = [
			{ label: 'ADMIN', value: roleCounts.ADMIN, color: '#7f6bff' },
			{ label: 'AGENT', value: roleCounts.AGENT, color: '#4f8bff' },
			{ label: 'USER', value: roleCounts.USER, color: '#ff8a5c' },
		];

		// OTHER bo‘lsa ham ko‘rsatib qo‘yamiz
		if (roleCounts.OTHER > 0) base.push({ label: 'OTHER', value: roleCounts.OTHER, color: '#94a3b8' });

		return base;
	}, [roleCounts]);

	const recentUsers: RecentUser[] = useMemo(() => {
		return (members as any[]).slice(0, 4).map((m) => ({
			id: m?._id ?? '—',
			name: m?.memberNick || m?.memberFullName || m?.memberPhone || '—',
			role: (String(m?.memberType ?? 'USER').toUpperCase() as any) || 'USER',
		}));
	}, [members]);

	const stats = useMemo(() => {
		return [
			{
				title: 'Total Users',
				value: totalMembers,
				subtitle: 'All-time',
				icon: <PeopleAltIcon />,
			},
			{
				title: 'Admins',
				value: roleCounts.ADMIN,
				subtitle: 'System access',
				icon: <PeopleAltIcon />,
			},
			{
				title: 'Agents',
				value: roleCounts.AGENT,
				subtitle: 'Fleet managers',
				icon: <DirectionsCarFilledIcon />,
			},
			{
				title: 'Users',
				value: roleCounts.USER,
				subtitle: 'Customers',
				icon: <BookOnlineIcon />,
			},
		];
	}, [roleCounts, totalMembers]);

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
					{loading ? (
						<>
							<StatsCard title="Total Users" value="—" subtitle="Loading…" icon={<PeopleAltIcon />} loading />
							<StatsCard title="Admins" value="—" subtitle="Loading…" icon={<PeopleAltIcon />} loading />
							<StatsCard title="Agents" value="—" subtitle="Loading…" icon={<DirectionsCarFilledIcon />} loading />
							<StatsCard title="Users" value="—" subtitle="Loading…" icon={<BookOnlineIcon />} loading />
						</>
					) : error ? (
						<StatsCard title="Query error" value="—" subtitle={error.message} icon={<PaymentIcon />} />
					) : (
						stats.map((s) => (
							<StatsCard key={s.title} title={s.title} value={s.value} subtitle={s.subtitle} icon={s.icon} />
						))
					)}
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
