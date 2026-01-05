import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NotificationLayout } from '../../libs/components/notification';
import withLayoutMain from 'libs/components/layout/LayoutHome';

const NotificationPage = () => {
	const { locale } = useRouter();
	const title =
		locale?.startsWith('ru') ? 'Уведомления' : locale?.startsWith('uz') ? 'Bildirishnomalar' : 'Notifications';

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<NotificationLayout />
		</>
	);
};

export default withLayoutMain(NotificationPage);
