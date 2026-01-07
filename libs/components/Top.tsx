import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { Stack, Box, Badge } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import { alpha, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Logout } from '@mui/icons-material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import {
	CaretDown,
	BellRinging,
	HouseSimple,
	CarSimple,
	Buildings,
	ChatsCircle,
	Headset,
	UserCircle,
} from 'phosphor-react';

import useDeviceDetect from '../hooks/useDeviceDetect';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { REACT_APP_API_URL } from '../config';
import { GetNotifications } from '../../apollo/user/query';
import { sweetLoginConfirmAlert } from '../sweetAlert';
import { NotificationStatus } from '../enum/notification.enum';

type Lang = 'en' | 'kr' | 'ru';
type Currency = 'KRW' | 'USD';

const StyledMenu = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
		transformOrigin={{ vertical: 'top', horizontal: 'right' }}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		top: '109px',
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 160,
		color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		'& .MuiMenu-list': {
			padding: '4px 0',
		},
		'& .MuiMenuItem-root': {
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			'&:active': {
				backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
			},
		},
	},
}));

const Top: React.FC = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

	const { t, i18n } = useTranslation('common');
	const router = useRouter();

	const [lang, setLang] = useState<Lang>('en');
	const [currency, setCurrency] = useState<Currency>('KRW');

	const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
	const [currencyAnchor, setCurrencyAnchor] = useState<null | HTMLElement>(null);
	const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);

	const langOpen = Boolean(langAnchor);
	const currencyOpen = Boolean(currencyAnchor);
	const logoutOpen = Boolean(logoutAnchor);

	const [colorChange, setColorChange] = useState(false);
	const [bgColor, setBgColor] = useState(false);
	const [authToken, setAuthToken] = useState<string | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);

	// locale -> i18n sync
	useEffect(() => {
		const currentLocale =
			(router.locale as Lang | undefined) ||
			((typeof window !== 'undefined' ? (localStorage.getItem('locale') as Lang | null) : null) ?? 'en');

		setLang(currentLocale);

		// FIX: i18n.changeLanguage mavjud bo'lsa chaqiramiz (runtime error bartaraf)
		if (i18n?.language !== currentLocale && typeof (i18n as any)?.changeLanguage === 'function') {
			(i18n as any).changeLanguage(currentLocale);
		}

		if (typeof window !== 'undefined') {
			localStorage.setItem('locale', currentLocale);
		}
	}, [router.locale, i18n]);

	// currency init
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const saved = (localStorage.getItem('currency') as Currency | null) ?? 'KRW';
		setCurrency(saved);
		localStorage.setItem('currency', saved);
	}, []);

	useEffect(() => {
		setBgColor(router.pathname === '/car/detail');
	}, [router.pathname]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) {
			setAuthToken(jwt);
			updateUserInfo(jwt);
		}
	}, []);

	useEffect(() => {
		const onScroll = () => setColorChange(window.scrollY >= 50);
		onScroll();
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		const handleRouteChange = () => setMenuOpen(false);
		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	const navLinks = useMemo(() => {
		const links = [
			{
				href: '/',
				label: t('Home', { defaultValue: 'Home' }),
				icon: <HouseSimple size={18} weight="fill" />,
			},
			{
				href: '/car',
				label: t('Cars', { defaultValue: 'Cars' }),
				icon: <CarSimple size={18} weight="fill" />,
			},
			{
				href: '/dealers',
				label: t('Dealers', { defaultValue: 'Dealers' }),
				icon: <Buildings size={18} weight="fill" />,
			},
			{
				href: '/community?articleCategory=FREE',
				label: t('Community', { defaultValue: 'Community' }),
				icon: <ChatsCircle size={18} weight="fill" />,
			},
		];

		if (user?._id) {
			links.push({
				href: '/mypage',
				label: t('My Page', { defaultValue: 'My Page' }),
				icon: <UserCircle size={18} weight="fill" />,
			});
		}

		links.push({
			href: '/cs',
			label: t('Support', { defaultValue: 'Support' }),
			icon: <Headset size={18} weight="fill" />,
		});

		return links;
	}, [t, user?._id]);

	const isActiveRoute = useCallback(
		(href: string) => {
			if (href === '/') return router.pathname === '/';
			return router.asPath.startsWith(href);
		},
		[router.asPath, router.pathname],
	);

	const handleLangOpen = (e: React.MouseEvent<HTMLElement>) => setLangAnchor(e.currentTarget);
	const handleLangClose = () => setLangAnchor(null);

	const handleLangChoice = useCallback(
		async (e: React.MouseEvent<HTMLElement>) => {
			const selected = (e.currentTarget as HTMLElement).id as Lang;
			if (!['en', 'kr', 'ru'].includes(selected)) return;
			setLangAnchor(null);
			await router.push(router.asPath, router.asPath, { locale: selected });
		},
		[router],
	);

	const handleCurrencyOpen = (e: React.MouseEvent<HTMLElement>) => setCurrencyAnchor(e.currentTarget);
	const handleCurrencyClose = () => setCurrencyAnchor(null);

	const handleCurrencyChoice = useCallback((e: React.MouseEvent<HTMLElement>) => {
		const selected = (e.currentTarget as HTMLElement).id as Currency;
		if (!['KRW', 'USD'].includes(selected)) return;
		setCurrency(selected);
		if (typeof window !== 'undefined') {
			localStorage.setItem('currency', selected);
		}
		setCurrencyAnchor(null);
	}, []);

	const { data: notificationsData } = useQuery(GetNotifications, {
		fetchPolicy: 'network-only',
		variables: { input: {} },
		notifyOnNetworkStatusChange: true,
		skip: !authToken,
	});

	const notificationCount = useMemo(() => {
		const list = notificationsData?.getNotifications?.list ?? [];
		return list.filter((n: any) => n.notificationStatus === NotificationStatus.WAIT).length;
	}, [notificationsData]);

	const handleNotificationClick = useCallback(async () => {
		if (!user?._id) {
			const confirmed = await sweetLoginConfirmAlert('Please log in first.');
			if (confirmed) {
				router.push('/account/join');
			}
			return;
		}
		router.push('/notification');
	}, [router, user?._id]);

	const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
	const closeMenu = useCallback(() => setMenuOpen(false), []);

	if (device === 'mobile') {
		return (
			<Stack className={`top mobile-top ${menuOpen ? 'menu-open' : ''}`}>
				<Box className="mobile-top-bar">
					<Link href="/" className="brand">
						<img src="/img/icons/main-logotip.svg" alt="Carento Logo" />
						<span>Carento</span>
					</Link>
					<Box className="mobile-actions">
						<IconButton className="notification-btn" onClick={handleNotificationClick} aria-label="Notifications">
							<Badge
								badgeContent={notificationCount}
								color="error"
								max={99}
								sx={{
									'& .MuiBadge-badge': {
										right: 0,
										top: 2,
									},
								}}
							>
								<BellRinging size={22} weight="duotone" />
							</Badge>
						</IconButton>
						<IconButton className="menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
							{menuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
						</IconButton>
					</Box>
				</Box>

				<Box className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
					<Box className="drawer-section">
						<p className="drawer-title">{t('Menu', { defaultValue: 'Menu' })}</p>
						<Stack className="drawer-nav">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={`drawer-nav-item ${isActiveRoute(link.href) ? 'active' : ''}`}
									onClick={closeMenu}
								>
									<span className="icon">{link.icon}</span>
									<span className="label">{link.label}</span>
								</Link>
							))}
						</Stack>
					</Box>

					<Box className="drawer-section">
						<p className="drawer-title">{t('Preferences', { defaultValue: 'Preferences' })}</p>
						<Box className="pref-row">
							<Button
								variant="outlined"
								className="pref-btn"
								onClick={handleLangOpen}
								endIcon={<CaretDown size={14} />}
							>
								<img src={`/img/flag/lang${lang}.png`} alt="flag" />
								<span>{lang.toUpperCase()}</span>
							</Button>
							<Button
								variant="outlined"
								className="pref-btn"
								onClick={handleCurrencyOpen}
								endIcon={<CaretDown size={14} />}
							>
								<span className="currency-symbol">{currency === 'USD' ? '$' : '₩'}</span>
								<span>{currency}</span>
							</Button>
						</Box>
					</Box>

					<Box className="drawer-section">
						<p className="drawer-title">{t('Account', { defaultValue: 'Account' })}</p>
						{user?._id ? (
							<Box className="user-quick">
								<Box className="avatar">
									<img
										src={user?.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg'}
										alt="user avatar"
									/>
								</Box>
								<Box className="user-meta">
									<strong>{user?.memberNick || t('User', { defaultValue: 'User' })}</strong>
									<span>{user?.memberEmail || t('Logged in', { defaultValue: 'Logged in' })}</span>
								</Box>
								<Button
									variant="contained"
									color="primary"
									className="logout-btn"
									onClick={() => {
										closeMenu();
										logOut();
									}}
								>
									{t('Logout', { defaultValue: 'Logout' })}
								</Button>
							</Box>
						) : (
							<Link href="/account/join" className="auth-btn" onClick={closeMenu}>
								<span>{t('Login / Sign up', { defaultValue: 'Login / Sign up' })}</span>
								<AccountCircleOutlinedIcon fontSize="small" />
							</Link>
						)}
					</Box>
				</Box>

				{menuOpen && <div className="mobile-drawer-backdrop" onClick={closeMenu} />}
			</Stack>
		);
	}

	return (
		<Stack className="navbar">
			<Box component="div" className={`topbar-shell ${colorChange ? 'scrolled' : ''} ${bgColor ? 'transparent' : ''}`}>
				<Box component="div" className="topbar glass">
					{/* LEFT BRAND */}
					<Box component="div" className="left-brand">
						<Link href="/" className="brand-link">
							<img src="/img/icons/main-logotip.svg" alt="Carento Logo" />
							<span className="logo-text">Carento</span>
						</Link>
					</Box>

					{/* MAIN NAV */}
					<Box component="div" className="main-nav">
						{navLinks.map((link) => (
							<Link key={link.href} href={link.href} className={`nav-pill ${isActiveRoute(link.href) ? 'active' : ''}`}>
								<span className="nav-icon">{link.icon}</span>
								<span className="nav-label">{link.label}</span>
							</Link>
						))}
					</Box>

					{/* RIGHT ACTIONS */}
					<Box component="div" className="right-actions">
						{/* NOTIFICATIONS */}
						<Box component="div" className="action-pill notification-pill" onClick={handleNotificationClick}>
							<Badge
								badgeContent={notificationCount}
								color="error"
								max={99}
								sx={{
									'& .MuiBadge-badge': {
										right: 4,
										top: 4,
										fontSize: '10px',
										fontWeight: 600,
										minWidth: '18px',
										height: '18px',
										padding: '0 4px',
									},
								}}
							>
								<BellRinging size={22} weight="duotone" className="notification-icon" color="#fff" />
							</Badge>
						</Box>

						{/* LANGUAGE */}
						<div className="lang-box">
							<Button
								disableRipple
								className="action-pill btn-lang"
								onClick={handleLangOpen}
								endIcon={<CaretDown size={14} color="#b6b9d6" weight="fill" />}
							>
								<Box component="div" className="flag">
									<img src={`/img/flag/lang${lang}.png`} alt="flag" />
								</Box>
							</Button>

							<StyledMenu anchorEl={langAnchor} open={langOpen} onClose={handleLangClose} sx={{ position: 'absolute' }}>
								<MenuItem disableRipple onClick={handleLangChoice} id="en">
									<img className="img-flag" src="/img/flag/langen.png" alt="usaFlag" />
									{t('English')}
								</MenuItem>
								<MenuItem disableRipple onClick={handleLangChoice} id="kr">
									<img className="img-flag" src="/img/flag/langkr.png" alt="koreanFlag" />
									{t('Korean')}
								</MenuItem>
								<MenuItem disableRipple onClick={handleLangChoice} id="ru">
									<img className="img-flag" src="/img/flag/langru.png" alt="russiaFlag" />
									{t('Russian')}
								</MenuItem>
							</StyledMenu>
						</div>

						{/* CURRENCY */}
						<div className="currency-box">
							<Button
								disableRipple
								className="action-pill btn-currency"
								onClick={handleCurrencyOpen}
								endIcon={<CaretDown size={14} color="#b6b9d6" weight="fill" />}
							>
								<Box component="div" className="currency-icon">
									{currency === 'USD' ? '$' : '₩'}
								</Box>
								<Box component="div" className="currency-text">
									{currency}
								</Box>
							</Button>

							<StyledMenu
								anchorEl={currencyAnchor}
								open={currencyOpen}
								onClose={handleCurrencyClose}
								sx={{ position: 'absolute' }}
							>
								<MenuItem disableRipple onClick={handleCurrencyChoice} id="KRW">
									<img className="img-flag" src="/img/flag/langkr.png" alt="koreanFlag" />
									KRW - {t('Korean Won')}
								</MenuItem>
								<MenuItem disableRipple onClick={handleCurrencyChoice} id="USD">
									<img className="img-flag" src="/img/flag/langen.png" alt="usaFlag" />
									USD - {t('US Dollar')}
								</MenuItem>
							</StyledMenu>
						</div>

						{/* USER */}
						<Box component="div" className="user-box">
							{user?._id ? (
								<>
									<div
										className="avatar-pill"
										onClick={(event: React.MouseEvent<HTMLElement>) => setLogoutAnchor(event.currentTarget)}
									>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg'
											}
											alt="user avatar"
										/>
									</div>

									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => setLogoutAnchor(null)}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href="/account/join" className="action-pill join-pill">
									<AccountCircleOutlinedIcon fontSize="small" />
									<span>{t('Login')}</span>
								</Link>
							)}
						</Box>
					</Box>
				</Box>
			</Box>
		</Stack>
	);
};

export default Top;
