import React, { useEffect, useMemo, useRef, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export type UserRow = {
	id: string;
	name: string;
	email: string;
	role: 'ADMIN' | 'AGENT' | 'USER';
	status: 'ACTIVE' | 'BLOCKED';
	createdAt: string;
};

type UsersTableProps = {
	rows: UserRow[];
	loading?: boolean;

	// pagination (optional)
	total?: number;
	page?: number;
	limit?: number;
	onPageChange?: (page: number) => void;

	// actions (optional)
	onView?: (row: UserRow) => void;
	onToggleBlock?: (row: UserRow) => void | Promise<void>;
};

type MenuState =
	| {
			open: true;
			userId: string;
			top: number;
			left: number;
	  }
	| { open: false };

const UsersTable: React.FC<UsersTableProps> = ({
	rows,
	loading = false,
	total,
	page = 1,
	limit = 20,
	onPageChange,
	onView,
	onToggleBlock,
}) => {
	const [hoverId, setHoverId] = useState<string | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [menu, setMenu] = useState<MenuState>({ open: false });
	const menuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const onResize = () => setIsMobile(window.innerWidth < 720);
		onResize();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	// close menu on outside click / escape
	useEffect(() => {
		if (!menu.open) return;

		const onDown = (e: MouseEvent) => {
			const t = e.target as Node | null;
			if (menuRef.current && t && menuRef.current.contains(t)) return;
			setMenu({ open: false });
		};

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setMenu({ open: false });
		};

		document.addEventListener('mousedown', onDown);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('mousedown', onDown);
			document.removeEventListener('keydown', onKey);
		};
	}, [menu.open]);

	const styles = useMemo(() => {
		const border = '1px solid rgba(16, 24, 40, 0.10)';
		return {
			card: {
				background: '#fff',
				border,
				borderRadius: 18,
				boxShadow: '0 10px 26px rgba(16,24,40,.08)',
				overflow: 'hidden',
			} as React.CSSProperties,

			head: {
				padding: '14px 14px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 10,
				borderBottom: '1px solid rgba(16, 24, 40, 0.08)',
				background: 'rgba(255,255,255,.92)',
			} as React.CSSProperties,

			headRight: {
				display: 'flex',
				alignItems: 'center',
				gap: 10,
			} as React.CSSProperties,

			h4: {
				margin: 0,
				fontSize: 13.5,
				fontWeight: 950,
				letterSpacing: -0.2,
				color: '#0b1220',
			} as React.CSSProperties,

			hint: {
				fontSize: 12.5,
				fontWeight: 800,
				color: '#667085',
				whiteSpace: 'nowrap',
			} as React.CSSProperties,

			wrap: {
				overflowX: 'auto',
			} as React.CSSProperties,

			table: {
				width: '100%',
				borderCollapse: 'separate',
				borderSpacing: 0,
				minWidth: 860,
			} as React.CSSProperties,

			th: {
				position: 'sticky',
				top: 0,
				zIndex: 2,
				textAlign: 'left',
				fontSize: 12,
				letterSpacing: 0.2,
				fontWeight: 900,
				color: '#475467',
				background: '#fbfcff',
				borderBottom: '1px solid rgba(16, 24, 40, 0.08)',
				padding: '12px 12px',
				whiteSpace: 'nowrap',
			} as React.CSSProperties,

			td: {
				padding: '12px 12px',
				borderBottom: '1px solid rgba(16, 24, 40, 0.06)',
				fontSize: 13.5,
				fontWeight: 750,
				color: '#0b1220',
				whiteSpace: 'nowrap',
				verticalAlign: 'middle',
			} as React.CSSProperties,

			tdMuted: {
				fontWeight: 750,
				color: '#667085',
				fontSize: 13,
			} as React.CSSProperties,

			rowHover: {
				background: 'rgba(79, 139, 255, 0.06)',
			} as React.CSSProperties,

			zebra: {
				background: 'rgba(2, 6, 23, 0.02)',
			} as React.CSSProperties,

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
			} as React.CSSProperties,

			dot: {
				width: 7,
				height: 7,
				borderRadius: 999,
			} as React.CSSProperties,

			actionBtn: {
				width: 34,
				height: 34,
				borderRadius: 12,
				border: '1px solid rgba(16, 24, 40, 0.10)',
				background: '#fff',
				cursor: 'pointer',
				display: 'grid',
				placeItems: 'center',
			} as React.CSSProperties,

			empty: {
				padding: 18,
				fontSize: 13,
				fontWeight: 750,
				color: '#667085',
			} as React.CSSProperties,

			// Pagination
			pager: {
				display: 'inline-flex',
				alignItems: 'center',
				gap: 6,
			} as React.CSSProperties,

			pagerBtn: {
				height: 30,
				padding: '0 10px',
				borderRadius: 12,
				border: '1px solid rgba(16, 24, 40, 0.10)',
				background: '#fff',
				cursor: 'pointer',
				fontSize: 12.5,
				fontWeight: 900,
				color: '#0b1220',
			} as React.CSSProperties,

			pagerBtnDisabled: {
				opacity: 0.45,
				cursor: 'not-allowed',
			} as React.CSSProperties,

			// Menu
			menu: {
				position: 'fixed',
				zIndex: 9999,
				minWidth: 170,
				borderRadius: 14,
				border: '1px solid rgba(16, 24, 40, 0.10)',
				background: '#fff',
				boxShadow: '0 16px 40px rgba(16,24,40,.16)',
				overflow: 'hidden',
			} as React.CSSProperties,

			menuItem: {
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				padding: '10px 12px',
				border: 'none',
				background: 'transparent',
				cursor: 'pointer',
				fontSize: 12.8,
				fontWeight: 900,
				color: '#0b1220',
				textAlign: 'left',
			} as React.CSSProperties,

			menuItemMuted: {
				color: '#475467',
				fontWeight: 850,
			} as React.CSSProperties,

			menuDivider: {
				height: 1,
				background: 'rgba(16, 24, 40, 0.08)',
			} as React.CSSProperties,

			// Mobile cards
			mobileList: {
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
				padding: 12,
			} as React.CSSProperties,

			mobileItem: {
				border,
				borderRadius: 16,
				background: '#fff',
				boxShadow: '0 10px 22px rgba(16,24,40,.06)',
				padding: 12,
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
			} as React.CSSProperties,

			mobileTop: {
				display: 'flex',
				alignItems: 'flex-start',
				justifyContent: 'space-between',
				gap: 10,
			} as React.CSSProperties,

			mobileName: {
				margin: 0,
				fontSize: 14,
				fontWeight: 950,
				letterSpacing: -0.25,
				color: '#0b1220',
				display: 'flex',
				alignItems: 'center',
				gap: 8,
			} as React.CSSProperties,

			mobileEmail: {
				margin: 0,
				fontSize: 12.5,
				fontWeight: 750,
				color: '#667085',
				display: 'flex',
				alignItems: 'center',
				gap: 8,
			} as React.CSSProperties,

			mobileMeta: {
				display: 'flex',
				flexWrap: 'wrap',
				gap: 8,
				alignItems: 'center',
			} as React.CSSProperties,

			mobileId: {
				fontSize: 12,
				fontWeight: 850,
				color: '#475467',
				letterSpacing: 0.2,
			} as React.CSSProperties,
		};
	}, []);

	const rolePill = (role: UserRow['role']) => {
		if (role === 'ADMIN')
			return { bg: 'rgba(79,139,255,.12)', border: 'rgba(79,139,255,.22)', fg: '#2b63ff', dot: '#4f8bff' };
		if (role === 'AGENT')
			return { bg: 'rgba(245,158,11,.14)', border: 'rgba(245,158,11,.25)', fg: '#92400e', dot: '#f59e0b' };
		return { bg: 'rgba(148,163,184,.16)', border: 'rgba(148,163,184,.26)', fg: '#334155', dot: '#94a3b8' };
	};

	const statusPill = (status: UserRow['status']) => {
		if (status === 'ACTIVE')
			return { bg: 'rgba(16,185,129,.12)', border: 'rgba(16,185,129,.22)', fg: '#067647', dot: '#10b981' };
		return { bg: 'rgba(239,68,68,.12)', border: 'rgba(239,68,68,.22)', fg: '#b42318', dot: '#ef4444' };
	};

	const totalSafe = typeof total === 'number' ? total : rows?.length ?? 0;
	const totalPages = Math.max(1, Math.ceil(totalSafe / Math.max(limit, 1)));
	const canPrev = !!onPageChange && page > 1;
	const canNext = !!onPageChange && page < totalPages;

	const openMenuFor = (userId: string, e: React.MouseEvent<HTMLButtonElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const top = rect.bottom + 8;
		const left = Math.min(rect.left, window.innerWidth - 200);  

		setMenu((prev) => {
			if (prev.open && prev.userId === userId) return { open: false };
			return { open: true, userId, top, left };
		});
	};

	const currentMenuUser = useMemo(() => {
		if (!menu.open) return null;
		return rows.find((r) => r.id === menu.userId) || null;
	}, [menu, rows]);

	const handleView = async (u: UserRow) => {
		setMenu({ open: false });
		onView?.(u);
	};

	const handleToggleBlock = async (u: UserRow) => {
		setMenu({ open: false });
		await onToggleBlock?.(u);
	};

	if (loading) {
		return (
			<div style={styles.card}>
				<div style={styles.head}>
					<h4 style={styles.h4}>Users</h4>
					<span style={styles.hint}>Loading…</span>
				</div>
				<div style={styles.empty}>Loading…</div>
			</div>
		);
	}

	if (!rows || rows.length === 0) {
		return (
			<div style={styles.card}>
				<div style={styles.head}>
					<h4 style={styles.h4}>Users</h4>
					<span style={styles.hint}>0 items</span>
				</div>
				<div style={styles.empty}>No users found.</div>
			</div>
		);
	}

	// Mobile card-list
	if (isMobile) {
		return (
			<div style={styles.card}>
				<div style={styles.head}>
					<h4 style={styles.h4}>Users</h4>
					<div style={styles.headRight}>
						<span style={styles.hint}>{totalSafe} items</span>

						{!!onPageChange && totalPages > 1 && (
							<div style={styles.pager}>
								<button
									type="button"
									style={{ ...styles.pagerBtn, ...(canPrev ? {} : styles.pagerBtnDisabled) }}
									onClick={() => canPrev && onPageChange(page - 1)}
									disabled={!canPrev}
								>
									Prev
								</button>
								<span style={styles.hint}>
									{page}/{totalPages}
								</span>
								<button
									type="button"
									style={{ ...styles.pagerBtn, ...(canNext ? {} : styles.pagerBtnDisabled) }}
									onClick={() => canNext && onPageChange(page + 1)}
									disabled={!canNext}
								>
									Next
								</button>
							</div>
						)}
					</div>
				</div>

				<div style={styles.mobileList}>
					{rows.map((u) => {
						const rp = rolePill(u.role);
						const sp = statusPill(u.status);

						return (
							<div key={u.id} style={styles.mobileItem}>
								<div style={styles.mobileTop}>
									<div style={{ minWidth: 0 }}>
										<p style={styles.mobileName}>
											<PersonIcon fontSize="small" />
											{u.name}
										</p>
										<p style={styles.mobileEmail}>
											<EmailIcon fontSize="small" />
											{u.email}
										</p>
									</div>

									<button
										type="button"
										style={styles.actionBtn}
										aria-label="Actions"
										onClick={(e) => openMenuFor(u.id, e)}
									>
										<MoreHorizIcon />
									</button>
								</div>

								<div style={styles.mobileMeta}>
									<span style={styles.mobileId}>{u.id}</span>

									<span style={{ ...styles.pill, background: rp.bg, borderColor: rp.border, color: rp.fg }}>
										<span style={{ ...styles.dot, background: rp.dot }} />
										{u.role}
									</span>

									<span style={{ ...styles.pill, background: sp.bg, borderColor: sp.border, color: sp.fg }}>
										<span style={{ ...styles.dot, background: sp.dot }} />
										{u.status}
									</span>

									<span style={{ ...styles.pill, background: 'rgba(2,6,23,.04)' }}>{u.createdAt}</span>
								</div>
							</div>
						);
					})}
				</div>

				{menu.open && currentMenuUser && (
					<div ref={menuRef} style={{ ...styles.menu, top: menu.top, left: menu.left }}>
						<button type="button" style={styles.menuItem} onClick={() => handleView(currentMenuUser)}>
							<VisibilityOutlinedIcon fontSize="small" />
							View
						</button>
						<div style={styles.menuDivider} />
						<button
							type="button"
							style={{ ...styles.menuItem, ...styles.menuItemMuted }}
							onClick={() => handleToggleBlock(currentMenuUser)}
						>
							{currentMenuUser.status === 'ACTIVE' ? (
								<BlockOutlinedIcon fontSize="small" />
							) : (
								<CheckCircleOutlineIcon fontSize="small" />
							)}
							{currentMenuUser.status === 'ACTIVE' ? 'Block' : 'Unblock'}
						</button>
					</div>
				)}
			</div>
		);
	}

	// Desktop table
	return (
		<div style={styles.card}>
			<div style={styles.head}>
				<h4 style={styles.h4}>Users</h4>

				<div style={styles.headRight}>
					<span style={styles.hint}>{totalSafe} items</span>

					{!!onPageChange && totalPages > 1 && (
						<div style={styles.pager}>
							<button
								type="button"
								style={{ ...styles.pagerBtn, ...(canPrev ? {} : styles.pagerBtnDisabled) }}
								onClick={() => canPrev && onPageChange(page - 1)}
								disabled={!canPrev}
							>
								Prev
							</button>
							<span style={styles.hint}>
								{page}/{totalPages}
							</span>
							<button
								type="button"
								style={{ ...styles.pagerBtn, ...(canNext ? {} : styles.pagerBtnDisabled) }}
								onClick={() => canNext && onPageChange(page + 1)}
								disabled={!canNext}
							>
								Next
							</button>
						</div>
					)}
				</div>
			</div>

			<div style={styles.wrap}>
				<table style={styles.table}>
					<thead>
						<tr>
							<th style={styles.th}>User ID</th>
							<th style={styles.th}>Name</th>
							<th style={styles.th}>Email</th>
							<th style={styles.th}>Role</th>
							<th style={styles.th}>Status</th>
							<th style={styles.th}>Created</th>
							<th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((u, idx) => {
							const rp = rolePill(u.role);
							const sp = statusPill(u.status);

							const baseBg = idx % 2 === 1 ? styles.zebra : undefined;
							const hovered = hoverId === u.id ? styles.rowHover : undefined;

							return (
								<tr
									key={u.id}
									style={{ ...(baseBg as any), ...(hovered as any) }}
									onMouseEnter={() => setHoverId(u.id)}
									onMouseLeave={() => setHoverId(null)}
								>
									<td style={styles.td}>{u.id}</td>
									<td style={styles.td}>{u.name}</td>
									<td style={{ ...styles.td, ...styles.tdMuted }}>{u.email}</td>

									<td style={styles.td}>
										<span style={{ ...styles.pill, background: rp.bg, borderColor: rp.border, color: rp.fg }}>
											<span style={{ ...styles.dot, background: rp.dot }} />
											{u.role}
										</span>
									</td>

									<td style={styles.td}>
										<span style={{ ...styles.pill, background: sp.bg, borderColor: sp.border, color: sp.fg }}>
											<span style={{ ...styles.dot, background: sp.dot }} />
											{u.status}
										</span>
									</td>

									<td style={{ ...styles.td, ...styles.tdMuted }}>{u.createdAt}</td>

									<td style={{ ...styles.td, textAlign: 'right' }}>
										<button
											type="button"
											style={{
												...styles.actionBtn,
												opacity: hoverId === u.id ? 1 : 0,
												pointerEvents: hoverId === u.id ? 'auto' : 'none',
												transition: 'opacity .12s ease',
											}}
											aria-label="Actions"
											onClick={(e) => openMenuFor(u.id, e)}
										>
											<MoreHorizIcon />
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{menu.open && currentMenuUser && (
				<div ref={menuRef} style={{ ...styles.menu, top: menu.top, left: menu.left }}>
					<button type="button" style={styles.menuItem} onClick={() => handleView(currentMenuUser)}>
						<VisibilityOutlinedIcon fontSize="small" />
						View
					</button>
					<div style={styles.menuDivider} />
					<button
						type="button"
						style={{ ...styles.menuItem, ...styles.menuItemMuted }}
						onClick={() => handleToggleBlock(currentMenuUser)}
					>
						{currentMenuUser.status === 'ACTIVE' ? (
							<BlockOutlinedIcon fontSize="small" />
						) : (
							<CheckCircleOutlineIcon fontSize="small" />
						)}
						{currentMenuUser.status === 'ACTIVE' ? 'Block' : 'Unblock'}
					</button>
				</div>
			)}
		</div>
	);
};

export default UsersTable;
