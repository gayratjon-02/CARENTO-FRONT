/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
		REACT_APP_API_WS: process.env.REACT_APP_API_WS,
	},
	images: {
		remotePatterns: [
			{ protocol: 'http', hostname: '167.172.90.235', port: '4027', pathname: '/uploads/**' },
			{ protocol: 'http', hostname: '167.172.90.235', port: '4001', pathname: '/uploads/**' },
			{ protocol: 'https', hostname: '167.172.90.235', port: '', pathname: '/uploads/**' },
		],
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;
