import React from 'react';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import { Stack, Box, TextField, Button, InputAdornment, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import moment from 'moment';

const Footer = () => {
	const router = useRouter();
	const { t, i18n } = useTranslation('common');
	const year = moment().year();
	const localeKey = router.locale || i18n.resolvedLanguage || i18n.language || 'en';

	const linkGroups = [
		{
			title: t('FooterCompany', 'Company'),
			items: [
				t('FooterAboutUs', 'About Us'),
				t('FooterOurAwards', 'Our Awards'),
				t('FooterAgencies', 'Agencies'),
				t('FooterCopyrightNotices', 'Copyright Notices'),
				t('FooterTermsOfUse', 'Terms of Use'),
				t('FooterPrivacyNotice', 'Privacy Notice'),
				t('FooterLostFound', 'Lost & Found'),
			],
		},
		{
			title: t('FooterServices', 'Our Services'),
			items: [
				t('FooterCarRentalServices', 'Car Rental Services'),
				t('FooterVehicleLeasingOptions', 'Vehicle Leasing Options'),
				t('FooterLongTermCarRentals', 'Long-Term Car Rentals'),
				t('FooterCarSalesTradeIns', 'Car Sales and Trade-Ins'),
				t('FooterLuxuryCarRentals', 'Luxury Car Rentals'),
				t('FooterRentToOwnPrograms', 'Rent-to-Own Programs'),
				t('FooterFleetManagement', 'Fleet Management Solutions'),
			],
		},
		{
			title: t('FooterPartners', 'Our Partners'),
			items: [
				t('FooterAffiliates', 'Affiliates'),
				t('FooterTravelAgents', 'Travel Agents'),
				t('FooterAARPMembers', 'AARP Members'),
				t('FooterPointsPrograms', 'Points Programs'),
				t('FooterMilitaryVeterans', 'Military & Veterans'),
				t('FooterWorkWithUs', 'Work with us'),
				t('FooterAdvertiseWithUs', 'Advertise with us'),
			],
		},
		{
			title: t('FooterSupport', 'Support'),
			items: [
				t('FooterForumSupport', 'Forum support'),
				t('FooterHelpCenter', 'Help Center'),
				t('FooterLiveChat', 'Live chat'),
				t('FooterHowItWorks', 'How it works'),
				t('FooterSecurity', 'Security'),
				t('FooterRefundPolicy', 'Refund Policy'),
			],
		},
	];

	return (
		<Stack className={'footer-container'} key={localeKey}>
			<Stack className={'footer-subscribe'}>
				<Typography className="footer-subscribe-title">
					{t('FooterSubscribeTitle', 'Subscribe to see secret deals prices drop the moment you sign up!')}
				</Typography>
				<Box component="div" className="footer-subscribe-input">
					<TextField
						variant="outlined"
						fullWidth
						placeholder={t('FooterEmailPlaceholder', 'Enter your email')}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<MailOutlineOutlinedIcon />
								</InputAdornment>
							),
						}}
					/>
					<Button className="footer-subscribe-btn" variant="contained">
						{t('FooterSubscribe', 'Subscribe')}
					</Button>
				</Box>
			</Stack>

			<Stack className={'footer-content'}>
				<Box component="div" className={'footer-brand'}>
					<Box component="div" className="footer-logo">
						<img src="/img/icons/main-logotip.svg" alt="Carento Logo" />
						<span>Carento</span>
					</Box>
					<Box component="div" className="footer-info">
						<div>
							<LocationOnOutlinedIcon />
							<p>Busan, South Korea</p>
						</div>
						<div>
							<AccessTimeOutlinedIcon />
							<p>{t('FooterHours', 'Hours: 8:00 - 17:00, Mon - Sat')}</p>
						</div>
						<div>
							<EmailOutlinedIcon />
							<p>gayratjon2002uz@gmail.com</p>
						</div>
						<div className="footer-hotline">
							<PhoneInTalkOutlinedIcon />
							<Box component="div">
								<span>{t('FooterNeedHelp', 'Need help? Call us')}</span>
								<strong>+82 10 8336 2002</strong>
							</Box>
						</div>
					</Box>
				</Box>

				<Box component="div" className={'footer-links'}>
					{linkGroups.map((group) => (
						<Box component="div" className="footer-link-group" key={group.title}>
							<strong>{group.title}</strong>
							{group.items.map((item) => (
								<span key={item}>{item}</span>
							))}
						</Box>
					))}
				</Box>
			</Stack>

			<Stack className={'footer-bottom'}>
				<span>
					© {year} Carento Inc. {t('FooterRights', 'All rights reserved.')}
				</span>
				<Box component="div" className="footer-socials">
					<span>{t('FooterFollowUs', 'Follow Us')}</span>
					<Box component="div" className="social-icons">
						<YouTubeIcon />
						<InstagramIcon />
						<FacebookOutlinedIcon />
						<TwitterIcon />
						<TelegramIcon />
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Footer;
