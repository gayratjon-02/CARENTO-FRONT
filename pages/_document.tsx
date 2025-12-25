// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta charSet="utf-8" />
				<meta name="robots" content="index,follow" />

				<link rel="icon" href="/img/icons/main-logotip.svg" />
				<link rel="apple-touch-icon" href="/img/logo/apple-touch-icon.png" sizes="180x180" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
