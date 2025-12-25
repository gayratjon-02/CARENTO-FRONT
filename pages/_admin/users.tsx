import Head from 'next/head';
import React, { useMemo, useState } from 'react';
import AdminShell from '../../components/admin/AdminShell';
import UsersTable, { UserRow } from '../../components/admin/UsersTable';

const mockUsers: UserRow[] = [
	{
		id: 'U-1001',
		name: 'Olivia Wilde',
		email: 'olivia@carento.com',
		role: 'ADMIN',
		status: 'ACTIVE',
		createdAt: '2025-12-20',
	},
	{
		id: 'U-1002',
		name: 'James Park',
		email: 'james@carento.com',
		role: 'AGENT',
		status: 'ACTIVE',
		createdAt: '2025-12-19',
	},
	{
		id: 'U-1003',
		name: 'Sara Lee',
		email: 'sara@carento.com',
		role: 'USER',
		status: 'BLOCKED',
		createdAt: '2025-12-18',
	},
	{
		id: 'U-1004',
		name: 'Daniel Cho',
		email: 'daniel@carento.com',
		role: 'USER',
		status: 'ACTIVE',
		createdAt: '2025-12-17',
	},
	{
		id: 'U-1005',
		name: 'Emily Carter',
		email: 'emily@carento.com',
		role: 'AGENT',
		status: 'ACTIVE',
		createdAt: '2025-12-16',
	},
];

const AdminUsersPage = () => {
	const [range, setRange] = useState<'today' | '7d' | '30d'>('7d');
	const [search, setSearch] = useState('');
	const [role, setRole] = useState<'ALL' | 'ADMIN' | 'AGENT' | 'USER'>('ALL');
	const [status, setStatus] = useState<'ALL' | 'ACTIVE' | 'BLOCKED'>('ALL');

	const filtered = useMemo(() => {
		return mockUsers.filter((u) => {
			const matchesSearch = search
				? u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
				: true;
			const matchesRole = role === 'ALL' ? true : u.role === role;
			const matchesStatus = status === 'ALL' ? true : u.status === status;
			return matchesSearch && matchesRole && matchesStatus;
		});
	}, [search, role, status]);

	const styles: Record<string, React.CSSProperties> = {
		section: {
			display: 'flex',
			flexDirection: 'column',
			gap: 12,
		},
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
		left: {
			display: 'flex',
			gap: 10,
			flexWrap: 'wrap',
			alignItems: 'center',
			flex: 1,
			minWidth: 260,
		},
		right: {
			display: 'flex',
			gap: 10,
			flexWrap: 'wrap',
			alignItems: 'center',
			justifyContent: 'flex-end',
		},
		input: {
			height: 40,
			minWidth: 260,
			flex: 1,
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
		ghostBtn: {
			height: 40,
			padding: '0 12px',
			borderRadius: 14,
			border: '1px solid rgba(16, 24, 40, 0.12)',
			background: 'rgba(255,255,255,.75)',
			fontSize: 13,
			fontWeight: 900,
			color: '#0b1220',
			cursor: 'pointer',
			boxShadow: '0 6px 16px rgba(16,24,40,.06)',
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
	};

	return (
		<>
			<Head>
				<title>Carento Admin | Users</title>
			</Head>

			<AdminShell
				title="Users"
				subtitle="Manage members, agents, and administrators"
				range={range}
				onRangeChange={setRange}
				activePath="/_admin/users"
			>
				<div style={styles.section}>
					<div style={styles.filtersCard}>
						<div style={styles.left}>
							<input
								style={styles.input}
								placeholder="Search by name or email"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>

							<select style={styles.select} value={role} onChange={(e) => setRole(e.target.value as any)}>
								<option value="ALL">All roles</option>
								<option value="ADMIN">Admin</option>
								<option value="AGENT">Agent</option>
								<option value="USER">User</option>
							</select>

							<select style={styles.select} value={status} onChange={(e) => setStatus(e.target.value as any)}>
								<option value="ALL">All status</option>
								<option value="ACTIVE">Active</option>
								<option value="BLOCKED">Blocked</option>
							</select>
						</div>

						<div style={styles.right}>
							<span style={styles.count}>{filtered.length} results</span>

							<button
								type="button"
								style={styles.ghostBtn}
								onClick={() => {
									setSearch('');
									setRole('ALL');
									setStatus('ALL');
								}}
							>
								Reset
							</button>
						</div>
					</div>

					<UsersTable rows={filtered} />
				</div>
			</AdminShell>
		</>
	);
};

export default AdminUsersPage;
