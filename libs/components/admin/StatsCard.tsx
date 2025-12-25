import React, { useMemo } from 'react';

export type StatsCardProps = {
	title: string;
	value: string | number;
	subtitle?: string;
	delta?: string;
	icon?: React.ReactNode;
	loading?: boolean;
	emptyText?: string;
};

function normalizeValue(value: string | number | undefined, emptyText: string) {
	if (value === null || value === undefined) return emptyText;
	if (typeof value === 'number') return value.toLocaleString();
	return value;
}

function getDeltaMeta(delta: string) {
	const d = delta.trim();
	const isPositive = d.startsWith('+');
	const isNegative = d.startsWith('-');

	if (isPositive) return { bg: 'rgba(16,185,129,.12)', border: 'rgba(16,185,129,.22)', fg: '#067647' };
	if (isNegative) return { bg: 'rgba(239,68,68,.12)', border: 'rgba(239,68,68,.22)', fg: '#b42318' };
	return { bg: 'rgba(148,163,184,.16)', border: 'rgba(148,163,184,.26)', fg: '#334155' };
}

const StatsCard: React.FC<StatsCardProps> = ({
	title,
	value,
	subtitle,
	delta,
	icon,
	loading = false,
	emptyText = 'No data',
}) => {
	const displayValue = useMemo(
		() => (loading ? '—' : normalizeValue(value as any, emptyText)),
		[loading, value, emptyText],
	);

	const deltaMeta = useMemo(() => (delta ? getDeltaMeta(delta) : null), [delta]);

	const styles: Record<string, React.CSSProperties> = {
		card: {
			background: '#fff',
			border: '1px solid rgba(16, 24, 40, 0.10)',
			borderRadius: 18,
			boxShadow: '0 10px 26px rgba(16,24,40,.08)',
			padding: 14,
			display: 'flex',
			gap: 12,
			alignItems: 'flex-start',
			minHeight: 86,
		},
		iconWrap: {
			width: 44,
			height: 44,
			borderRadius: 14,
			border: '1px solid rgba(79, 139, 255, 0.18)',
			background: 'rgba(79, 139, 255, 0.08)',
			display: 'grid',
			placeItems: 'center',
			color: '#2b63ff',
			flexShrink: 0,
		},
		body: { flex: 1, minWidth: 0 },
		row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
		title: { margin: 0, fontSize: 12.5, fontWeight: 900, color: '#475467', letterSpacing: 0.2 },
		value: { marginTop: 6, fontSize: 22, fontWeight: 950, letterSpacing: -0.6, color: '#0b1220' },
		sub: { margin: '6px 0 0', fontSize: 12.5, fontWeight: 750, color: '#667085' },
		delta: {
			padding: '5px 10px',
			borderRadius: 999,
			border: '1px solid rgba(16, 24, 40, 0.10)',
			fontSize: 12,
			fontWeight: 900,
			whiteSpace: 'nowrap',
		},
	};

	return (
		<div style={styles.card}>
			{icon ? <div style={styles.iconWrap}>{icon}</div> : null}

			<div style={styles.body}>
				<div style={styles.row}>
					<p style={styles.title}>{title}</p>
					{deltaMeta && (
						<span
							style={{ ...styles.delta, background: deltaMeta.bg, borderColor: deltaMeta.border, color: deltaMeta.fg }}
						>
							{delta}
						</span>
					)}
				</div>

				<div style={styles.value}>{displayValue}</div>

				{subtitle ? <p style={styles.sub}>{subtitle}</p> : null}
			</div>
		</div>
	);
};

export default StatsCard;
