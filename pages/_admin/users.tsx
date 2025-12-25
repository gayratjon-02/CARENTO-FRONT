import Head from 'next/head';
import React, { useMemo, useState, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import AdminShell from '../../components/admin/AdminShell';
import UsersTable, { UserRow } from '../../components/admin/UsersTable';
import { GET_ALL_MEMBERS_BY_ADMIN } from 'apollo/admin/query';
import { UPDATE_MEMBER_BY_ADMIN } from 'apollo/admin/mutation';
import { text } from 'stream/consumers';

type RangeKey = 'today' | '7d' | '30d';

type Member = {
	_id: string;
	memberType?: string;
	memberStatus?: string;
	memberPhone?: string;
	memberNick?: string;
	memberFullName?: string;
	createdAt?: string;
};

const AdminUsersPage = () => {
	const [range, setRange] = useState<RangeKey>('7d');

	const [search, setSearch] = useState('');
	const [role, setRole] = useState<'ALL' | 'ADMIN' | 'AGENT' | 'USER'>('ALL');
	const [status, setStatus] = useState<'ALL' | 'ACTIVE' | 'BLOCKED'>('ALL');

	const [page, setPage] = useState(1);
	const limit = 20;

	const { data, loading, error, refetch } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		variables: {
			input: {
				page: 1,
				limit: 10,
				search: {
					text: search,
					memberType: role === 'ALL' ? undefined : role,
					memberStatus: status === 'ALL' ? undefined : status,
				},
			},
		},
		fetchPolicy: 'cache-and-network',
	});

	const [updateMemberByAdmin, updateState] = useMutation(UPDATE_MEMBER_BY_ADMIN);

	const members: Member[] = data?.getAllMembersByAdmin?.list ?? [];
	const total: number = data?.getAllMembersByAdmin?.metaCounter?.total ?? 0;

	const rows: UserRow[] = useMemo(() => {
		return members.map((m) => {
			const name = m.memberFullName || m.memberNick || '-';
			const emailLike = m.memberPhone || '-';

			return {
				id: m._id,
				name,
				email: emailLike,
				role: (m.memberType || 'USER') as any,
				status: (m.memberStatus || 'ACTIVE') as any,
				createdAt: (m.createdAt || '').slice(0, 10),
			};
		});
	}, [members]);

	const onReset = useCallback(() => {
		setSearch('');
		setRole('ALL');
		setStatus('ALL');
		setPage(1);
	}, []);

	// ACTION: block/unblock
	const onToggleBlock = useCallback(
		async (row: UserRow) => {
			const nextStatus = row.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';

			await updateMemberByAdmin({
				variables: {
					input: {
						_id: row.id,
						memberStatus: nextStatus,
					} as any,
				},
			});

			await refetch();
		},
		[updateMemberByAdmin, refetch],
	);

	const onView = useCallback((row: UserRow) => {
		console.log('view member', row.id);
	}, []);

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
				<div className="users-filters users-filters--admin">
					<input
						placeholder="Search by name or phone"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
					/>

					<select
						value={role}
						onChange={(e) => {
							setRole(e.target.value as any);
							setPage(1);
						}}
					>
						<option value="ALL">All roles</option>
						<option value="ADMIN">Admin</option>
						<option value="AGENT">Agent</option>
						<option value="USER">User</option>
					</select>

					<select
						value={status}
						onChange={(e) => {
							setStatus(e.target.value as any);
							setPage(1);
						}}
					>
						<option value="ALL">All status</option>
						<option value="ACTIVE">Active</option>
						<option value="BLOCKED">Blocked</option>
					</select>

					<button type="button" onClick={onReset}>
						Reset
					</button>
				</div>

				{error ? (
					<div className="placeholder-card">
						<b>Query error</b>
						<div style={{ marginTop: 8 }}>{error.message}</div>
					</div>
				) : (
					<UsersTable
						rows={rows}
						loading={loading || updateState.loading}
						total={total}
						page={page}
						limit={limit}
						onPageChange={setPage}
						onView={onView}
						onToggleBlock={onToggleBlock}
					/>
				)}
			</AdminShell>
		</>
	);
};

export default AdminUsersPage;
