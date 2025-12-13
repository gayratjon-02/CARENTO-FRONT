import React, { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const HeroSection = () => {
	const router = useRouter();
	const { t, i18n } = useTranslation('common');
	const [currentLang, setCurrentLang] = useState(() => {
		if (typeof window !== 'undefined') {
			return router.locale || i18n?.language || 'en';
		}
		return router.locale || 'en';
	});

	// Til o'zgarsa real-time qayta render qilish (faqat client-side)
	useEffect(() => {
		if (typeof window === 'undefined' || !i18n) return;
		
		const handleLanguageChange = (lng: string) => {
			setCurrentLang(lng || 'en');
		};
		
		if (i18n && typeof i18n.on === 'function') {
			i18n.on('languageChanged', handleLanguageChange);
		}
		
		return () => {
			if (i18n && typeof i18n.off === 'function') {
				i18n.off('languageChanged', handleLanguageChange);
			}
		};
	}, [i18n]);

	useEffect(() => {
		if (router.locale && router.locale !== currentLang) {
			setCurrentLang(router.locale);
		}
	}, [router.locale, currentLang]);

	return (
		<Stack className="hero-section" key={currentLang}>
			<Stack className="hero-label">
				{/* @ts-ignore */}
				{t('Find Your Perfect Car')}
			</Stack>
			<Stack className="hero-title">
				{/* @ts-ignore */}
				{t('Looking for a vehicle? You are in the perfect spot.')}
			</Stack>
			<Stack className="hero-features">
				<Box component="div" className="feature-item">
					<CheckCircleIcon className="check-icon" />
					<span>
						{/* @ts-ignore */}
						{t('High quality at a low cost.')}
					</span>
				</Box>
				<Box component="div" className="feature-item">
					<CheckCircleIcon className="check-icon" />
					<span>
						{/* @ts-ignore */}
						{t('Premium services')}
					</span>
				</Box>
				<Box component="div" className="feature-item">
					<CheckCircleIcon className="check-icon" />
					<span>
						{/* @ts-ignore */}
						{t('24/7 roadside support')}
					</span>
				</Box>
			</Stack>
		</Stack>
	);
};

export default HeroSection;
