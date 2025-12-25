import React from 'react';

export type RecentUser = {
	id: string;
	name: string;
	role: 'ADMIN' | 'AGENT' | 'USER';
	avatar?: string;
};

type RecentUsersListProps = {
	users: RecentUser[];
	loading?: boolean;
};

const RecentUsersList: React.FC<RecentUsersListProps> = ({ users, loading = false }) => {
	return (
		<div className="recent-users">
			<div className="recent-users__head">
				<h4>Recent users</h4>
			</div>
			<div className="recent-users__body">
				{loading && <div className="empty">Loading…</div>}
				{!loading && users.length === 0 && <div className="empty">No users yet.</div>}
				{!loading &&
					users.map((u) => (
						<div className="recent-users__row" key={u.id}>
							<div className="avatar">{u.avatar ? <img src={u.avatar} alt={u.name} /> : u.name.slice(0, 2).toUpperCase()}</div>
							<div className="meta">
								<div className="name">{u.name}</div>
								<span className={`role role-${u.role.toLowerCase()}`}>{u.role}</span>
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default RecentUsersList;
