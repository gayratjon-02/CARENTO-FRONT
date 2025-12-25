// next-seo.config.ts
import type { DefaultSeoProps } from 'next-seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carento.tech';
const OG_IMAGE = `${SITE_URL}/img/og-image.jpg`;

const seoConfig: DefaultSeoProps = {
	titleTemplate: '%s | Carento',
	defaultTitle: 'Carento - Car Rental Platform in South Korea',
	description:
		'Rent premium cars anywhere anytime in South Korea. Find the best car rentals at the best prices on Carento. BMW, Mercedes, Audi, and more luxury vehicles available.',

	canonical: SITE_URL,

	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: SITE_URL,
		siteName: 'Carento',
		title: 'Carento - Car Rental Platform in South Korea',
		description:
			'Rent premium cars anywhere anytime in South Korea. Find the best car rentals at the best prices on Carento.',
		images: [
			{
				url: OG_IMAGE,
				width: 1200,
				height: 630,
				alt: 'Carento - Car Rental Platform',
				type: 'image/jpeg',
			},
		],
	},

	twitter: {
		handle: '@carento',
		site: '@carento',
		cardType: 'summary_large_image',
	},

	additionalMetaTags: [
		{
			name: 'keywords',
			content:
				'car rental, car hire, rent a car, South Korea, Seoul, premium cars, luxury car rental, BMW rental, Mercedes rental, Audi rental, car sharing',
		},
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		{ name: 'theme-color', content: '#181A20' },

		// Telegram / OG preview mustahkam bo‘lsin
		{ property: 'og:site_name', content: 'Carento' },
		{ property: 'og:image:secure_url', content: OG_IMAGE },
		{ property: 'og:image:type', content: 'image/jpeg' },
		{ property: 'og:image:width', content: '1200' },
		{ property: 'og:image:height', content: '630' },

		// i18n
		{ property: 'og:locale:alternate', content: 'ko_KR' },
		{ property: 'og:locale:alternate', content: 'ru_RU' },
	],

	additionalLinkTags: [
		{ rel: 'icon', href: '/img/logo/favicon.svg' },
		{ rel: 'apple-touch-icon', href: '/img/logo/apple-touch-icon.png', sizes: '180x180' },
	],
};

export default seoConfig;
