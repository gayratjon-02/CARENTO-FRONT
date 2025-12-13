import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box, Badge } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown, CaretUp } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [anchorElCurrency, setAnchorElCurrency] = useState<null | HTMLElement>(null);
	const [currency, setCurrency] = useState<string | null>('KRW');
	const currencyDrop = Boolean(anchorElCurrency);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [isContainerVisible, setIsContainerVisible] = useState<boolean>(false);
	const [notificationCount, setNotificationCount] = useState<number>(0); // Backend dan keladi

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
		if (localStorage.getItem('currency') === null) {
			localStorage.setItem('currency', 'KRW');
			setCurrency('KRW');
		} else {
			setCurrency(localStorage.getItem('currency'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/property/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			const selectedLang = e.currentTarget?.id;
			if (!selectedLang) return;
			if (!['en', 'kr', 'ru'].includes(selectedLang)) return;
			setLang(selectedLang);
			localStorage.setItem('locale', selectedLang);
			setAnchorEl2(null);
			await i18n.changeLanguage(selectedLang);
			await i18n.reloadResources(selectedLang, 'common');
			// Shallow routing ni o'chirish - locale o'zgarganda sahifa qayta yuklanishi kerak
			await router.push(router.asPath, router.asPath, { locale: selectedLang, shallow: false });
		},
		[router, i18n],
	);

	const currencyClick = (e: any) => {
		setAnchorElCurrency(e.currentTarget);
	};

	const currencyClose = () => {
		setAnchorElCurrency(null);
	};

	const toggleContainer = () => {
		setIsContainerVisible(!isContainerVisible);
	};

	const currencyChoice = useCallback((e: any) => {
		setCurrency(e.target.id);
		localStorage.setItem('currency', e.target.id);
		setAnchorElCurrency(null);
	}, []);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
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

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/property'}>
					<div>{t('Cars')}</div>
				</Link>
				<Link href={'/agent'}>
					<div> {t('Agents')} </div>
				</Link>
				<Link href={'/community?articleCategory=FREE'}>
					<div> {t('Community')} </div>
				</Link>
				<Link href={'/cs'}>
					<div> {t('CS')} </div>
				</Link>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack
					direction={'column'}
					className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}
				>
					<Stack className="top-container">
						<Stack className="call-info-box">
							<Stack className="phone-number-box" flexDirection={'row'}>
								<img src="img/icons/call.svg" alt="call image" />
								<p className="phone-number">+82 10 8336 2002</p>
							</Stack>
							<Stack className="email-info-box" flexDirection={'row'}>
								<img src="img/icons/email.svg" alt="email image" height={20} width={20} />
								<p className="email">gayratjon2002uz@gmail.com</p>
							</Stack>
						</Stack>
						<Stack style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
						<Stack className="carento-brand-box">
								{t('CarentoBrandSlogan') || 'CARENTO — Your reliable car partner'}
							</Stack>
							<Box 
								component="div" 
								onClick={toggleContainer}
								className="toggle-arrow"
								sx={{ 
									cursor: 'pointer', 
									display: 'flex', 
									alignItems: 'center',
									justifyContent: 'center',
									transition: 'transform 0.3s ease',
									color: '#fff',
									'&:hover': {
										transform: 'scale(1.2)'
									}
								}}
							>
								{isContainerVisible ? (
									<CaretUp size={16} color="#fff" weight="fill" />
								) : (
									<CaretDown size={16} color="#fff" weight="fill" />
								)}
							</Box>
						</Stack>
						<Stack className="lang-currency-box">
							<div className={'notification-box'}>
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
											padding: '0 4px'
										}
									}}
								>
									<NotificationsOutlinedIcon 
										className="notification-icon"
										sx={{ 
											color: '#fff', 
											fontSize: '22px',
											cursor: 'pointer',
											transition: 'transform 0.3s ease',
											'&:hover': {
												transform: 'scale(1.1)'
											}
										}} 
									/>
								</Badge>
							</div>
							<div className={'lang-box'}>
								{/* <img src="img/icons/language.svg" alt="lang image" height={20} width={20} /> */}
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
								>
									<Box component={'div'} className={'flag'}>
										{lang !== null ? (
											<img src={`/img/flag/lang${lang}.png`} alt={'flag'} />
										) : (
											<img src={`/img/flag/langen.png`} alt={'flag'} />
										)}
									</Box>
								</Button>

								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img
											className="img-flag"
											src={'/img/flag/langen.png'}
											onClick={langChoice}
											id="en"
											alt={'usaFlag'}
										/>
										{t('English')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img
											className="img-flag"
											src={'/img/flag/langkr.png'}
											onClick={langChoice}
											id="kr"
											alt={'koreanFlag'}
										/>
										{t('Korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										<img
											className="img-flag"
											src={'/img/flag/langru.png'}
											onClick={langChoice}
											id="ru"
											alt={'russiaFlag'}
										/>
										{t('Russian')}
									</MenuItem>
								</StyledMenu>
							</div>
							<div className={'currency-box'}>
								<Button
									disableRipple
									className="btn-currency"
									onClick={currencyClick}
									endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
								>
									<Box component={'div'} className={'currency-flag'}>
										{currency === 'KRW' ? (
											<img src={`/img/flag/langkr.png`} alt={'koreanFlag'} />
										) : currency === 'USD' ? (
											<img src={`/img/flag/langen.png`} alt={'usaFlag'} />
										) : (
											<img src={`/img/flag/langkr.png`} alt={'flag'} />
										)}
									</Box>
									<Box component={'div'} className={'currency-text'}>
										{currency !== null ? currency : 'KRW'}
									</Box>
								</Button>

								<StyledMenu
									anchorEl={anchorElCurrency}
									open={currencyDrop}
									onClose={currencyClose}
									sx={{ position: 'absolute' }}
								>
									<MenuItem disableRipple onClick={currencyChoice} id="KRW">
										<img
											className="img-flag"
											src={'/img/flag/langkr.png'}
											onClick={currencyChoice}
											id="KRW"
											alt={'koreanFlag'}
										/>
										KRW - {t('Korean Won') || 'Korean Won'}
									</MenuItem>
									<MenuItem disableRipple onClick={currencyChoice} id="USD">
										<img
											className="img-flag"
											src={'/img/flag/langen.png'}
											onClick={currencyChoice}
											id="USD"
											alt={'usaFlag'}
										/>
										USD - {t('US Dollar') || 'US Dollar'}
									</MenuItem>
								</StyledMenu>
							</div>
						</Stack>
					</Stack>
					<Stack className={`container ${isContainerVisible ? 'visible' : 'hidden'}`}>
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
								<img src="/img/icons/main-logotip.svg" alt="Carento Logo" />
								<span className="logo-text">Carento</span>
							</Link>
						</Box>
						<Box component={'div'} className={'router-box'}>
							<Link href={'/'}>
								<div>{t('Home')}</div>
							</Link>
							<Link href={'/property'}>
								<div>{t('Cars')}</div>
							</Link>
							<Link href={'/agent'}>
								<div> {t('Agents')} </div>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<div> {t('Community')} </div>
							</Link>
							{user?._id && (
								<Link href={'/mypage'}>
									<div> {t('My Page')} </div>
								</Link>
							)}
							<Link href={'/cs'}>
								<div> {t('CS')} </div>
							</Link>
						</Box>
						<Box component={'div'} className={'user-box'}>
							{user?._id ? (
								<>
									<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
									</div>

									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => {
											setLogoutAnchor(null);
										}}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<div className={'join-box'}>
										<AccountCircleOutlinedIcon />
										<span>
											{t('Login')}
										</span>
									</div>
								</Link>
							)}

							<div className={'lan-box'}>
								{user?._id && <NotificationsOutlinedIcon className={'notification-icon'} />}
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);
