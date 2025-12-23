import React from 'react';
import { useRouter } from 'next/router';
import { Avatar, Box, Button, Chip, Divider, List, ListItemButton, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { sweetConfirmAlert } from '../../sweetAlert';

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const category: any = router.query?.category ?? 'myProfile';
	const user = useReactiveVar(userVar);
	const isAgent = user?.memberType === 'AGENT';

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
		if (await sweetConfirmAlert('Do you want to logout?')) logOut();
	};

	const menuGroups: Array<{
		title: string;
		items: Array<{ key: string; label: string; agentOnly?: boolean }>;
	}> = [
		{
			title: 'Manage',
			items: [
				{ key: 'addProperty', label: 'Add Car', agentOnly: true },
				{ key: 'myProperties', label: 'My Cars', agentOnly: true },
				{ key: 'myFavorites', label: 'Favorites' },
				{ key: 'recentlyVisited', label: 'Recently Visited' },
				{ key: 'followers', label: 'Followers' },
				{ key: 'followings', label: 'Followings' },
			],
		},
		{
			title: 'Community',
			items: [
				{ key: 'myArticles', label: 'Articles' },
				{ key: 'writeArticle', label: 'Write Article' },
			],
		},
		{
			title: 'Account',
			items: [{ key: 'myProfile', label: 'My Profile' }],
		},
	];

	if (device === 'mobile') return <div>MY MENU</div>;

	return (
		<Stack className="mypage-menu">
			<Stack className="menu-header" direction="row" alignItems="center" spacing={1.6}>
				<Avatar src={avatarSrc} className="avatar" />
				<Stack className="info" spacing={0.2}>
					<Typography className="name">{user?.memberNick || user?.memberFullName || 'User'}</Typography>
					<Typography className="phone">{user?.memberPhone || ''}</Typography>
				</Stack>
				<Chip className="role" label={user?.memberType || 'USER'} />
			</Stack>

			{user?.memberType === 'ADMIN' && (
				<Box className="admin-link">
					<Button onClick={() => window.open('/_admin/users', '_blank')} className="admin-btn">
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
					Logout
				</Button>
			</Box>
		</Stack>
	);
};

export default MyMenu;
