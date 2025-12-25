import React, { CSSProperties, useMemo } from 'react';

export type LinePoint = { label: string; value: number };
export type BarPoint = { label: string; value: number };
export type PieSlice = { label: string; value: number; color?: string };

const palette = ['#4f8bff', '#7f6bff', '#ff8a5c'];

const styles = {
	chartsWrap: {
		display: 'flex',
		gap: 12,
		flexWrap: 'wrap',
		alignItems: 'stretch',
		width: '100%',
	} as CSSProperties,

	left: {
		flex: '1 1 560px',
		minWidth: 320,
	} as CSSProperties,

	right: {
		flex: '0 1 360px',
		minWidth: 280,
		display: 'flex',
		flexDirection: 'column',
		gap: 12,
	} as CSSProperties,

	card: {
		background: '#ffffff',
		border: '1px solid rgba(16, 24, 40, 0.10)',
		borderRadius: 16,
		boxShadow: '0 6px 18px rgba(16,24,40,.06)',
		overflow: 'hidden',
	} as CSSProperties,

	head: {
		padding: '12px 14px',
		borderBottom: '1px solid rgba(16, 24, 40, 0.08)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 10,
	} as CSSProperties,

	h4: {
		margin: 0,
		fontSize: 13.5,
		fontWeight: 850,
		letterSpacing: -0.2,
		color: '#0b1220',
	} as CSSProperties,

	hint: {
		fontSize: 12,
		color: '#667085',
		background: 'rgba(102,112,133,.10)',
		padding: '4px 8px',
		borderRadius: 999,
		whiteSpace: 'nowrap',
	} as CSSProperties,

	body: {
		padding: 14,
	} as CSSProperties,
};

export const LineChartCard: React.FC<{ title: string; data: LinePoint[] }> = ({ title, data }) => {
	const max = Math.max(...data.map((p) => p.value), 1);

	const points = useMemo(() => {
		return data
			.map((p, idx) => {
				const x = (idx / Math.max(data.length - 1, 1)) * 100;
				const y = 40 - (p.value / max) * 34 - 3; // biroz “padding”
				return `${x},${y}`;
			})
			.join(' ');
	}, [data, max]);

	return (
		<div style={{ ...styles.card, height: '100%' }}>
			<div style={styles.head}>
				<h4 style={styles.h4}>{title}</h4>
				<span style={styles.hint}>trend</span>
			</div>

			<div style={{ ...styles.body }}>
				<div
					style={{
						width: '100%',
						height: 220,
						borderRadius: 12,
						background:
							'linear-gradient(180deg, rgba(79,139,255,.10) 0%, rgba(127,107,255,.06) 60%, rgba(0,0,0,0) 100%)',
						border: '1px solid rgba(16, 24, 40, 0.06)',
						overflow: 'hidden',
						position: 'relative',
					}}
				>
					<svg
						viewBox="0 0 100 40"
						preserveAspectRatio="none"
						style={{ width: '100%', height: '100%', display: 'block' }}
					>
						<defs>
							<linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" stopColor="#4f8bff" />
								<stop offset="100%" stopColor="#7f6bff" />
							</linearGradient>
						</defs>

						{/* fill area (subtle) */}
						<polygon points={`${points} 100,40 0,40`} fill="rgba(79,139,255,.10)" stroke="none" />

						<polyline
							fill="none"
							stroke="url(#lineGradient)"
							strokeWidth="2.8"
							strokeLinejoin="round"
							strokeLinecap="round"
							points={points}
						/>
					</svg>
				</div>

				<div
					style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12, color: '#667085' }}
				>
					{data.map((p) => (
						<span key={p.label} style={{ flex: 1, textAlign: 'center' }}>
							{p.label}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export const BarChartCard: React.FC<{ title: string; data: BarPoint[] }> = ({ title, data }) => {
	const max = Math.max(...data.map((d) => d.value), 1);

	return (
		<div style={{ ...styles.card }}>
			<div style={styles.head}>
				<h4 style={styles.h4}>{title}</h4>
				<span style={styles.hint}>daily</span>
			</div>

			<div style={{ ...styles.body, paddingTop: 10 }}>
				{data.map((p) => {
					const pct = Math.max(6, Math.round((p.value / max) * 100)); // minimum ko‘rinib tursin
					return (
						<div
							key={p.label}
							style={{
								display: 'grid',
								gridTemplateColumns: '44px 1fr 92px',
								gap: 10,
								alignItems: 'center',
								padding: '6px 0',
							}}
						>
							<span style={{ fontSize: 12, color: '#667085' }}>{p.label}</span>

							<div style={{ height: 8, borderRadius: 999, background: 'rgba(16, 24, 40, 0.08)', overflow: 'hidden' }}>
								<div
									style={{
										height: '100%',
										width: `${pct}%`,
										borderRadius: 999,
										background: 'linear-gradient(90deg, rgba(79,139,255,.85) 0%, rgba(127,107,255,.85) 100%)',
									}}
								/>
							</div>

							<span style={{ fontSize: 12, fontWeight: 800, color: '#0b1220', textAlign: 'right' }}>
								${p.value.toLocaleString()}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export const DonutChartCard: React.FC<{ title: string; data: PieSlice[] }> = ({ title, data }) => {
	const total = data.reduce((sum, s) => sum + s.value, 0) || 1;

	// SVG circle circumference in user units
	const r = 16;
	const c = 2 * Math.PI * r;

	const slices = useMemo(() => {
		let acc = 0;
		return data.map((slice, idx) => {
			const frac = slice.value / total;
			const len = frac * c;
			const offset = acc;
			acc += len;

			return {
				...slice,
				stroke: slice.color || palette[idx % palette.length],
				len,
				offset,
			};
		});
	}, [data, total]);

	return (
		<div style={{ ...styles.card }}>
			<div style={styles.head}>
				<h4 style={styles.h4}>{title}</h4>
				<span style={styles.hint}>roles</span>
			</div>

			<div style={{ ...styles.body, display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, alignItems: 'center' }}>
				<div
					style={{
						width: 180,
						height: 180,
						borderRadius: 16,
						border: '1px solid rgba(16, 24, 40, 0.06)',
						background: 'rgba(16, 24, 40, 0.02)',
						display: 'grid',
						placeItems: 'center',
						position: 'relative',
						overflow: 'hidden',
					}}
				>
					<svg viewBox="0 0 36 36" style={{ width: 160, height: 160, transform: 'rotate(-90deg)' }}>
						{/* track */}
						<circle r={r} cx="18" cy="18" fill="none" stroke="rgba(16,24,40,.10)" strokeWidth="4.2" />

						{slices.map((s) => (
							<circle
								key={s.label}
								r={r}
								cx="18"
								cy="18"
								fill="none" // MUHIM: qora fillni yo‘q qiladi
								stroke={s.stroke}
								strokeWidth="4.2"
								strokeLinecap="butt"
								strokeDasharray={`${s.len} ${c - s.len}`}
								strokeDashoffset={-s.offset}
							/>
						))}
					</svg>

					<div style={{ position: 'absolute', textAlign: 'center' }}>
						<div style={{ fontSize: 12, color: '#667085', fontWeight: 700 }}>Total</div>
						<div style={{ fontSize: 20, color: '#0b1220', fontWeight: 900, letterSpacing: -0.4 }}>{total}</div>
					</div>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
					{data.map((slice, idx) => {
						const col = slice.color || palette[idx % palette.length];
						return (
							<div
								key={slice.label}
								style={{
									display: 'grid',
									gridTemplateColumns: '12px 1fr 36px',
									gap: 10,
									alignItems: 'center',
									padding: '8px 10px',
									borderRadius: 12,
									border: '1px solid rgba(16, 24, 40, 0.08)',
									background: '#fff',
								}}
							>
								<span style={{ width: 10, height: 10, borderRadius: 999, background: col }} />
								<span style={{ fontSize: 12.5, fontWeight: 800, color: '#0b1220' }}>{slice.label}</span>
								<span style={{ fontSize: 12.5, fontWeight: 900, color: '#0b1220', textAlign: 'right' }}>
									{slice.value}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

const Charts: React.FC<{ lineData: LinePoint[]; barData: BarPoint[]; pieData: PieSlice[] }> = ({
	lineData,
	barData,
	pieData,
}) => {
	return (
		<div style={styles.chartsWrap}>
			<div style={styles.left}>
				<LineChartCard title="Bookings per day" data={lineData} />
			</div>

			<div style={styles.right}>
				<BarChartCard title="Revenue per day" data={barData} />
				<DonutChartCard title="Users by role" data={pieData} />
			</div>
		</div>
	);
};

export default Charts;
