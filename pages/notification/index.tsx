import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NotificationLayout } from '../../libs/components/notification';
import withLayoutMain from 'libs/components/layout/LayoutHome';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';

const NotificationPage = () => {
	const { locale } = useRouter();
	const title =
		locale?.startsWith('ru') ? 'Уведомления' : locale?.startsWith('uz') ? 'Bildirishnomalar' : 'Notifications';
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const isAuthed = Boolean(user?._id);

	React.useEffect(() => {
		if (typeof window === 'undefined') return;
		if (isAuthed) return;
		router.replace('/');
	}, [isAuthed, router]);

	if (!isAuthed) return null;

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<NotificationLayout />
		</>
	);
};

// Disable hero banner for this page to keep the layout focused.
// @ts-ignore
NotificationPage.disableHero = true;

export default withLayoutMain(NotificationPage);
