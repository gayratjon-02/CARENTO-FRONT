import React from 'react';
import { useRouter } from 'next/router';
import { Avatar, Box, Button, Chip, Divider, List, ListItemButton, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { sweetConfirmAlert } from '../../sweetAlert';
import { useTranslation } from 'next-i18next';

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const category: any = router.query?.category ?? 'myProfile';
	const user = useReactiveVar(userVar);
	const isAgent = user?.memberType === 'AGENT';
	const { t } = useTranslation('common');

	const apiBase = REACT_APP_API_URL && REACT_APP_API_URL !== 'undefined' ? REACT_APP_API_URL : '';
	const avatarSrc = (() => {
		const img = (user as any)?.memberImage as string | undefined;
		if (!img) return '/img/profile/defaultUser.svg';
		if (img.startsWith('http')) return img;
		if (img.startsWith('/img/')) return img;
		if (apiBase) return `${apiBase}/${img}`;
		return img.startsWith('/') ? img : `/${img}`;
	})();

	const goCategory = async (nextCategory: string) => {
		await router.push({ pathname: '/mypage', query: { category: nextCategory } }, undefined, {
			shallow: true,
			scroll: false,
		});
	};

	const logoutHandler = async () => {
		if (await sweetConfirmAlert(t('Do you want to logout?', { defaultValue: 'Do you want to logout?' }))) logOut();
	};

	const menuGroups: Array<{
		title: string;
		items: Array<{ key: string; label: string; agentOnly?: boolean }>;
	}> = [
		{
			title: t('Manage', { defaultValue: 'Manage' }),
			items: [
				{ key: 'addCar', label: t('Add Car', { defaultValue: 'Add Car' }), agentOnly: true },
				{ key: 'myCars', label: t('My Cars', { defaultValue: 'My Cars' }), agentOnly: true },
				{ key: 'myFavorites', label: t('Favorites', { defaultValue: 'Favorites' }) },
				{ key: 'recentlyVisited', label: t('Recently Visited', { defaultValue: 'Recently Visited' }) },
				{ key: 'followers', label: t('Followers', { defaultValue: 'Followers' }) },
				{ key: 'followings', label: t('Followings', { defaultValue: 'Followings' }) },
			],
		},
		{
			title: t('Community', { defaultValue: 'Community' }),
			items: [
				{ key: 'myArticles', label: t('Articles', { defaultValue: 'Articles' }) },
				{ key: 'writeArticle', label: t('Write Article', { defaultValue: 'Write Article' }) },
			],
		},
		{
			title: t('Account', { defaultValue: 'Account' }),
			items: [{ key: 'myProfile', label: t('My Profile', { defaultValue: 'My Profile' }) }],
		},
	];

	if (device === 'mobile') return <div>MY MENU</div>;

	return (
		<Stack className="mypage-menu">
			<Stack className="menu-header" direction="row" alignItems="center" spacing={1.6}>
				<Avatar src={avatarSrc} className="avatar" />
				<Stack className="info" spacing={0.2}>
					<Typography className="name">{user?.memberNick || user?.memberFullName || t('User', { defaultValue: 'User' })}</Typography>
					<Typography className="phone">{user?.memberPhone || ''}</Typography>
				</Stack>
				<Chip className="role" label={user?.memberType || 'USER'} />
			</Stack>

			{user?.memberType === 'ADMIN' && (
				<Box className="admin-link">
					<Button onClick={() => window.open('/_admin/', '_blank')} className="admin-btn">
						Open Admin
					</Button>
				</Box>
			)}

			<Divider className="divider" />

			<Stack className="menu-body" spacing={2}>
				{menuGroups.map((group) => (
					<Stack key={group.title} className="group" spacing={1}>
						<Typography className="group-title">{group.title}</Typography>
						<List className="list">
							{group.items
								.filter((it) => !it.agentOnly || isAgent)
								.map((it) => (
									<ListItemButton
										key={it.key}
										className={`item ${String(category) === it.key ? 'active' : ''}`}
										onClick={() => goCategory(it.key)}
									>
										<span className="dot" />
										<Typography className="label">{it.label}</Typography>
									</ListItemButton>
								))}
						</List>
					</Stack>
				))}
			</Stack>

			<Box className="menu-footer">
				<Button className="logout" onClick={logoutHandler}>
					{t('Logout', { defaultValue: 'Logout' })}
				</Button>
			</Box>
		</Stack>
	);
};

export default MyMenu;
