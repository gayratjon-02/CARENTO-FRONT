import React, { CSSProperties, useMemo } from 'react';

export type StatsCardProps = {
	title: string;
	value: string | number;
	subtitle?: string;
	delta?: string; // masalan: "+12.4%" yoki "-3.1%" yoki "12%"
	icon?: React.ReactNode;
	loading?: boolean;
	emptyText?: string;
};

const styles = {
	card: {
		display: 'flex',
		gap: 12,
		alignItems: 'stretch',
		padding: 14,
		borderRadius: 16,
		background: '#ffffff',
		border: '1px solid rgba(16, 24, 40, 0.10)',
		boxShadow: '0 6px 18px rgba(16,24,40,.06)',
		transition: 'transform .15s ease, box-shadow .15s ease, border-color .15s ease',
		minHeight: 86,
	} as CSSProperties,

	iconWrap: {
		flex: '0 0 auto',
		width: 44,
		height: 44,
		borderRadius: 14,
		display: 'grid',
		placeItems: 'center',
		background: 'linear-gradient(135deg, rgba(79,139,255,.18), rgba(127,107,255,.16))',
		border: '1px solid rgba(79,139,255,.22)',
		color: '#2b63ff',
	} as CSSProperties,

	body: {
		minWidth: 0,
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		gap: 6,
	} as CSSProperties,

	topRow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 10,
		minWidth: 0,
	} as CSSProperties,

	title: {
		margin: 0,
		fontSize: 12.5,
		fontWeight: 900,
		letterSpacing: -0.15,
		color: '#0b1220',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	} as CSSProperties,

	value: {
		margin: 0,
		fontSize: 22,
		fontWeight: 950,
		letterSpacing: -0.6,
		color: '#0b1220',
		lineHeight: 1.05,
		fontVariantNumeric: 'tabular-nums',
	} as CSSProperties,

	subtitle: {
		margin: 0,
		fontSize: 12.5,
		color: '#667085',
		fontWeight: 650,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	} as CSSProperties,

	deltaPillBase: {
		flex: '0 0 auto',
		display: 'inline-flex',
		alignItems: 'center',
		gap: 6,
		padding: '4px 9px',
		borderRadius: 999,
		fontSize: 11.5,
		fontWeight: 900,
		letterSpacing: 0.2,
		border: '1px solid rgba(16, 24, 40, 0.10)',
		userSelect: 'none',
		fontVariantNumeric: 'tabular-nums',
	} as CSSProperties,

	deltaDot: {
		width: 7,
		height: 7,
		borderRadius: 999,
	} as CSSProperties,
};

function normalizeValue(value: string | number, emptyText: string) {
	if (value === null || value === undefined) return emptyText;
	if (typeof value === 'string' && value.trim() === '') return emptyText;
	return value;
}

function getDeltaMeta(delta?: string) {
	if (!delta) return null;

	const trimmed = delta.trim();
	const isNegative = trimmed.startsWith('-') || trimmed.toLowerCase().includes('down') || trimmed.includes('▼');

	const isPositive = trimmed.startsWith('+') || trimmed.toLowerCase().includes('up') || trimmed.includes('▲');

	const arrow = isNegative ? '▼' : isPositive ? '▲' : '•';

	if (isNegative) {
		return {
			pill: {
				...styles.deltaPillBase,
				background: 'rgba(239, 68, 68, 0.10)',
				borderColor: 'rgba(239, 68, 68, 0.22)',
				color: '#b42318',
			} as CSSProperties,
			dot: { ...styles.deltaDot, background: '#ef4444' } as CSSProperties,
			text: `${arrow} ${trimmed.replace(/^[-+]\s*/, '')}`,
		};
	}

	if (isPositive) {
		return {
			pill: {
				...styles.deltaPillBase,
				background: 'rgba(16, 185, 129, 0.10)',
				borderColor: 'rgba(16, 185, 129, 0.22)',
				color: '#067647',
			} as CSSProperties,
			dot: { ...styles.deltaDot, background: '#10b981' } as CSSProperties,
			text: `${arrow} ${trimmed.replace(/^[-+]\s*/, '')}`,
		};
	}

	// neytral
	return {
		pill: {
			...styles.deltaPillBase,
			background: 'rgba(79, 139, 255, 0.10)',
			borderColor: 'rgba(79, 139, 255, 0.18)',
			color: '#2b63ff',
		} as CSSProperties,
		dot: { ...styles.deltaDot, background: '#4f8bff' } as CSSProperties,
		text: trimmed,
	};
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
	const deltaMeta = useMemo(() => getDeltaMeta(delta), [delta]);
	const displayValue = useMemo(() => (loading ? '—' : normalizeValue(value, emptyText)), [loading, value, emptyText]);

	return (
		<div
			style={styles.card}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
				(e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 26px rgba(16,24,40,.10)';
				(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(79,139,255,.22)';
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0px)';
				(e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 18px rgba(16,24,40,.06)';
				(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(16, 24, 40, 0.10)';
			}}
		>
			<div style={styles.iconWrap}>{icon ?? <span style={{ fontWeight: 900 }}>•</span>}</div>

			<div style={styles.body}>
				<div style={styles.topRow}>
					<p style={styles.title} title={title}>
						{title}
					</p>

					{deltaMeta && (
						<span style={deltaMeta.pill} title={delta}>
							<span style={deltaMeta.dot} />
							{deltaMeta.text}
						</span>
					)}
				</div>

				<p style={styles.value}>{displayValue as any}</p>

				{subtitle && (
					<p style={styles.subtitle} title={subtitle}>
						{subtitle}
					</p>
				)}
			</div>
		</div>
	);
};

export default StatsCard;
