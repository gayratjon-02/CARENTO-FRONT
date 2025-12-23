import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Avatar, Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import MyCars from '../../libs/components/mypage/MyCars';
import MyFavorites from '../../libs/components/mypage/MyFavorites';
import RecentlyVisited from '../../libs/components/mypage/RecentlyVisited';
import AddCar from '../../libs/components/mypage/AddNewCar';
import MyProfile from '../../libs/components/mypage/MyProfile';
import MyArticles from '../../libs/components/mypage/MyArticles';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import MyMenu from '../../libs/components/mypage/MyMenu';
import WriteArticle from '../../libs/components/mypage/WriteArticle';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { getJwtToken } from '../../libs/auth';
import { Messages, REACT_APP_API_URL } from '../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MyPage: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const category: any = router.query?.category ?? 'myProfile';

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!router.isReady) return;
		const jwt = getJwtToken();
		if (!jwt && !user?._id) {
			router.replace({
				pathname: '/account/join',
				query: { redirect: router.asPath },
			});
			return;
		}

		// Backward compatibility: normalize old property-based categories
		if (router.query?.category === 'addProperty') {
			router.replace({ pathname: '/mypage', query: { ...router.query, category: 'addCar' } }, undefined, {
				shallow: true,
				scroll: false,
			});
		}
		if (router.query?.category === 'myProperties') {
			router.replace({ pathname: '/mypage', query: { ...router.query, category: 'myCars' } }, undefined, {
				shallow: true,
				scroll: false,
			});
		}
	}, [router.isReady, user?._id]);

	const navigateCategory = async (nextCategory: string) => {
		await router.push(
			{
				pathname: '/mypage',
				query: { category: nextCategory },
			},
			undefined,
			{ shallow: true, scroll: false },
		);
	};

	const categoryLabel: Record<string, string> = {
		myProfile: 'My Profile',
		addCar: 'Add Car',
		myCars: 'My Cars',
		myFavorites: 'Favorites',
		recentlyVisited: 'Recently Visited',
		myArticles: 'My Articles',
		writeArticle: 'Write Article',
		followers: 'Followers',
		followings: 'Followings',
	};

	const currentTitle = categoryLabel[String(category)] ?? 'My Page';

	const apiBase = REACT_APP_API_URL && REACT_APP_API_URL !== 'undefined' ? REACT_APP_API_URL : '';
	const avatarSrc = (() => {
		const img = (user as any)?.memberImage as string | undefined;
		if (!img) return '/img/profile/defaultUser.svg';
		if (img.startsWith('http')) return img;
		if (apiBase) return `${apiBase}/${img}`;
		return img.startsWith('/') ? img : `/${img}`;
	})();

	const isAgent = user?.memberType === 'AGENT';
	const quickNav = [
		{ key: 'myProfile', label: 'Profile' },
		...(isAgent ? [{ key: 'myCars', label: 'My Cars' }] : []),
		{ key: 'myFavorites', label: 'Favorites' },
		{ key: 'myArticles', label: 'Articles' },
		{ key: 'writeArticle', label: 'Write' },
		{ key: 'followers', label: 'Followers' },
		{ key: 'followings', label: 'Followings' },
	];

	/** HANDLERS **/
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			console.log('id: ', id);
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await subscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Subscribed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await unsubscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Unsubscribed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const likeMemberHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetMember({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Success!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	const content = (
		<>
			{category === 'addCar' && <AddCar />}
			{category === 'myCars' && <MyCars />}
			{category === 'myFavorites' && <MyFavorites />}
			{category === 'recentlyVisited' && <RecentlyVisited />}
			{category === 'myArticles' && <MyArticles />}
			{category === 'writeArticle' && <WriteArticle />}
			{category === 'myProfile' && <MyProfile />}
			{category === 'followers' && (
				<MemberFollowers
					subscribeHandler={subscribeHandler}
					unsubscribeHandler={unsubscribeHandler}
					likeMemberHandler={likeMemberHandler}
					redirectToMemberPageHandler={redirectToMemberPageHandler}
				/>
			)}
			{category === 'followings' && (
				<MemberFollowings
					subscribeHandler={subscribeHandler}
					unsubscribeHandler={unsubscribeHandler}
					likeMemberHandler={likeMemberHandler}
					redirectToMemberPageHandler={redirectToMemberPageHandler}
				/>
			)}
		</>
	);

	if (device === 'mobile') {
		return (
			<div id="my-page">
				<Box
					sx={{
						minHeight: '100vh',
						background:
							'radial-gradient(circle at 20% 20%, rgba(124,93,255,0.22), transparent 26%), radial-gradient(circle at 80% 10%, rgba(255,112,168,0.22), transparent 26%), #050814',
						color: '#e9ecf5',
						px: 2.4,
						pt: 10,
						pb: 7,
					}}
				>
					<Stack spacing={2.2}>
						<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
							<Stack spacing={0.35} sx={{ minWidth: 0 }}>
								<Typography sx={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.4 }}>My Page</Typography>
								<Typography
									sx={{
										color: '#c4c8dc',
										fontSize: 13,
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
									}}
								>
									{currentTitle}
								</Typography>
							</Stack>
							<Avatar src={avatarSrc} sx={{ width: 42, height: 42, border: '1px solid rgba(255,255,255,0.14)' }} />
						</Stack>

						<Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
							{quickNav.map((item) => (
								<Chip
									key={item.key}
									label={item.label}
									onClick={() => navigateCategory(item.key)}
									clickable
									sx={{
										height: 34,
										borderRadius: 999,
										fontWeight: 700,
										color: category === item.key ? '#ffffff' : '#dfe4ff',
										border:
											category === item.key ? '1px solid rgba(159,178,255,0.8)' : '1px solid rgba(255,255,255,0.12)',
										background: category === item.key ? 'rgba(124,93,255,0.18)' : 'rgba(255,255,255,0.04)',
									}}
								/>
							))}
						</Stack>

						<Stack direction="row" spacing={1.2}>
							<Button
								fullWidth
								variant="contained"
								onClick={() => navigateCategory('writeArticle')}
								sx={{
									borderRadius: 14,
									height: 40,
									background: '#7c5dff',
									textTransform: 'none',
									fontWeight: 800,
									'&:hover': { background: '#6c52f0' },
								}}
							>
								Write
							</Button>
							{isAgent ? (
								<Button
									fullWidth
									variant="outlined"
									onClick={() => navigateCategory('addCar')}
									sx={{
										borderRadius: 14,
										height: 40,
										borderColor: 'rgba(255,255,255,0.2)',
										color: '#e9ecf5',
										textTransform: 'none',
										fontWeight: 800,
										'&:hover': { borderColor: 'rgba(255,255,255,0.35)' },
									}}
								>
									Add Car
								</Button>
							) : (
								<Button
									fullWidth
									variant="outlined"
									onClick={() => navigateCategory('myFavorites')}
									sx={{
										borderRadius: 14,
										height: 40,
										borderColor: 'rgba(255,255,255,0.2)',
										color: '#e9ecf5',
										textTransform: 'none',
										fontWeight: 800,
										'&:hover': { borderColor: 'rgba(255,255,255,0.35)' },
									}}
								>
									Favorites
								</Button>
							)}
						</Stack>

						<Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

						<Box
							sx={{
								background: 'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
								border: '1px solid rgba(255,255,255,0.10)',
								borderRadius: 18,
								p: 2,
								boxShadow: '0 30px 90px rgba(0,0,0,0.32)',
								backdropFilter: 'blur(12px)',
							}}
						>
							{content}
						</Box>
					</Stack>
				</Box>
			</div>
		);
	}

	return (
		<div id="my-page" style={{ position: 'relative' }}>
			<div className="container">
				<Stack className="my-dashboard">
					<Stack className="dash-grid" direction="row" spacing={2.2} alignItems="flex-start">
						<Stack className="dash-side">
							<MyMenu />
						</Stack>

						<Stack className="dash-main" spacing={1.5}>
							<Box className="content-card">{content}</Box>
						</Stack>
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutBasic(MyPage);
