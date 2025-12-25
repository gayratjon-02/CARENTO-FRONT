const path = require('path');

module.exports = {
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'kr', 'ru'],
		localeDetection: false,
	},
	defaultNS: 'common',
	ns: ['common'],
	localePath: path.resolve('./public/locales'),
	reloadOnPrerender: process.env.NODE_ENV === 'development',
};
