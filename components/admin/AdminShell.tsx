import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import Avatar from '@mui/material/Avatar';

import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

type NavItem = { label: string; href: string; icon: React.ReactNode };

type AdminShellProps = PropsWithChildren<{
	title: string;
	subtitle?: string;
	range: 'today' | '7d' | '30d';
	onRangeChange: (r: 'today' | '7d' | '30d') => void;
	activePath?: string;
}>;

const navItems: NavItem[] = [
	{ label: 'Dashboard', href: '/_admin', icon: <DashboardIcon /> },
	{ label: 'Users', href: '/_admin/users', icon: <PeopleAltIcon /> },
	{ label: 'Cars', href: '/_admin/cars', icon: <DirectionsCarFilledIcon /> },
	{ label: 'Bookings', href: '/_admin/bookings', icon: <BookOnlineIcon /> },
	{ label: 'Settings', href: '/_admin/settings', icon: <SettingsIcon /> },
];

const AdminShell: React.FC<AdminShellProps> = ({
	children,
	title,
	subtitle,
	range,
	onRangeChange,
	activePath = '/_admin',
}) => {
	const [collapsed, setCollapsed] = useState<boolean>(false);
	const [isMobile, setIsMobile] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const onResize = () => {
			const w = window.innerWidth;
			const mobile = w < 980;
			setIsMobile(mobile);
			if (mobile) {
				setCollapsed(true);
				setMobileOpen(false);
			}
		};
		onResize();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	const sidebarWidth = collapsed ? 88 : 276;

	const styles = useMemo(() => {
		const pageBg = '#f7f9fc';
		const border = '1px solid rgba(16, 24, 40, 0.10)';
		const shadow = '0 14px 40px rgba(16,24,40,.10)';

		return {
			shell: {
				minHeight: '100vh',
				background: pageBg,
				display: 'flex',
				position: 'relative' as const,
				overflowX: 'hidden' as const,
			},

			// Backdrop (mobile)
			backdrop: {
				display: mobileOpen ? 'block' : 'none',
				position: 'fixed' as const,
				inset: 0,
				background: 'rgba(16,24,40,.45)',
				zIndex: 30,
			},

			sidebar: {
				width: sidebarWidth,
				transition: 'width .18s ease',
				background: 'linear-gradient(160deg, #0b1220 0%, #121b35 55%, #0b1220 100%)',
				color: '#fff',
				borderRight: '1px solid rgba(255,255,255,.08)',
				position: isMobile ? ('fixed' as const) : ('sticky' as const),
				top: 0,
				height: '100vh',
				zIndex: 40,
				transform: isMobile ? (mobileOpen ? 'translateX(0)' : 'translateX(-110%)') : 'translateX(0)',
				transitionProperty: isMobile ? 'transform' : 'width',
				boxShadow: isMobile ? shadow : 'none',
			},

			sidebarInner: {
				height: '100%',
				display: 'flex',
				flexDirection: 'column' as const,
				padding: 14,
				gap: 14,
			},

			brand: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 10,
				padding: '10px 10px',
				borderRadius: 16,
				background: 'rgba(255,255,255,.06)',
				border: '1px solid rgba(255,255,255,.10)',
			},

			brandLeft: {
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				minWidth: 0,
			},

			brandLogo: {
				width: 36,
				height: 36,
				borderRadius: 12,
				display: 'grid',
				placeItems: 'center',
				fontWeight: 950,
				background: 'linear-gradient(135deg, rgba(79,139,255,.95), rgba(127,107,255,.95))',
				boxShadow: '0 10px 24px rgba(79,139,255,.25)',
				flex: '0 0 auto',
			},

			brandTextWrap: {
				display: collapsed ? 'none' : 'block',
				minWidth: 0,
			},

			brandTitle: {
				margin: 0,
				fontSize: 13,
				fontWeight: 900,
				letterSpacing: -0.2,
				lineHeight: 1.1,
				whiteSpace: 'nowrap' as const,
				overflow: 'hidden' as const,
				textOverflow: 'ellipsis' as const,
			},

			brandSub: {
				margin: 0,
				fontSize: 11.5,
				color: 'rgba(255,255,255,.70)',
				fontWeight: 700,
				whiteSpace: 'nowrap' as const,
				overflow: 'hidden' as const,
				textOverflow: 'ellipsis' as const,
			},

			toggleBtn: {
				width: 36,
				height: 36,
				borderRadius: 12,
				border: '1px solid rgba(255,255,255,.12)',
				background: 'rgba(255,255,255,.06)',
				color: '#fff',
				display: 'grid',
				placeItems: 'center',
				cursor: 'pointer',
				flex: '0 0 auto',
			},

			nav: {
				display: 'flex',
				flexDirection: 'column' as const,
				gap: 8,
				marginTop: 2,
			},

			navItem: {
				display: 'flex',
				alignItems: 'center',
				gap: 12,
				padding: '11px 12px',
				borderRadius: 16,
				textDecoration: 'none',
				color: 'rgba(255,255,255,.85)',
				border: '1px solid transparent',
				background: 'transparent',
				transition: 'background .12s ease, border-color .12s ease, transform .12s ease',
				cursor: 'pointer',
			},

			navItemActive: {
				background: 'rgba(255,255,255,.08)',
				borderColor: 'rgba(255,255,255,.12)',
				color: '#fff',
			},

			navIcon: {
				width: 38,
				height: 38,
				borderRadius: 14,
				display: 'grid',
				placeItems: 'center',
				background: 'rgba(255,255,255,.06)',
				border: '1px solid rgba(255,255,255,.10)',
				flex: '0 0 auto',
			},

			navLabel: {
				display: collapsed ? 'none' : 'block',
				fontSize: 13,
				fontWeight: 850,
				letterSpacing: -0.15,
				whiteSpace: 'nowrap' as const,
			},

			main: {
				flex: 1,
				minWidth: 0,
				padding: 18,
				paddingLeft: isMobile ? 18 : 18,
				marginLeft: isMobile ? 0 : 0,
			},

			header: {
				position: 'sticky' as const,
				top: 14,
				zIndex: 10,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 14,
				padding: 14,
				borderRadius: 18,
				background: 'rgba(255,255,255,.90)',
				border,
				boxShadow: '0 10px 26px rgba(16,24,40,.08)',
				backdropFilter: 'blur(10px)',
			},

			headerLeft: {
				minWidth: 0,
				display: 'flex',
				alignItems: 'center',
				gap: 10,
			},

			mobileMenuBtn: {
				display: isMobile ? 'grid' : 'none',
				placeItems: 'center',
				width: 38,
				height: 38,
				borderRadius: 14,
				border,
				background: '#fff',
				cursor: 'pointer',
			},

			titleWrap: { minWidth: 0 },

			h1: {
				margin: 0,
				fontSize: 16.5,
				fontWeight: 950,
				letterSpacing: -0.35,
				color: '#0b1220',
				lineHeight: 1.15,
				whiteSpace: 'nowrap' as const,
				overflow: 'hidden' as const,
				textOverflow: 'ellipsis' as const,
			},

			subtitle: {
				margin: 0,
				fontSize: 12.5,
				fontWeight: 700,
				color: '#667085',
				whiteSpace: 'nowrap' as const,
				overflow: 'hidden' as const,
				textOverflow: 'ellipsis' as const,
			},

			headerRight: {
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				flex: '0 0 auto',
			},

			range: {
				display: 'inline-flex',
				alignItems: 'center',
				gap: 6,
				padding: 4,
				borderRadius: 999,
				background: 'rgba(2, 6, 23, 0.04)',
				border,
			},

			rangeBtn: {
				display: 'inline-flex',
				alignItems: 'center',
				gap: 7,
				padding: '8px 10px',
				borderRadius: 999,
				border: '1px solid transparent',
				background: 'transparent',
				cursor: 'pointer',
				fontSize: 12.5,
				fontWeight: 850,
				color: '#0b1220',
				letterSpacing: -0.15,
				transition: 'background .12s ease, border-color .12s ease, transform .12s ease',
				whiteSpace: 'nowrap' as const,
			},

			rangeBtnActive: {
				background: '#fff',
				borderColor: 'rgba(79,139,255,.20)',
				boxShadow: '0 8px 18px rgba(16,24,40,.08)',
				color: '#2b63ff',
			},

			body: {
				marginTop: 16,
				minWidth: 0,
			},
		};
	}, [collapsed, isMobile, mobileOpen, sidebarWidth]);

	return (
		<div style={styles.shell}>
			<div style={styles.backdrop} onClick={() => setMobileOpen(false)} />

			<aside style={styles.sidebar} aria-label="Admin sidebar">
				<div style={styles.sidebarInner}>
					<div style={styles.brand}>
						<div style={styles.brandLeft}>
							<div style={styles.brandLogo}>C</div>
							<div style={styles.brandTextWrap}>
								<p style={styles.brandTitle}>Carento Admin</p>
								<p style={styles.brandSub}>Control Center</p>
							</div>
						</div>

						<button
							type="button"
							aria-label="Toggle sidebar"
							style={styles.toggleBtn}
							onClick={() => setCollapsed((v) => !v)}
						>
							{collapsed ? <MenuRoundedIcon /> : <CloseRoundedIcon />}
						</button>
					</div>

					<nav style={styles.nav}>
						{navItems.map((item) => {
							const active = activePath === item.href;
							return (
								<a
									key={item.href}
									href={item.href}
									style={{ ...styles.navItem, ...(active ? styles.navItemActive : {}) }}
									onMouseEnter={(e) => {
										(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
									}}
									onMouseLeave={(e) => {
										(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0px)';
									}}
								>
									<span style={styles.navIcon}>{item.icon}</span>
									<span style={styles.navLabel}>{item.label}</span>
								</a>
							);
						})}
					</nav>
				</div>
			</aside>

			<main style={styles.main}>
				<header style={styles.header}>
					<div style={styles.headerLeft}>
						<button
							type="button"
							aria-label="Open menu"
							style={styles.mobileMenuBtn}
							onClick={() => setMobileOpen(true)}
						>
							<MenuRoundedIcon />
						</button>

						<div style={styles.titleWrap}>
							<h1 style={styles.h1}>{title}</h1>
							{subtitle ? <p style={styles.subtitle}>{subtitle}</p> : null}
						</div>
					</div>

					<div style={styles.headerRight}>
						<div style={styles.range}>
							<button
								type="button"
								style={{ ...styles.rangeBtn, ...(range === 'today' ? styles.rangeBtnActive : {}) }}
								onClick={() => onRangeChange('today')}
							>
								<CalendarTodayIcon fontSize="small" />
								Today
							</button>
							<button
								type="button"
								style={{ ...styles.rangeBtn, ...(range === '7d' ? styles.rangeBtnActive : {}) }}
								onClick={() => onRangeChange('7d')}
							>
								<DateRangeIcon fontSize="small" />
								7d
							</button>
							<button
								type="button"
								style={{ ...styles.rangeBtn, ...(range === '30d' ? styles.rangeBtnActive : {}) }}
								onClick={() => onRangeChange('30d')}
							>
								<CalendarMonthIcon fontSize="small" />
								30d
							</button>
						</div>

						<Avatar sx={{ bgcolor: '#4f8bff', width: 38, height: 38, fontWeight: 900, letterSpacing: -0.2 }}>AD</Avatar>
					</div>
				</header>

				<div style={styles.body}>{children}</div>
			</main>
		</div>
	);
};

export default AdminShell;
