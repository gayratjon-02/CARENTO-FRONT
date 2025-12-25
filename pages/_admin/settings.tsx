import Head from 'next/head';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AdminShell from '../../components/admin/AdminShell';

type RangeKey = 'today' | '7d' | '30d';

type PasswordPolicy = 'standard' | 'strict';

type AdminSettingsState = {
	companyName: string;
	supportEmail: string;
	timezone: string;
	currency: string;
	sessionTimeout: number;

	enable2FA: boolean;
	passwordPolicy: PasswordPolicy;

	emailNotifs: boolean;
	slackNotifs: boolean;

	maintenanceMode: boolean;
	maintenanceNote: string;
};

const AdminSettingsPage = () => {
	const [range, setRange] = useState<RangeKey>('7d');
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const onResize = () => setIsMobile(window.innerWidth < 920);
		onResize();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	// Initial state (keyinchalik API'dan keladi)
	const initialState: AdminSettingsState = {
		companyName: 'Carento Admin',
		supportEmail: 'support@carento.com',
		timezone: 'Asia/Seoul',
		currency: 'USD',
		sessionTimeout: 30,

		enable2FA: true,
		passwordPolicy: 'strict',

		emailNotifs: true,
		slackNotifs: false,

		maintenanceMode: false,
		maintenanceNote: '',
	};

	const initialRef = useRef<AdminSettingsState>(initialState);

	const [state, setState] = useState<AdminSettingsState>(initialState);

	const rangeLabel = useMemo(() => {
		if (range === 'today') return 'Today';
		if (range === '7d') return 'Last 7 days';
		return 'Last 30 days';
	}, [range]);

	const envLabel = useMemo(() => {
		const v = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || 'local';
		return String(v).toUpperCase();
	}, []);

	const isDirty = useMemo(() => {
		// Bu yerda hammasi primitive bo‘lgani uchun stringify yetarli
		return JSON.stringify(state) !== JSON.stringify(initialRef.current);
	}, [state]);

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
			opacity: isDirty ? 1 : 0.55,
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

		row: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 },

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

		textarea: {
			width: '100%',
			minHeight: 92,
			padding: 12,
			borderRadius: 14,
			border: '1px solid rgba(16, 24, 40, 0.12)',
			background: '#fff',
			outline: 'none',
			fontSize: 13.5,
			fontWeight: 800,
			color: '#0b1220',
			boxShadow: '0 6px 16px rgba(16,24,40,.06)',
			resize: 'vertical',
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

		col6: { gridColumn: isMobile ? 'span 12 / span 12' : 'span 6 / span 6' },
		col12: { gridColumn: 'span 12 / span 12' },
	};

	const Switch = ({ on, setOn, label }: { on: boolean; setOn: (v: boolean) => void; label: string }) => (
		<div
			role="switch"
			aria-label={label}
			aria-checked={on}
			tabIndex={0}
			onClick={() => setOn(!on)}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					setOn(!on);
				}
			}}
			style={{ ...styles.switch, ...(on ? styles.switchOn : {}) }}
		>
			<div style={{ ...styles.knob, ...(on ? styles.knobOn : {}) }} />
		</div>
	);

	const onSave = () => {
		// Keyinchalik: UPDATE_SETTINGS mutationga shu payload ketadi
		const payload = {
			...state,
			// optional: range serverga kerak bo‘lsa:
			range,
		};

		console.log('SETTINGS_PAYLOAD', payload);
		alert('Saved (demo). Hook this up to your API.');
	};

	const onReset = () => {
		const ok = confirm('Reset settings to defaults?');
		if (!ok) return;
		setState(initialRef.current);
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
					<div style={styles.topBar}>
						<div style={styles.topLeft}>
							<p style={styles.title}>Configuration</p>
							<p style={styles.sub}>{rangeLabel} • Update application defaults, security, and notifications</p>
						</div>

						<div style={styles.topRight}>
							<span style={styles.pill}>Environment: {envLabel}</span>
							<button type="button" style={styles.btnPrimary} onClick={onSave} disabled={!isDirty}>
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
										<input
											style={styles.input}
											value={state.companyName}
											onChange={(e) => setState((p) => ({ ...p, companyName: e.target.value }))}
										/>
									</div>
									<div>
										<div style={styles.label}>Support email</div>
										<input
											style={styles.input}
											value={state.supportEmail}
											onChange={(e) => setState((p) => ({ ...p, supportEmail: e.target.value }))}
										/>
									</div>
								</div>

								<div style={styles.row}>
									<div>
										<div style={styles.label}>Timezone</div>
										<select
											style={styles.select}
											value={state.timezone}
											onChange={(e) => setState((p) => ({ ...p, timezone: e.target.value }))}
										>
											<option value="Asia/Seoul">Asia/Seoul</option>
											<option value="UTC">UTC</option>
											<option value="Europe/London">Europe/London</option>
											<option value="America/Los_Angeles">America/Los_Angeles</option>
										</select>
									</div>
									<div>
										<div style={styles.label}>Currency</div>
										<select
											style={styles.select}
											value={state.currency}
											onChange={(e) => setState((p) => ({ ...p, currency: e.target.value }))}
										>
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
									<Switch
										label="Two-factor authentication"
										on={state.enable2FA}
										setOn={(v) => setState((p) => ({ ...p, enable2FA: v }))}
									/>
								</div>

								<div style={styles.row}>
									<div>
										<div style={styles.label}>Password policy</div>
										<select
											style={styles.select}
											value={state.passwordPolicy}
											onChange={(e) => setState((p) => ({ ...p, passwordPolicy: e.target.value as PasswordPolicy }))}
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
											value={state.sessionTimeout}
											onChange={(e) => setState((p) => ({ ...p, sessionTimeout: Number(e.target.value) }))}
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
									<Switch
										label="Email notifications"
										on={state.emailNotifs}
										setOn={(v) => setState((p) => ({ ...p, emailNotifs: v }))}
									/>
								</div>

								<div style={styles.toggleRow}>
									<div style={styles.toggleText}>
										<p style={styles.toggleTitle}>Slack notifications</p>
										<p style={styles.toggleSub}>Post critical events to Slack channel</p>
									</div>
									<Switch
										label="Slack notifications"
										on={state.slackNotifs}
										setOn={(v) => setState((p) => ({ ...p, slackNotifs: v }))}
									/>
								</div>
							</div>
						</div>

						{/* Operations */}
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
									<Switch
										label="Maintenance mode"
										on={state.maintenanceMode}
										setOn={(v) => setState((p) => ({ ...p, maintenanceMode: v }))}
									/>
								</div>

								<div>
									<div style={styles.label}>Notes</div>
									<textarea
										style={styles.textarea}
										placeholder="Optional: show message during maintenance"
										value={state.maintenanceNote}
										onChange={(e) => setState((p) => ({ ...p, maintenanceNote: e.target.value }))}
									/>
								</div>
							</div>

							<div style={styles.dangerWrap}>
								<p style={styles.dangerTitle}>Danger zone</p>
								<p style={styles.dangerText}>
									These actions are destructive. Use only in development or with explicit approval.
								</p>

								<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
									<button type="button" style={styles.btnDanger} onClick={onReset}>
										Reset to defaults
									</button>

									<button
										type="button"
										style={{
											...styles.btnDanger,
											background: 'linear-gradient(135deg, rgba(148,163,184,.95), rgba(71,85,105,.95))',
											borderColor: 'rgba(148,163,184,.28)',
											boxShadow: '0 10px 22px rgba(71,85,105,.12)',
										}}
										onClick={() => {
											initialRef.current = state;
											alert('Default snapshot updated (demo).');
										}}
									>
										Set current as default
									</button>
								</div>
							</div>
						</div>

						{/* Summary */}
						<div style={{ ...styles.card, ...styles.col12 }}>
							<div style={styles.cardHead}>
								<h4 style={styles.cardTitle}>Summary</h4>
								<span style={styles.cardHint}>preview</span>
							</div>
							<div style={styles.cardBody}>
								<div style={styles.row}>
									<div>
										<div style={styles.label}>Company</div>
										<input style={styles.input} value={state.companyName} readOnly />
									</div>
									<div>
										<div style={styles.label}>Support</div>
										<input style={styles.input} value={state.supportEmail} readOnly />
									</div>
								</div>
								<div style={styles.row}>
									<div>
										<div style={styles.label}>Timezone</div>
										<input style={styles.input} value={state.timezone} readOnly />
									</div>
									<div>
										<div style={styles.label}>Currency</div>
										<input style={styles.input} value={state.currency} readOnly />
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
