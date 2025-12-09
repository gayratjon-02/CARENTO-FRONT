import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);

	return (
		<>
			{/* GLOBAL SEO */}
			<DefaultSeo
				titleTemplate="%s | Carento"
				defaultTitle="Carento - Car Rental Platform in South Korea"
				description="Rent premium cars anywhere anytime in South Korea. Find the best car rentals at the best prices on Carento. BMW, Mercedes, Audi, and more luxury vehicles available. | Южная Корея: аренда премиальных автомобилей в любое время и в любом месте. Лучшие цены на аренду автомобилей на Carento. | 대한민국 어디서나 언제든 프리미엄 차량을 렌트하세요. Carento에서 최고의 가격으로 최고의 차량 렌탈을 만나보세요."
				canonical="https://carento.uz"
				openGraph={{
					type: 'website',
					locale: 'en_US',
					url: 'https://carento.uz',
					siteName: 'Carento',
					title: 'Carento - Car Rental Platform in South Korea',
					description: 'Rent premium cars anywhere anytime in South Korea. Find the best car rentals at the best prices on Carento.',
					images: [
						{
							url: 'https://carento.uz/img/og-image.jpg',
							width: 1200,
							height: 630,
							alt: 'Carento - Car Rental Platform',
							type: 'image/jpeg',
						},
					],
				}}
				twitter={{
					handle: '@carento',
					site: '@carento',
					cardType: 'summary_large_image',
				}}
				additionalMetaTags={[
					{
						name: 'keywords',
						content: 'car rental, car hire, rent a car, South Korea, Seoul, premium cars, luxury car rental, BMW rental, Mercedes rental, Audi rental, car sharing',
					},
					{
						name: 'viewport',
						content: 'width=device-width, initial-scale=1',
					},
					{
						name: 'theme-color',
						content: '#181A20',
					},
					{
						property: 'og:locale:alternate',
						content: 'ko_KR',
					},
					{
						property: 'og:locale:alternate',
						content: 'ru_RU',
					},
					{
						property: 'og:image:secure_url',
						content: 'https://carento.uz/img/og-image.jpg',
					},
					{
						property: 'og:image:type',
						content: 'image/jpeg',
					},
				]}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: '/img/logo/favicon.svg',
					},
					{
						rel: 'apple-touch-icon',
						href: '/img/logo/apple-touch-icon.png',
						sizes: '180x180',
					},
				]}
			/>
			{/* Apollo Provider */}
			<ApolloProvider client={client}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Component {...pageProps} />
				</ThemeProvider>
			</ApolloProvider>
		</>
	);
};

export default appWithTranslation(App);
