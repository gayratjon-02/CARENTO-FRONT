import React, { useMemo, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Container,
	Grid,
	InputAdornment,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/cs/Notice';
import Faq from '../../libs/components/cs/Faq';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CS: NextPage = () => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const [expanded, setExpanded] = useState<string | false>(false);
	const { t } = useTranslation('common');

	const changeTabHandler = (tab: string) => {
		router.push(
			{
				pathname: '/cs',
				query: { tab },
			},
			undefined,
			{ scroll: false },
		);
	};

	const faqData = useMemo(
		() => [
			{
				id: 'panel1',
				category: t('Booking', { defaultValue: 'Booking' }),
				question: t('How do I book a car?', {
					defaultValue: 'How do I book a car?',
				}),
				answer: t(
					"You can book a car by selecting your desired vehicle, choosing pickup/drop-off dates and locations, and completing the payment. Our booking process is quick and secure.",
					{
						defaultValue:
							'You can book a car by selecting your desired vehicle, choosing pickup/drop-off dates and locations, and completing the payment. Our booking process is quick and secure.',
					},
				),
			},
			{
				id: 'panel2',
				category: t('Booking', { defaultValue: 'Booking' }),
				question: t('Can I modify or cancel my booking?', { defaultValue: 'Can I modify or cancel my booking?' }),
				answer: t(
					'Yes, you can modify or cancel your booking up to 24 hours before pickup. Cancellation fees may apply depending on how close to the pickup date you cancel.',
					{
						defaultValue:
							'Yes, you can modify or cancel your booking up to 24 hours before pickup. Cancellation fees may apply depending on how close to the pickup date you cancel.',
					},
				),
			},
			{
				id: 'panel3',
				category: t('Pricing', { defaultValue: 'Pricing' }),
				question: t('What is included in the rental price?', { defaultValue: 'What is included in the rental price?' }),
				answer: t(
					'The rental price includes basic insurance, unlimited mileage, 24/7 roadside assistance, and vehicle maintenance. Additional insurance and GPS can be added for extra cost.',
					{
						defaultValue:
							'The rental price includes basic insurance, unlimited mileage, 24/7 roadside assistance, and vehicle maintenance. Additional insurance and GPS can be added for extra cost.',
					},
				),
			},
			{
				id: 'panel4',
				category: t('Pricing', { defaultValue: 'Pricing' }),
				question: t('Are there any hidden fees?', { defaultValue: 'Are there any hidden fees?' }),
				answer: t(
					'No hidden fees! All costs are clearly displayed during booking. Additional charges may apply for extras like child seats, additional drivers, or toll fees.',
					{
						defaultValue:
							'No hidden fees! All costs are clearly displayed during booking. Additional charges may apply for extras like child seats, additional drivers, or toll fees.',
					},
				),
			},
			{
				id: 'panel5',
				category: t('Requirements', { defaultValue: 'Requirements' }),
				question: t('What documents do I need to rent a car?', { defaultValue: 'What documents do I need to rent a car?' }),
				answer: t(
					"You need a valid driver's license (held for at least 1 year), a valid ID or passport, and a credit card in the driver’s name for the security deposit.",
					{
						defaultValue:
							"You need a valid driver's license (held for at least 1 year), a valid ID or passport, and a credit card in the driver’s name for the security deposit.",
					},
				),
			},
			{
				id: 'panel6',
				category: t('Requirements', { defaultValue: 'Requirements' }),
				question: t('What is the minimum age to rent a car?', { defaultValue: 'What is the minimum age to rent a car?' }),
				answer: t(
					'The minimum age is 21 years old. Drivers under 25 may be subject to a young driver surcharge. Some luxury and specialty vehicles require drivers to be 25 or older.',
					{
						defaultValue:
							'The minimum age is 21 years old. Drivers under 25 may be subject to a young driver surcharge. Some luxury and specialty vehicles require drivers to be 25 or older.',
					},
				),
			},
			{
				id: 'panel7',
				category: t('Insurance', { defaultValue: 'Insurance' }),
				question: t('What insurance options are available?', { defaultValue: 'What insurance options are available?' }),
				answer: t(
					'We offer basic coverage (included), collision damage waiver (CDW), theft protection, and personal accident insurance. You can customize your coverage during booking.',
					{
						defaultValue:
							'We offer basic coverage (included), collision damage waiver (CDW), theft protection, and personal accident insurance. You can customize your coverage during booking.',
					},
				),
			},
			{
				id: 'panel8',
				category: t('Pickup & Return', { defaultValue: 'Pickup & Return' }),
				question: t('Where can I pick up and return the car?', { defaultValue: 'Where can I pick up and return the car?' }),
				answer: t(
					'You can pick up and return cars at any of our locations including airports, city centers, and partner locations. Different location returns are available for an additional fee.',
					{
						defaultValue:
							'You can pick up and return cars at any of our locations including airports, city centers, and partner locations. Different location returns are available for an additional fee.',
					},
				),
			},
			{
				id: 'panel9',
				category: t('Pickup & Return', { defaultValue: 'Pickup & Return' }),
				question: t('What if I return the car late?', { defaultValue: 'What if I return the car late?' }),
				answer: t(
					'A grace period of 29 minutes is allowed. After that, late fees apply. If you know you’ll be late, contact us immediately to extend your rental and avoid additional charges.',
					{
						defaultValue:
							'A grace period of 29 minutes is allowed. After that, late fees apply. If you know you’ll be late, contact us immediately to extend your rental and avoid additional charges.',
					},
				),
			},
			{
				id: 'panel10',
				category: t('During Rental', { defaultValue: 'During Rental' }),
				question: t('What should I do in case of an accident?', { defaultValue: 'What should I do in case of an accident?' }),
				answer: t(
					"First, ensure everyone’s safety and call emergency services if needed. Then contact our 24/7 hotline immediately. Document the scene with photos and exchange information with other parties involved.",
					{
						defaultValue:
							"First, ensure everyone’s safety and call emergency services if needed. Then contact our 24/7 hotline immediately. Document the scene with photos and exchange information with other parties involved.",
					},
				),
			},
			{
				id: 'panel11',
				category: t('During Rental', { defaultValue: 'During Rental' }),
				question: t('Can I drive the car abroad or to other regions?', { defaultValue: 'Can I drive the car abroad or to other regions?' }),
				answer: t(
					'Cross-border travel requires prior approval and additional documentation. Some regions may have restrictions. Please inform us during booking if you plan to travel outside the rental area.',
					{
						defaultValue:
							'Cross-border travel requires prior approval and additional documentation. Some regions may have restrictions. Please inform us during booking if you plan to travel outside the rental area.',
					},
				),
			},
			{
				id: 'panel12',
				category: t('Payment', { defaultValue: 'Payment' }),
				question: t('What payment methods do you accept?', { defaultValue: 'What payment methods do you accept?' }),
				answer: t(
					'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and digital wallets. Cash payments are not accepted for security deposits.',
					{
						defaultValue:
							'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and digital wallets. Cash payments are not accepted for security deposits.',
					},
				),
			},
		],
		[t],
	);

	const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) =>
		setExpanded(isExpanded ? panel : false);

	const filteredFAQ = useMemo(
		() =>
			faqData.filter(
				(faq) =>
					faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
					faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
					faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
			),
		[faqData, searchQuery],
	);

	const categories = useMemo(() => Array.from(new Set(faqData.map((faq) => faq.category))), [faqData]);
	const tab = (router.query.tab as string) ?? 'notice';

	return (
		<Stack className={'cs-page'}>
			<Stack className={'container'}>
				<Box className="cs-hero">
					<div className="cs-hero__text">
						<p className="eyebrow">{t('Support Center', { defaultValue: 'Support Center' })}</p>
						<h1>{t('How can we help you?', { defaultValue: 'How can we help you?' })}</h1>
						<p className="sub">
							{t('Carento fast help center. Find answers or write to us.', {
								defaultValue: 'Carento fast help center. Find answers or write to us.',
							})}
						</p>
						<div className="cs-search">
							<SearchIcon />
							<input
								placeholder={t('Type a question or search by keyword...', {
									defaultValue: 'Type a question or search by keyword...',
								})}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<div className="cs-hero__actions">
							<button className={tab === 'notice' ? 'active' : ''} onClick={() => changeTabHandler('notice')}>
								{t('Notices', { defaultValue: 'Notices' })}
							</button>
							<button className={tab === 'faq' ? 'active ghost' : 'ghost'} onClick={() => changeTabHandler('faq')}>
								{t('FAQ', { defaultValue: 'FAQ' })}
							</button>
						</div>
					</div>
					<div className="cs-hero__card">
						<div className="card-title">{t('Need quick help?', { defaultValue: 'Need quick help?' })}</div>
						<div className="card-row">
							<span>{t('Call us', { defaultValue: 'Call us' })}</span>
							<strong>+82 10 8336 2002</strong>
						</div>
						<div className="card-row">
							<span>{t('Email', { defaultValue: 'Email' })}</span>
							<strong>support@carento.tech</strong>
						</div>
						<div className="card-row muted">
							{t('24/7 – response time ~1 hour', { defaultValue: '24/7 – response time ~1 hour' })}
						</div>
					</div>
				</Box>

				<Box className="cs-highlights">
					<div className="highlight">
						<strong>24/7</strong>
						<span>{t('Support available', { defaultValue: 'Support available' })}</span>
					</div>
					<div className="divider" />
					<div className="highlight">
						<strong>{t('Notices', { defaultValue: 'Notices' })}</strong>
						<span>{t('News and technical service', { defaultValue: 'News and technical service' })}</span>
					</div>
					<div className="divider" />
					<div className="highlight">
						<strong>{t('FAQ', { defaultValue: 'FAQ' })}</strong>
						<span>{t('Top answered questions', { defaultValue: 'Top answered questions' })}</span>
					</div>
				</Box>

				<Box className={'cs-content'}>
					<div className="cs-tabs">
						<button className={tab === 'notice' ? 'active' : ''} onClick={() => changeTabHandler('notice')}>
							{t('Notices', { defaultValue: 'Notices' })}
						</button>
						<button className={tab === 'faq' ? 'active' : ''} onClick={() => changeTabHandler('faq')}>
							{t('FAQ', { defaultValue: 'FAQ' })}
						</button>
					</div>

					{tab === 'notice' && <Notice />}

					{tab === 'faq' && (
						<Container maxWidth="lg" sx={{ py: 4, px: 0 }}>
							<Grid container spacing={4}>
								<Grid item xs={12}>
									<Typography variant="h4" className="section-title" sx={{ mb: 1 }}>
										{t('Frequently Asked Questions', { defaultValue: 'Frequently Asked Questions' })}
									</Typography>
									<Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
										{t('Most common questions about car rental', {
											defaultValue: 'Most common questions about car rental',
										})}
									</Typography>

									<Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
										<Chip
											label={t('All', { defaultValue: 'All' })}
											color="primary"
											variant={searchQuery === '' ? 'filled' : 'outlined'}
											onClick={() => setSearchQuery('')}
										/>
										{categories.map((category) => (
											<Chip
												key={category}
												label={category}
												color="primary"
												variant="outlined"
												onClick={() => setSearchQuery(category)}
											/>
										))}
									</Stack>

									<Stack spacing={2}>
										{filteredFAQ.length > 0 ? (
											filteredFAQ.map((faq) => (
												<Accordion
													key={faq.id}
													expanded={expanded === faq.id}
													onChange={handleAccordionChange(faq.id)}
													elevation={1}
													sx={{
														borderRadius: 2,
														'&:before': { display: 'none' },
														border: '1px solid #e2e8f0',
														'&.Mui-expanded': { margin: '8px 0 !important' },
													}}
												>
													<AccordionSummary
														expandIcon={<ExpandMoreIcon />}
														sx={{ '& .MuiAccordionSummary-content': { my: 1.2, gap: 1 } }}
													>
														<Chip label={faq.category} size="small" color="primary" variant="outlined" />
														<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
															{faq.question}
														</Typography>
													</AccordionSummary>
													<AccordionDetails sx={{ pt: 0, pb: 2.5, background: '#f8fafc' }}>
														<Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
															{faq.answer}
														</Typography>
													</AccordionDetails>
												</Accordion>
											))
										) : (
											<Paper sx={{ p: 4, textAlign: 'center' }}>
												<Typography variant="h6" color="text.secondary">
													{t('No results found for “{{query}}”', {
														query: searchQuery,
														defaultValue: `No results found for “${searchQuery}”`,
													})}
												</Typography>
												<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
													{t('Try searching with different keywords', {
														defaultValue: 'Try searching with different keywords',
													})}
												</Typography>
											</Paper>
										)}
									</Stack>
								</Grid>
							</Grid>
						</Container>
					)}
				</Box>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(CS);
