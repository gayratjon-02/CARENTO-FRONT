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

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CS: NextPage = () => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const [expanded, setExpanded] = useState<string | false>(false);

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
				category: 'Booking',
				question: 'How do I book a car?',
				answer:
					"You can book a car by selecting your desired vehicle, choosing pickup/drop-off dates and locations, and completing the payment. Our booking process is quick and secure.",
			},
			{
				id: 'panel2',
				category: 'Booking',
				question: 'Can I modify or cancel my booking?',
				answer:
					'Yes, you can modify or cancel your booking up to 24 hours before pickup. Cancellation fees may apply depending on how close to the pickup date you cancel.',
			},
			{
				id: 'panel3',
				category: 'Pricing',
				question: 'What is included in the rental price?',
				answer:
					'The rental price includes basic insurance, unlimited mileage, 24/7 roadside assistance, and vehicle maintenance. Additional insurance and GPS can be added for extra cost.',
			},
			{
				id: 'panel4',
				category: 'Pricing',
				question: 'Are there any hidden fees?',
				answer:
					'No hidden fees! All costs are clearly displayed during booking. Additional charges may apply for extras like child seats, additional drivers, or toll fees.',
			},
			{
				id: 'panel5',
				category: 'Requirements',
				question: 'What documents do I need to rent a car?',
				answer:
					"You need a valid driver's license (held for at least 1 year), a valid ID or passport, and a credit card in the driver’s name for the security deposit.",
			},
			{
				id: 'panel6',
				category: 'Requirements',
				question: 'What is the minimum age to rent a car?',
				answer:
					'The minimum age is 21 years old. Drivers under 25 may be subject to a young driver surcharge. Some luxury and specialty vehicles require drivers to be 25 or older.',
			},
			{
				id: 'panel7',
				category: 'Insurance',
				question: 'What insurance options are available?',
				answer:
					'We offer basic coverage (included), collision damage waiver (CDW), theft protection, and personal accident insurance. You can customize your coverage during booking.',
			},
			{
				id: 'panel8',
				category: 'Pickup & Return',
				question: 'Where can I pick up and return the car?',
				answer:
					'You can pick up and return cars at any of our locations including airports, city centers, and partner locations. Different location returns are available for an additional fee.',
			},
			{
				id: 'panel9',
				category: 'Pickup & Return',
				question: 'What if I return the car late?',
				answer:
					'A grace period of 29 minutes is allowed. After that, late fees apply. If you know you’ll be late, contact us immediately to extend your rental and avoid additional charges.',
			},
			{
				id: 'panel10',
				category: 'During Rental',
				question: 'What should I do in case of an accident?',
				answer:
					"First, ensure everyone’s safety and call emergency services if needed. Then contact our 24/7 hotline immediately. Document the scene with photos and exchange information with other parties involved.",
			},
			{
				id: 'panel11',
				category: 'During Rental',
				question: 'Can I drive the car abroad or to other regions?',
				answer:
					'Cross-border travel requires prior approval and additional documentation. Some regions may have restrictions. Please inform us during booking if you plan to travel outside the rental area.',
			},
			{
				id: 'panel12',
				category: 'Payment',
				question: 'What payment methods do you accept?',
				answer:
					'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and digital wallets. Cash payments are not accepted for security deposits.',
			},
		],
		[],
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
						<p className="eyebrow">Support Center</p>
						<h1>How can we help you?</h1>
						<p className="sub">Carento’ning tezkor yordam markazi. Javob toping yoki bizga yozing.</p>
						<div className="cs-search">
							<SearchIcon />
							<input
								placeholder="Savol yozing yoki kalit so‘z bilan qidiring..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
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
						<div className="card-title">Tez yordam kerakmi?</div>
						<div className="card-row">
							<span>Call us</span>
							<strong>+82 10 8336 2002</strong>
						</div>
						<div className="card-row">
							<span>Email</span>
							<strong>support@carento.tech</strong>
						</div>
						<div className="card-row muted">24/7 – javob vaqti ~1 soat</div>
					</div>
				</Box>

				<Box className="cs-highlights">
					<div className="highlight">
						<strong>24/7</strong>
						<span>Support available</span>
					</div>
					<div className="divider" />
					<div className="highlight">
						<strong>Notices</strong>
						<span>Yangiliklar va texnik xizmat</span>
					</div>
					<div className="divider" />
					<div className="highlight">
						<strong>FAQ</strong>
						<span>Top savollarga javoblar</span>
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

					{tab === 'faq' && (
						<Container maxWidth="lg" sx={{ py: 4, px: 0 }}>
							<Grid container spacing={4}>
								<Grid item xs={12}>
									<Typography variant="h4" className="section-title" sx={{ mb: 1 }}>
										Frequently Asked Questions
									</Typography>
									<Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
										Avtomobil ijarasi bo‘yicha eng ko‘p so‘raladigan savollar
									</Typography>

									<Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
										<Chip
											label="All"
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
													No results found for “{searchQuery}”
												</Typography>
												<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
													Try searching with different keywords
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
