import Head from 'next/head';
import React, { useMemo, useState } from 'react';
import AdminShell from '../../components/admin/AdminShell';

type RangeKey = 'today' | '7d' | '30d';

const AdminSettingsPage = () => {
	const [range, setRange] = useState<RangeKey>('7d');

	// Mock settings state (keyinchalik API bilan ulaysiz)
	const [companyName, setCompanyName] = useState('Carento Admin');
	const [supportEmail, setSupportEmail] = useState('support@carento.com');
	const [timezone, setTimezone] = useState('Asia/Seoul');
	const [currency, setCurrency] = useState('USD');
	const [sessionTimeout, setSessionTimeout] = useState(30); // minutes

	const [enable2FA, setEnable2FA] = useState(true);
	const [passwordPolicy, setPasswordPolicy] = useState<'standard' | 'strict'>('strict');

	const [emailNotifs, setEmailNotifs] = useState(true);
	const [slackNotifs, setSlackNotifs] = useState(false);

	const [maintenanceMode, setMaintenanceMode] = useState(false);

	const rangeLabel = useMemo(() => {
		if (range === 'today') return 'Today';
		if (range === '7d') return 'Last 7 days';
		return 'Last 30 days';
	}, [range]);

	const styles: Record<string, React.CSSProperties> = {
		page: { display: 'flex', flexDirection: 'column', gap: 12 },

		topBar: {
			background: 'rgba(255,255,255,.92)',
			border: '1px solid rgba(16, 24, 40, 0.10)',
			borderRadius: 18,
			boxShadow: '0 10px 26px rgba(16,24,40,.08)',
			padding: 12,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: 10,
			flexWrap: 'wrap',
		},

		topLeft: { display: 'flex', flexDirection: 'column', gap: 4 },
		title: { margin: 0, fontSize: 13.5, fontWeight: 950, letterSpacing: -0.2, color: '#0b1220' },
		sub: { margin: 0, fontSize: 12.5, fontWeight: 750, color: '#667085' },

		topRight: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },

		pill: {
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

		btnPrimary: {
			height: 40,
			padding: '0 12px',
			borderRadius: 14,
			border: '1px solid rgba(79, 139, 255, 0.22)',
			background: 'linear-gradient(135deg, rgba(79,139,255,.95), rgba(127,107,255,.95))',
			color: '#fff',
			fontSize: 13,
			fontWeight: 950,
			letterSpacing: -0.2,
			cursor: 'pointer',
			boxShadow: '0 10px 22px rgba(79,139,255,.18)',
		},

		grid: {
			display: 'grid',
			gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
			gap: 12,
		},

		card: {
			background: '#fff',
			border: '1px solid rgba(16, 24, 40, 0.10)',
			borderRadius: 18,
			boxShadow: '0 10px 26px rgba(16,24,40,.08)',
			overflow: 'hidden',
		},

		cardHead: {
			padding: '14px 14px',
			display: 'flex',
			alignItems: 'baseline',
			justifyContent: 'space-between',
			gap: 10,
			borderBottom: '1px solid rgba(16, 24, 40, 0.08)',
			background: 'rgba(255,255,255,.92)',
		},

		cardTitle: { margin: 0, fontSize: 13.5, fontWeight: 950, letterSpacing: -0.2, color: '#0b1220' },
		cardHint: { fontSize: 12.5, fontWeight: 800, color: '#667085' },

		cardBody: { padding: 14, display: 'flex', flexDirection: 'column', gap: 12 },

		row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
		rowSingle: { display: 'grid', gridTemplateColumns: '1fr', gap: 10 },

		label: { fontSize: 12.5, fontWeight: 900, color: '#475467', marginBottom: 6 },
		input: {
			height: 40,
			width: '100%',
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
			width: '100%',
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

		toggleRow: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: 12,
			padding: 12,
			borderRadius: 16,
			border: '1px solid rgba(16,24,40,.08)',
			background: 'rgba(2,6,23,.02)',
		},
		toggleText: { display: 'flex', flexDirection: 'column', gap: 2 },
		toggleTitle: { margin: 0, fontSize: 13.5, fontWeight: 950, color: '#0b1220' },
		toggleSub: { margin: 0, fontSize: 12.5, fontWeight: 750, color: '#667085' },

		switch: {
			width: 46,
			height: 28,
			borderRadius: 999,
			border: '1px solid rgba(16,24,40,.12)',
			background: 'rgba(148,163,184,.25)',
			position: 'relative',
			cursor: 'pointer',
			flexShrink: 0,
		},
		switchOn: {
			background: 'rgba(79,139,255,.25)',
			borderColor: 'rgba(79,139,255,.35)',
		},
		knob: {
			width: 22,
			height: 22,
			borderRadius: 999,
			background: '#fff',
			boxShadow: '0 8px 16px rgba(16,24,40,.18)',
			position: 'absolute',
			top: 2,
			left: 2,
			transition: 'all .14s ease',
		},
		knobOn: { left: 22 },

		dangerWrap: {
			padding: 14,
			display: 'flex',
			flexDirection: 'column',
			gap: 10,
			background: 'rgba(255, 106, 112, 0.06)',
			borderTop: '1px solid rgba(255, 106, 112, 0.16)',
		},
		dangerTitle: { margin: 0, fontSize: 13.5, fontWeight: 950, color: '#9f1239' },
		dangerText: { margin: 0, fontSize: 12.5, fontWeight: 750, color: '#7f1d1d' },

		btnDanger: {
			height: 40,
			padding: '0 12px',
			borderRadius: 14,
			border: '1px solid rgba(255, 106, 112, 0.28)',
			background: 'linear-gradient(135deg, rgba(255,106,112,.95), rgba(255,138,92,.95))',
			color: '#fff',
			fontSize: 13,
			fontWeight: 950,
			cursor: 'pointer',
			boxShadow: '0 10px 22px rgba(255,106,112,.16)',
			alignSelf: 'flex-start',
		},

		// responsive feel
		col6: { gridColumn: 'span 6 / span 6' },
		col12: { gridColumn: 'span 12 / span 12' },
	};

	const Switch = ({ on, setOn }: { on: boolean; setOn: (v: boolean) => void }) => (
		<div
			role="switch"
			aria-checked={on}
			tabIndex={0}
			onClick={() => setOn(!on)}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') setOn(!on);
			}}
			style={{ ...styles.switch, ...(on ? styles.switchOn : {}) }}
		>
			<div style={{ ...styles.knob, ...(on ? styles.knobOn : {}) }} />
		</div>
	);

	const onSave = () => {
		// keyinchalik API call qilasiz
		alert('Saved (demo). Hook this up to your API.');
	};

	const onReset = () => {
		const ok = confirm('Reset demo data? This cannot be undone.');
		if (ok) alert('Demo data reset (demo). Hook up to your API.');
	};

	return (
		<>
			<Head>
				<title>Carento Admin | Settings</title>
			</Head>

			<AdminShell
				title="Settings"
				subtitle="Admin configuration"
				range={range}
				onRangeChange={setRange}
				activePath="/_admin/settings"
			>
				<div style={styles.page}>
					{/* Top actions */}
					<div style={styles.topBar}>
						<div style={styles.topLeft}>
							<p style={styles.title}>Configuration</p>
							<p style={styles.sub}>{rangeLabel} • Update application defaults, security, and notifications</p>
						</div>

						<div style={styles.topRight}>
							<span style={styles.pill}>Environment: Local</span>
							<button type="button" style={styles.btnPrimary} onClick={onSave}>
								Save changes
							</button>
						</div>
					</div>

					<div style={styles.grid}>
						{/* General */}
						<div style={{ ...styles.card, ...styles.col6 }}>
							<div style={styles.cardHead}>
								<h4 style={styles.cardTitle}>General</h4>
								<span style={styles.cardHint}>defaults</span>
							</div>
							<div style={styles.cardBody}>
								<div style={styles.row}>
									<div>
										<div style={styles.label}>Company name</div>
										<input style={styles.input} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
									</div>
									<div>
										<div style={styles.label}>Support email</div>
										<input
											style={styles.input}
											value={supportEmail}
											onChange={(e) => setSupportEmail(e.target.value)}
										/>
									</div>
								</div>

								<div style={styles.row}>
									<div>
										<div style={styles.label}>Timezone</div>
										<select style={styles.select} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
											<option value="Asia/Seoul">Asia/Seoul</option>
											<option value="UTC">UTC</option>
											<option value="Europe/London">Europe/London</option>
											<option value="America/Los_Angeles">America/Los_Angeles</option>
										</select>
									</div>
									<div>
										<div style={styles.label}>Currency</div>
										<select style={styles.select} value={currency} onChange={(e) => setCurrency(e.target.value)}>
											<option value="USD">USD</option>
											<option value="KRW">KRW</option>
											<option value="EUR">EUR</option>
											<option value="GBP">GBP</option>
										</select>
									</div>
								</div>
							</div>
						</div>

						{/* Security */}
						<div style={{ ...styles.card, ...styles.col6 }}>
							<div style={styles.cardHead}>
								<h4 style={styles.cardTitle}>Security</h4>
								<span style={styles.cardHint}>auth & sessions</span>
							</div>
							<div style={styles.cardBody}>
								<div style={styles.toggleRow}>
									<div style={styles.toggleText}>
										<p style={styles.toggleTitle}>Two-factor authentication</p>
										<p style={styles.toggleSub}>Require 2FA for all admin accounts</p>
									</div>
									<Switch on={enable2FA} setOn={setEnable2FA} />
								</div>

								<div style={styles.row}>
									<div>
										<div style={styles.label}>Password policy</div>
										<select
											style={styles.select}
											value={passwordPolicy}
											onChange={(e) => setPasswordPolicy(e.target.value as any)}
										>
											<option value="standard">Standard</option>
											<option value="strict">Strict</option>
										</select>
									</div>
									<div>
										<div style={styles.label}>Session timeout (minutes)</div>
										<input
											style={styles.input}
											type="number"
											min={5}
											max={240}
											value={sessionTimeout}
											onChange={(e) => setSessionTimeout(Number(e.target.value))}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Notifications */}
						<div style={{ ...styles.card, ...styles.col6 }}>
							<div style={styles.cardHead}>
								<h4 style={styles.cardTitle}>Notifications</h4>
								<span style={styles.cardHint}>delivery</span>
							</div>
							<div style={styles.cardBody}>
								<div style={styles.toggleRow}>
									<div style={styles.toggleText}>
										<p style={styles.toggleTitle}>Email notifications</p>
										<p style={styles.toggleSub}>Send booking/payment alerts to admins</p>
									</div>
									<Switch on={emailNotifs} setOn={setEmailNotifs} />
								</div>

								<div style={styles.toggleRow}>
									<div style={styles.toggleText}>
										<p style={styles.toggleTitle}>Slack notifications</p>
										<p style={styles.toggleSub}>Post critical events to Slack channel</p>
									</div>
									<Switch on={slackNotifs} setOn={setSlackNotifs} />
								</div>
							</div>
						</div>

						{/* Maintenance */}
						<div style={{ ...styles.card, ...styles.col6 }}>
							<div style={styles.cardHead}>
								<h4 style={styles.cardTitle}>Operations</h4>
								<span style={styles.cardHint}>runtime</span>
							</div>
							<div style={styles.cardBody}>
								<div style={styles.toggleRow}>
									<div style={styles.toggleText}>
										<p style={styles.toggleTitle}>Maintenance mode</p>
										<p style={styles.toggleSub}>Restrict access for non-admin users</p>
									</div>
									<Switch on={maintenanceMode} setOn={setMaintenanceMode} />
								</div>

								<div style={styles.rowSingle}>
									<div>
										<div style={styles.label}>Notes</div>
										<input
											style={styles.input}
											placeholder="Optional: show message during maintenance"
											defaultValue=""
											onChange={() => void 0}
										/>
									</div>
								</div>
							</div>

							{/* Danger zone */}
							<div style={styles.dangerWrap}>
								<p style={styles.dangerTitle}>Danger zone</p>
								<p style={styles.dangerText}>
									These actions are destructive. Use only in development or with explicit approval.
								</p>
								<button type="button" style={styles.btnDanger} onClick={onReset}>
									Reset demo data
								</button>
							</div>
						</div>

						{/* Footer note */}
						<div style={{ ...styles.card, ...styles.col12 }}>
							<div style={styles.cardHead}>
								<h4 style={styles.cardTitle}>Summary</h4>
								<span style={styles.cardHint}>preview</span>
							</div>
							<div style={styles.cardBody}>
								<div style={styles.row}>
									<div>
										<div style={styles.label}>Company</div>
										<input style={styles.input} value={companyName} readOnly />
									</div>
									<div>
										<div style={styles.label}>Support</div>
										<input style={styles.input} value={supportEmail} readOnly />
									</div>
								</div>
								<div style={styles.row}>
									<div>
										<div style={styles.label}>Timezone</div>
										<input style={styles.input} value={timezone} readOnly />
									</div>
									<div>
										<div style={styles.label}>Currency</div>
										<input style={styles.input} value={currency} readOnly />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</AdminShell>
		</>
	);
};

export default AdminSettingsPage;
