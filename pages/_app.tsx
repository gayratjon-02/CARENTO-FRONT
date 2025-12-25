import React, { useState } from 'react';
import type { AppProps } from 'next/app';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ApolloProvider } from '@apollo/client';
import { appWithTranslation } from 'next-i18next';

import { DefaultSeo } from 'next-seo';
import seoConfig from '../next-seo.config';

import { useApollo } from '../apollo/client';
import { light } from '../scss/MaterialTheme';

import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const [theme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);

	return (
		<>
			{/* GLOBAL SEO */}
			<DefaultSeo {...seoConfig} />

			{/* Apollo + MUI */}
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
