import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/cs/Notice';
import Faq from '../../libs/components/cs/Faq';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CS: NextPage = () => {
	const router = useRouter();

	/** HANDLERS **/
	const changeTabHandler = (tab: string) => {
		router.push(
			{
				pathname: '/cs',
				query: { tab: tab },
			},
			undefined,
			{ scroll: false },
		);
	};
	const tab = router.query.tab ?? 'notice';

	return (
		<Stack className={'cs-page'}>
			<Stack className={'container'}>
				<Box className="cs-hero">
					<div className="cs-hero__text">
						<p className="eyebrow">Support Center</p>
						<h1>We’re here to help Carento drivers and dealers.</h1>
						<p className="sub">
							Find answers fast, explore notices, or reach out to our team. Average response time under 1 hour.
						</p>
						<div className="cs-hero__actions">
							<button className={tab === 'notice' ? 'active' : ''} onClick={() => changeTabHandler('notice')}>
								Notices
							</button>
							<button className={tab === 'faq' ? 'active ghost' : 'ghost'} onClick={() => changeTabHandler('faq')}>
								FAQ
							</button>
						</div>
					</div>
					<div className="cs-hero__card">
						<div className="card-title">Need direct assistance?</div>
						<div className="card-row">
							<span>Call us</span>
							<strong>+82 10 8336 2002</strong>
						</div>
						<div className="card-row">
							<span>Email</span>
							<strong>support@carento.tech</strong>
						</div>
						<div className="card-row muted">Response time: under 1 hour · 24/7</div>
					</div>
				</Box>

				<Box className="cs-highlights">
					<div className="highlight">
						<strong>24/7</strong>
						<span>Support availability</span>
					</div>
					<div className="divider" />
					<div className="highlight">
						<strong>Notice</strong>
						<span>Platform updates & maintenance</span>
					</div>
					<div className="divider" />
					<div className="highlight">
						<strong>FAQ</strong>
						<span>Top answers for renters & dealers</span>
					</div>
				</Box>

				<Box className={'cs-content'}>
					<div className="cs-tabs">
						<button className={tab === 'notice' ? 'active' : ''} onClick={() => changeTabHandler('notice')}>
							Notices
						</button>
						<button className={tab === 'faq' ? 'active' : ''} onClick={() => changeTabHandler('faq')}>
							FAQ
						</button>
					</div>

					{tab === 'notice' && <Notice />}
					{tab === 'faq' && <Faq />}
				</Box>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(CS);
