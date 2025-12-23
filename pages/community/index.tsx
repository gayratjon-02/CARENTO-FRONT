import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Button, Chip, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import CommunityCard from '../../libs/components/common/CommunityCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Article } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { GET_ARTICLES } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Community: NextPage = ({ initialInput }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<Article[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	const categories = [
		{ key: 'FREE', label: 'Free Board', desc: 'Open chat about anything' },
		{ key: 'RECOMMEND', label: 'Recommend', desc: 'Best spots & services' },
		{ key: 'NEWS', label: 'News', desc: 'Auto industry updates' },
		{ key: 'HUMOR', label: 'Humor', desc: 'Memes & fun' },
	];

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: boardArticlesLoading,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: searchCommunity,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getArticles?.list || []);
			setTotalCount(data?.getArticles?.metaCounter?.[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (articleCategory) {
			setSearchCommunity((prev) => ({
				...prev,
				search: { articleCategory: articleCategory as BoardArticleCategory },
			}));
		} else {
			router.replace(
				{ pathname: router.pathname, query: { articleCategory: 'FREE' } },
				router.pathname,
				{ shallow: true },
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [articleCategory]);

	/** HANDLERS **/
	const tabChangeHandler = async (value: string) => {
		const next = { ...searchCommunity, page: 1, search: { articleCategory: value as BoardArticleCategory } };
		setSearchCommunity(next);
		await router.push(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			router.pathname,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeArticleHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});
			await boardArticlesRefetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') return <h1>COMMUNITY PAGE MOBILE</h1>;

	return (
		<div id="community-list-page">
			<div className="container">
				<Stack className="community-hero">
					<Stack className="hero-text" spacing={1.2}>
						<Typography className="eyebrow">Community</Typography>
						<Typography className="hero-title">Drive the conversation.</Typography>
						<Typography className="hero-sub">
							Learn, share, and laugh with enthusiasts. Pick a lane and dive into the latest posts.
						</Typography>
						<Stack direction="row" spacing={1.2} className="hero-actions">
							<Button
								variant="contained"
								onClick={() =>
									router.push({
										pathname: '/mypage',
										query: { category: 'writeArticle' },
									})
								}
							>
								Write an article
							</Button>
							<Button sx={{color:'red'}}  variant="outlined" onClick={() => tabChangeHandler(searchCommunity.search.articleCategory)}>
								Refresh
							</Button>
						</Stack>
					</Stack>
					<Stack className="hero-stats">
						<Box className="stat-card">
							<Typography className="stat-number">{totalCount?.toLocaleString?.() || 0}</Typography>
							<Typography className="stat-label">Articles</Typography>
						</Box>
						<Box className="stat-card">
							<Typography className="stat-number">{searchCommunity.search.articleCategory}</Typography>
							<Typography className="stat-label">Category</Typography>
						</Box>
					</Stack>
				</Stack>

				<Stack className="community-layout">
					<Stack className="sidebar">
						<Typography className="side-title">Boards</Typography>
						<Stack className="side-list">
							{categories.map((cat) => (
								<Button
									key={cat.key}
									className={`side-item ${searchCommunity.search.articleCategory === cat.key ? 'active' : ''}`}
									onClick={() => tabChangeHandler(cat.key)}
								>
									<Stack alignItems="flex-start">
										<span className="label">{cat.label}</span>
										<span className="desc">{cat.desc}</span>
									</Stack>
								</Button>
							))}
						</Stack>
						<Box className="side-meta">
							<Typography className="meta-title">Showing</Typography>
							<Typography className="meta-value">
								{boardArticles?.length || 0} / {totalCount?.toLocaleString?.() || 0}
							</Typography>
						</Box>
					</Stack>

					<Stack className="content">
						<Stack className="content-header">
							<Typography className="content-title">Latest posts</Typography>
							<Typography className="content-sub">
								Sorted by newest • {searchCommunity.search.articleCategory} board
							</Typography>
						</Stack>

						<Stack className="community-grid">
							{boardArticlesLoading && (
								<>
									{Array.from({ length: 6 }).map((_, idx) => (
										<Box key={idx} className="card-skeleton">
											<Skeleton variant="rounded" height={180} />
											<Skeleton variant="text" width="60%" />
											<Skeleton variant="text" width="40%" />
										</Box>
									))}
								</>
							)}

							{!boardArticlesLoading && boardArticles?.length > 0 ? (
								boardArticles.map((boardArticle: Article) => (
									<CommunityCard
										boardArticle={boardArticle}
										likeBoArticleHandler={likeArticleHandler}
										key={boardArticle?._id}
										size="small"
									/>
								))
							) : (
								!boardArticlesLoading && (
									<Box className="empty-state">
										<img src="/img/icons/icoAlert.svg" alt="" />
										<Typography className="empty-title">No article found</Typography>
										<Typography className="empty-desc">Be the first to write in this category.</Typography>
										<Button
											variant="contained"
											onClick={() =>
												router.push({
													pathname: '/mypage',
													query: { category: 'writeArticle' },
												})
											}
										>
											Write now
										</Button>
									</Box>
								)
							)}
						</Stack>

						{totalCount > searchCommunity.limit && (
							<Stack className="community-pagination" direction="row" spacing={1} alignItems="center">
								<Pagination
									count={Math.max(1, Math.ceil(totalCount / searchCommunity.limit))}
									page={searchCommunity.page}
									shape="rounded"
									color="primary"
									onChange={paginationHandler}
								/>
								<Typography className="page-meta">
									Page {searchCommunity.page} of {Math.max(1, Math.ceil(totalCount / searchCommunity.limit))}
								</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 12,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			articleCategory: 'FREE',
		},
	},
};

export default withLayoutBasic(Community);
