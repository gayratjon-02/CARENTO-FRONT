import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NotificationLayout } from '../../libs/components/notification';
import withLayoutMain from 'libs/components/layout/LayoutHome';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { sweetLoginConfirmAlert } from '../../libs/sweetAlert';

const NotificationPage = () => {
	const { locale } = useRouter();
	const title =
		locale?.startsWith('ru') ? 'Уведомления' : locale?.startsWith('uz') ? 'Bildirishnomalar' : 'Notifications';
	const router = useRouter();
	const user = useReactiveVar(userVar);

	React.useEffect(() => {
		if (typeof window === 'undefined') return;
		if (user?._id) return;

		sweetLoginConfirmAlert('Please log in first.').then((confirmed) => {
			if (confirmed) {
				router.replace('/account/login');
			} else {
				router.replace('/');
			}
		});
	}, [router, user?._id]);

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
