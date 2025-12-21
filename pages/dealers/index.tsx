import React, { ChangeEvent, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { GET_AGENTS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Messages } from '../../libs/config';
import DealerCard from '../../libs/components/dealers/DealerCard';
import { userVar } from 'apollo/store';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const DealerList: NextPage = ({ initialInput, ...props }: any) => {
	const user = useReactiveVar(userVar);
	const device = useDeviceDetect();
	const router = useRouter();
	const isReload = useMemo(() => {
		if (typeof window === 'undefined') return false;
		try {
			const nav = performance.getEntriesByType?.('navigation')?.[0] as any;
			if (nav?.type) return nav.type === 'reload';
			// Safari fallback
			return (performance as any)?.navigation?.type === 1;
		} catch {
			return false;
		}
	}, []);
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [filterSortName, setFilterSortName] = useState('Recent');
	const [sortingOpen, setSortingOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [dealers, setDealers] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');
	const totalPages = useMemo(() => Math.ceil(total / searchFilter.limit) || 1, [total, searchFilter.limit]);
	const searchDebounceRef = useRef<number | null>(null);
	const searchFilterRef = useRef<any>(searchFilter);
	const didInitFromUrlRef = useRef(false);

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const {
		loading: getAgentsLoading,
		data: getAgentsData,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setDealers(data?.getAgents?.list);
			setTotal(data?.getAgents?.metaCounter?.[0]?.total ?? 0);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		searchFilterRef.current = searchFilter;
	}, [searchFilter]);

	useEffect(() => {
		if (!router.isReady) return;
		// Only handle initial page load. Subsequent router.query.input changes happen during SPA interactions
		// (debounced search, pagination, sorting) and should not reset search input.
		if (didInitFromUrlRef.current) return;

		if (router.query.input) {
			const input_obj = JSON.parse(router?.query?.input as string);
			if (isReload) {
				const cleaned = {
					...input_obj,
					page: 1,
					search: { ...(input_obj?.search ?? {}), text: '' },
				};
				setSearchFilter(cleaned);
				setSearchText('');
				router.replace(`/dealers?input=${JSON.stringify(cleaned)}`, `/dealers?input=${JSON.stringify(cleaned)}`, {
					scroll: false,
				});
			} else {
				setSearchFilter(input_obj);
				setSearchText(input_obj?.search?.text ?? '');
				setCurrentPage(input_obj?.page ?? 1);
			}
		} else {
			// First entry without a query: keep state as-is (usually empty) and sync to URL
			setSearchText(searchFilter?.search?.text ?? '');
			router.replace(`/dealers?input=${JSON.stringify(searchFilter)}`, `/dealers?input=${JSON.stringify(searchFilter)}`, {
				scroll: false,
			});
		}

		didInitFromUrlRef.current = true;
	}, [router.isReady, router.query.input]);

	// Live search (debounced) while typing
	useEffect(() => {
		if (!router.isReady) return;
		if (!didInitFromUrlRef.current) return;

		if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current);
		let cancelled = false;
		searchDebounceRef.current = window.setTimeout(async () => {
			if (cancelled) return;
			const next = {
				...searchFilter,
				page: 1,
				search: { ...searchFilter.search, text: searchText },
			};
			setSearchFilter(next);
			setCurrentPage(1);
			router.replace(`/dealers?input=${JSON.stringify(next)}`, `/dealers?input=${JSON.stringify(next)}`, {
				scroll: false,
			});

			try {
				const refetchRes = await getAgentsRefetch({ input: next });
				if (refetchRes?.data?.getAgents) {
					setDealers(refetchRes.data.getAgents.list ?? []);
					setTotal(refetchRes.data.getAgents.metaCounter?.[0]?.total ?? 0);
				}
			} catch (err) {
				// keep UI stable; errorLink/sweetAlert already handles most GraphQL errors
			}
		}, 350);

		return () => {
			cancelled = true;
			if (searchDebounceRef.current) window.clearTimeout(searchDebounceRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchText]);

	/** HANDLERS **/
	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		let next = { ...searchFilter };
		switch (e.currentTarget.id) {
			case 'recent':
				next = { ...searchFilter, sort: 'createdAt', direction: 'DESC', page: 1 };
				setFilterSortName('Recent');
				break;
			case 'old':
				next = { ...searchFilter, sort: 'createdAt', direction: 'ASC', page: 1 };
				setFilterSortName('Oldest order');
				break;
			case 'likes':
				next = { ...searchFilter, sort: 'memberLikes', direction: 'DESC', page: 1 };
				setFilterSortName('Likes');
				break;
			case 'views':
				next = { ...searchFilter, sort: 'memberViews', direction: 'DESC', page: 1 };
				setFilterSortName('Views');
				break;
		}
		setSearchFilter(next);
		setCurrentPage(next.page ?? 1);
		router.replace(`/dealers?input=${JSON.stringify(next)}`, `/dealers?input=${JSON.stringify(next)}`, { scroll: false });
		setSortingOpen(false);
		setAnchorEl2(null);
	};

	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		const next = { ...searchFilter, page: value };
		await router.push(`/dealers?input=${JSON.stringify(next)}`, `/dealers?input=${JSON.stringify(next)}`, {
			scroll: false,
		});
		setSearchFilter(next);
		setCurrentPage(value);
	};
		const likeMemberHandler = async (id: any) => {
			try {
				const memberId =
					typeof id === 'string' ? id : typeof id?._id === 'string' ? id._id : id?._id ? String(id._id) : '';
				if (!memberId) return;
				if (!user?._id) throw new Error(Messages.error2);

				const res = await likeTargetMember({
					variables: { input: memberId },
				});

				if (res?.data?.likeTargetMember) {
					const nextMember = res.data.likeTargetMember as any;
					setDealers((prev) =>
						prev.map((m: any) =>
							String(m?._id) === String(memberId)
								? {
										...m,
										memberLikes: nextMember?.memberLikes ?? m?.memberLikes,
										meLiked: nextMember?.meLiked ?? m?.meLiked,
									}
								: m,
						),
					);
				}

				const refetchRes = await getAgentsRefetch({ input: searchFilterRef.current });
				if (refetchRes?.data?.getAgents) {
					setDealers(refetchRes.data.getAgents.list ?? []);
					setTotal(refetchRes.data.getAgents.metaCounter?.[0]?.total ?? 0);
				}

				await sweetTopSmallSuccessAlert('success', 800);
			} catch (err: any) {
				console.log('ERROR, likeMemberHandler:', err.message);
				await sweetMixinErrorAlert(err.message);
				throw err;
			}
		};

	if (device === 'mobile') {
		return (
			<Stack className={'dealer-list-page'}>
				<Stack className={'container'}>
					<Stack className="dealer-header">
						<Box className="title">
							<strong>Dealers</strong>
							<span>Browse verified dealers and their listings</span>
						</Box>
					</Stack>
					<Stack className={'dealer-grid'}>
						{dealers?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Dealers found!</p>
							</div>
						) : (
							dealers.map((dealer: Member) => (
								<DealerCard dealer={dealer} key={dealer._id} likeMemberHandler={likeMemberHandler} />
							))
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'dealer-list-page'}>
				<Stack className={'container'}>
					<Stack className={'dealer-toolbar'}>
						<Box className="dealer-toolbar__title">Dealers</Box>

						<Box className="dealer-toolbar__row">
								<Box className="dealer-toolbar__left">
									<Box className="pill">
									<strong>{(total ?? 0).toLocaleString()}</strong>
									<small>dealers</small>
								</Box>
								<Box className="pill">
									<strong>{filterSortName}</strong>
									<small>sorting</small>
								</Box>
							</Box>

							<Box component={'div'} className={'search'}>
								<input
									type="text"
									placeholder={'Search for a dealer'}
									value={searchText}
									onChange={(e: any) => setSearchText(e.target.value)}
								/>
							</Box>

							<Box component={'div'} className={'sort'}>
								<span className="label">Sort by</span>
								<div className="select">
									<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
										{filterSortName}
									</Button>
									<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
										<MenuItem onClick={sortingHandler} id={'recent'} disableRipple>
											Recent
										</MenuItem>
										<MenuItem onClick={sortingHandler} id={'old'} disableRipple>
											Oldest
										</MenuItem>
										<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>
											Likes
										</MenuItem>
										<MenuItem onClick={sortingHandler} id={'views'} disableRipple>
											Views
										</MenuItem>
									</Menu>
								</div>
							</Box>
						</Box>
					</Stack>
					<Stack className={'dealer-grid'}>
						{dealers?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Dealers found!</p>
							</div>
						) : (
							dealers.map((dealer: Member) => {
								return <DealerCard dealer={dealer} key={dealer._id} likeMemberHandler={likeMemberHandler} />;
							})
						)}
					</Stack>
					<Stack className={'dealer-pagination'}>
						{dealers.length !== 0 && totalPages > 1 && (
							<Stack className="pagination-box">
								<Pagination
									page={currentPage}
									count={totalPages}
									onChange={paginationChangeHandler}
									shape="circular"
									color="primary"
								/>
							</Stack>
						)}
						{dealers.length !== 0 && <span>Total {(total ?? 0).toLocaleString()} dealers available</span>}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

DealerList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(DealerList);
