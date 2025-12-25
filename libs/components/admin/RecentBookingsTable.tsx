import React, { CSSProperties, useMemo, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

export type BookingRow = {
	id: string;
	user: string;
	car: string;
	status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
	price: number;
	createdAt: string;
};

type RecentBookingsTableProps = {
	rows: BookingRow[];
	loading?: boolean;

	// ixtiyoriy callback'lar (bersangiz ishlaydi, bermasangiz ham UI buzilmaydi)
	onView?: (row: BookingRow) => void;
	onCopyId?: (row: BookingRow) => void;
};

const styles = {
	card: {
		background: '#fff',
		border: '1px solid rgba(16, 24, 40, 0.10)',
		borderRadius: 16,
		boxShadow: '0 6px 18px rgba(16,24,40,.06)',
		overflow: 'hidden',
		width: '100%',
	} as CSSProperties,

	head: {
		padding: '12px 14px',
		borderBottom: '1px solid rgba(16, 24, 40, 0.08)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	} as CSSProperties,

	title: {
		margin: 0,
		fontSize: 13.5,
		fontWeight: 900,
		letterSpacing: -0.2,
		color: '#0b1220',
	} as CSSProperties,

	sub: {
		margin: 0,
		fontSize: 12,
		color: '#667085',
	} as CSSProperties,

	wrap: {
		width: '100%',
		overflowX: 'auto',
		overflowY: 'hidden',
	} as CSSProperties,

	table: {
		width: '100%',
		borderCollapse: 'separate',
		borderSpacing: 0,
		minWidth: 760, // mobil uchun scroll
	} as CSSProperties,

	th: {
		position: 'sticky' as const,
		top: 0,
		zIndex: 1,
		textAlign: 'left' as const,
		fontSize: 11.5,
		letterSpacing: 0.2,
		textTransform: 'uppercase' as const,
		color: '#667085',
		background: 'rgba(248, 250, 252, 0.95)',
		backdropFilter: 'saturate(180%) blur(6px)',
		borderBottom: '1px solid rgba(16, 24, 40, 0.08)',
		padding: '10px 12px',
		известно: undefined,
	} as CSSProperties,

	td: {
		padding: '12px 12px',
		borderBottom: '1px solid rgba(16, 24, 40, 0.06)',
		fontSize: 13,
		color: '#0b1220',
		verticalAlign: 'middle',
		whiteSpace: 'nowrap' as const,
	} as CSSProperties,

	numeric: {
		textAlign: 'right' as const,
		fontVariantNumeric: 'tabular-nums' as const,
	} as CSSProperties,

	mono: {
		fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
		fontSize: 12.5,
		color: '#0b1220',
		fontWeight: 800,
	} as CSSProperties,

	muted: {
		color: '#667085',
		fontSize: 12.5,
		fontWeight: 650,
	} as CSSProperties,

	empty: {
		padding: 18,
		textAlign: 'center' as const,
		color: '#667085',
		fontSize: 13,
	} as CSSProperties,

	pill: {
		display: 'inline-flex',
		alignItems: 'center',
		gap: 8,
		padding: '5px 10px',
		borderRadius: 999,
		fontSize: 11.5,
		fontWeight: 900,
		letterSpacing: 0.2,
		border: '1px solid rgba(16, 24, 40, 0.10)',
	} as CSSProperties,

	dot: {
		width: 8,
		height: 8,
		borderRadius: 999,
	} as CSSProperties,

	rowHover: {
		transition: 'background .15s ease',
	} as CSSProperties,

	actionsCell: {
		width: 46,
		textAlign: 'right' as const,
	} as CSSProperties,
};

function statusStyle(status: BookingRow['status']) {
	if (status === 'CONFIRMED') {
		return {
			pill: {
				...styles.pill,
				background: 'rgba(16, 185, 129, 0.10)',
				borderColor: 'rgba(16, 185, 129, 0.25)',
				color: '#067647',
			},
			dot: { ...styles.dot, background: '#10b981' },
			label: 'CONFIRMED',
		};
	}
	if (status === 'PENDING') {
		return {
			pill: {
				...styles.pill,
				background: 'rgba(245, 158, 11, 0.12)',
				borderColor: 'rgba(245, 158, 11, 0.30)',
				color: '#92400e',
			},
			dot: { ...styles.dot, background: '#f59e0b' },
			label: 'PENDING',
		};
	}
	return {
		pill: {
			...styles.pill,
			background: 'rgba(239, 68, 68, 0.10)',
			borderColor: 'rgba(239, 68, 68, 0.25)',
			color: '#b42318',
		},
		dot: { ...styles.dot, background: '#ef4444' },
		label: 'CANCELLED',
	};
}

const RecentBookingsTable: React.FC<RecentBookingsTableProps> = ({ rows, loading = false, onView, onCopyId }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [activeId, setActiveId] = useState<string | null>(null);

	const activeRow = useMemo(() => rows.find((r) => r.id === activeId) || null, [rows, activeId]);

	const open = Boolean(anchorEl);

	const handleOpenMenu = (e: React.MouseEvent<HTMLElement>, row: BookingRow) => {
		setAnchorEl(e.currentTarget);
		setActiveId(row.id);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
		setActiveId(null);
	};

	const handleCopy = async (row: BookingRow) => {
		try {
			await navigator.clipboard.writeText(row.id);
			onCopyId?.(row);
		} catch {
			// clipboard permission bo‘lmasa ham UI buzilmasin
			onCopyId?.(row);
		} finally {
			handleCloseMenu();
		}
	};

	const handleView = (row: BookingRow) => {
		onView?.(row);
		handleCloseMenu();
	};

	return (
		<div style={styles.card}>
			<div style={styles.head}>
				<div>
					<h4 style={styles.title}>Recent bookings</h4>
					<p style={styles.sub}>Latest activity across the platform</p>
				</div>
			</div>

			<div style={styles.wrap}>
				<table style={styles.table}>
					<thead>
						<tr>
							<th style={styles.th}>Booking ID</th>
							<th style={styles.th}>User</th>
							<th style={styles.th}>Car</th>
							<th style={styles.th}>Status</th>
							<th style={{ ...styles.th, ...styles.numeric }}>Price</th>
							<th style={styles.th}>Date</th>
							<th style={{ ...styles.th, textAlign: 'right' }}> </th>
						</tr>
					</thead>

					<tbody>
						{loading && (
							<tr>
								<td colSpan={7} style={styles.empty}>
									Loading…
								</td>
							</tr>
						)}

						{!loading && rows.length === 0 && (
							<tr>
								<td colSpan={7} style={styles.empty}>
									No bookings yet.
								</td>
							</tr>
						)}

						{!loading &&
							rows.map((row, idx) => {
								const st = statusStyle(row.status);
								const zebra = idx % 2 === 0 ? '#fff' : 'rgba(248, 250, 252, 0.65)';

								return (
									<tr
										key={row.id}
										style={{ background: zebra, ...styles.rowHover }}
										onMouseEnter={(e) => {
											(e.currentTarget as HTMLTableRowElement).style.background = 'rgba(79, 139, 255, 0.06)';
										}}
										onMouseLeave={(e) => {
											(e.currentTarget as HTMLTableRowElement).style.background = zebra;
										}}
									>
										<td style={{ ...styles.td, ...styles.mono }}>{row.id}</td>
										<td style={styles.td}>{row.user}</td>
										<td style={styles.td}>{row.car}</td>
										<td style={styles.td}>
											<span style={st.pill}>
												<span style={st.dot} />
												{st.label}
											</span>
										</td>
										<td style={{ ...styles.td, ...styles.numeric, fontWeight: 900 }}>${row.price.toLocaleString()}</td>
										<td style={{ ...styles.td, ...styles.muted }}>{row.createdAt}</td>
										<td style={{ ...styles.td, ...styles.actionsCell }}>
											<IconButton
												size="small"
												onClick={(e) => handleOpenMenu(e, row)}
												aria-label="booking actions"
												sx={{
													width: 34,
													height: 34,
													borderRadius: 2,
													border: '1px solid rgba(16,24,40,.10)',
													background: '#fff',
													'&:hover': { background: 'rgba(16,24,40,.04)' },
												}}
											>
												<MoreVertRoundedIcon fontSize="small" />
											</IconButton>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>

			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleCloseMenu}
				PaperProps={{
					sx: {
						borderRadius: 2,
						border: '1px solid rgba(16,24,40,.10)',
						boxShadow: '0 18px 40px rgba(16,24,40,.12)',
						minWidth: 180,
					},
				}}
			>
				<MenuItem onClick={() => (activeRow ? handleView(activeRow) : handleCloseMenu())} sx={{ gap: 1.2 }}>
					<VisibilityRoundedIcon fontSize="small" />
					View
				</MenuItem>

				<MenuItem onClick={() => (activeRow ? handleCopy(activeRow) : handleCloseMenu())} sx={{ gap: 1.2 }}>
					<ContentCopyRoundedIcon fontSize="small" />
					Copy ID
				</MenuItem>
			</Menu>
		</div>
	);
};

export default RecentBookingsTable;
