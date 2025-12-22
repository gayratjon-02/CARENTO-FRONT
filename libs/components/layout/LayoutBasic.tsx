import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);
		const isAuthHeader = router.pathname === '/account/join';

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '',
				bgPos = 'center';

			switch (router.pathname) {
				case '/property':
					title = 'Property Search';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/banner1.jpg';
					bgPos = 'center 18%';
					break;
				case '/car':
					title = 'Cars';
					desc = 'Home / Cars';
					bgImage = '/img/banner/banner1.jpg';
					bgPos = 'center 18%';
					break;
				case '/agent':
					title = 'Agents';
					desc = 'Home / For Rent';
					bgImage = '/img/banner/banner1.jpg';
					bgPos = 'center 18%';
					break;
				case '/dealers':
					title = 'Dealers';
					desc = 'Home / Dealers';
					bgImage = '/img/banner/banner1.jpg';
					bgPos = 'center 18%';
					break;
				case '/agent/detail':
					title = 'Agent Page';
					desc = 'Home / For Rent';
					bgImage = '/img/banner/banner2.jpg';
					bgPos = 'center 22%';
					break;
				case '/car/detail':
					title = 'Car Page';
					desc = 'Home / Cars';
					bgImage = '/img/banner/banner2.jpg';
					bgPos = 'center 22%';
					break;
				case '/dealers/detail':
					title = 'Dealer Page';
					desc = 'Home / Dealers';
					bgImage = '/img/banner/banner2.jpg';
					bgPos = 'center 22%';
					break;
				case '/mypage':
					title = 'my page';
					desc = 'Home / For Rent';
					bgImage = '/img/banner/banner2.jpg';
					bgPos = 'center 22%';
					break;
				case '/community':
					title = 'Community';
					desc = 'Home / For Rent';
					bgImage = '/img/banner/banner1.jpg';
					bgPos = 'center 18%';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Home / For Rent';
					bgImage = '/img/banner/banner2.jpg';
					bgPos = 'center 22%';
					break;
				case '/cs':
					title = 'CS';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/banner1.jpg';
					bgPos = 'center 18%';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Authentication Process';
					bgImage = '/img/banner/banner2.jpg';
					bgPos = 'center 22%';
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Home / For Rent';
					bgImage = '/img/banner/banner2.jpg';
					bgPos = 'center 22%';
					break;
				default:
					break;
			}

			return { title, desc, bgImage, bgPos };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>CARENTO</title>
						<meta name={'title'} content={`CARENTO`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>CARENTO</title>
						<meta name={'title'} content={`CARENTO`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${isAuthHeader ? 'auth' : ''}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								backgroundPosition: memoizedValues.bgPos ?? 'center',
							}}
						>
							<div className="header-basic__overlay" />
							<Stack className={'container'}>
								<Stack className="header-basic__content">
									<span className="header-basic__crumb">{t(memoizedValues.desc)}</span>
									<strong className="header-basic__title">{t(memoizedValues.title)}</strong>
								</Stack>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
