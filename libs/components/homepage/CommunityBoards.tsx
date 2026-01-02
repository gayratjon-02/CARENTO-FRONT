import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Stack, Typography, Box, Button, ButtonBase } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_ARTICLES } from '../../../apollo/user/query';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { Article } from '../../types/board-article/board-article';
import { T } from '../../types/common';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { userVar } from '../../../apollo/store';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import { REACT_APP_API_URL } from '../../config';
import { useTranslation } from 'next-i18next';

const CommunityBoards = () => {
	const { t } = useTranslation('common');
	const device = useDeviceDetect();
	const isDesktop = device !== 'mobile';
	const [newsArticles, setNewsArticles] = useState<Article[]>([]);
	const user = useReactiveVar(userVar);

	const [selectedCategory, setSelectedCategory] = useState<BoardArticleCategory>(BoardArticleCategory.FREE);

	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: getArticlesLoading,
		data: getArticlesData,
		error: getArticlesError,
		refetch: getArticlesRefetch,
	} = useQuery(GET_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 3,
				sort: 'articleViews',
				direction: 'DESC',
				search: { articleCategory: selectedCategory },
			},
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNewsArticles(data?.getArticles?.list);
		},
	});

	console.log('newsArticles::++++', newsArticles);

	const renderRating = (value: number) => {
		return (
			<Box className="review-rating">
				{Array.from({ length: 5 }).map((_, idx) => (
					<span key={idx} className={idx < value ? 'star active' : 'star'}></span>
				))}
			</Box>
		);
	};

	const likeArticleHandler = async (userData: T, id: string) => {
		try {
			if (!id) return;
			if (!userData?._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetBoardArticle({ variables: { input: id } });
			await getArticlesRefetch();
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR: likeArticleHandler', err.message);
			sweetMixinErrorAlert(err.message).then;
			throw err;
		}
	};

	const ReviewCard = ({ article }: { article: Article }) => {
		const isLikedFromApi = useMemo(() => {
			const anyArticle = article as any;
			if (Array.isArray(anyArticle?.meLiked) && anyArticle.meLiked.length > 0) {
				return Boolean(anyArticle.meLiked[0]?.myFavorite);
			}
			return Boolean(anyArticle?.isLiked ?? anyArticle?.liked ?? anyArticle?.isFavorite ?? false);
		}, [article]);

		const [liked, setLiked] = useState<boolean>(isLikedFromApi);

		useEffect(() => {
			setLiked(isLikedFromApi);
		}, [isLikedFromApi]);

		const likesCount = useMemo(() => {
			const anyArticle = article as any;
			const v = anyArticle?.articleLikes ?? anyArticle?.likes ?? anyArticle?.likeCount ?? 0;
			return typeof v === 'number' ? v : Number(v) || 0;
		}, [article]);

		const avatarSrc = useMemo(() => {
			const raw = article?.memberData?.memberImage || '';
			if (!raw) return '/img/profile/defaultUser.svg';
			if (/^https?:\/\//i.test(raw)) return raw;
			const normalized = raw.startsWith('/') ? raw.slice(1) : raw;
			const base = REACT_APP_API_URL || '';
			const baseNormalized = base.endsWith('/') ? base.slice(0, -1) : base;
			return `${baseNormalized}/${normalized}`;
		}, [article?.memberData?.memberImage]);

		const handleLikeClick = async (e: MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			e.preventDefault();
			if (!article?._id) return;

			const prev = liked;
			const next = !prev;
			setLiked(next);

			try {
				await likeArticleHandler(user, article._id);
			} catch (err) {
				setLiked(prev);
			}
		};

		return (
			<Box key={article._id} className="review-card">
				<Typography component="h3" className="review-title">
					{article.articleTitle}
				</Typography>
				<Typography component="p" className="review-description">
					{article.articleContent}
				</Typography>
				<Box className="review-footer">
					<Box className="reviewer">
						<Box className="avatar" aria-hidden="true">
							<img
								src={avatarSrc}
								alt={article.memberData?.memberNick || 'User'}
								onError={(e: any) => {
									e.target.onerror = null;
									e.target.src = '/img/profile/defaultUser.svg';
								}}
								loading="lazy"
							/>
						</Box>
						<Box className="reviewer-meta">
							<strong>{article.memberData?.memberNick || 'Guest user'}</strong>
							<span>{article.memberData?.memberAddress || 'Unknown location'}</span>
						</Box>
					</Box>
					<Box className="review-actions">
						<ButtonBase className={`review-like-btn ${liked ? 'liked' : ''}`} onClick={handleLikeClick}>
							{liked ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
							<span className="review-like-count">{Number(likesCount).toLocaleString()}</span>
						</ButtonBase>
						{renderRating(article.memberData?.memberRank || 0)}
					</Box>
				</Box>
			</Box>
		);
	};

	const renderCards = () => {
		if (getArticlesLoading) {
			return (
				<Box className="reviews-placeholder">
					<span>Fikrlar yuklanmoqda...</span>
				</Box>
			);
		}

		if (getArticlesError) {
			return (
				<Box className="reviews-placeholder">
					<span>{getArticlesError.message || "Fikrlarni yuklash imkoni bo'lmadi"}</span>
				</Box>
			);
		}

		if (!newsArticles.length) {
			return (
				<Box className="reviews-placeholder">
					<span>Hozircha fikrlar yo'q</span>
				</Box>
			);
		}

		return newsArticles.map((article) => <ReviewCard key={article._id} article={article} />);
	};

	const categoryButtons = [
		{ value: BoardArticleCategory.FREE, label: t('Free', { defaultValue: 'Free' }) },
		{ value: BoardArticleCategory.RECOMMEND, label: t('Recommend', { defaultValue: 'Recommend' }) },
		{ value: BoardArticleCategory.NEWS, label: t('News', { defaultValue: 'News' }) },
	];

	const handleCategoryChange = (category: BoardArticleCategory) => {
		setSelectedCategory(category);
	};

	return (
		<Stack className={'user-reviews'}>
			<Stack className={'container'}>
				<Stack className="reviews-header">
					<Typography component="h2">{t('Users review', { defaultValue: 'Users review' })}</Typography>
					<Typography component="p">
						{t('Honest words from travelers who trusted our service. Real experiences, genuine satisfaction.', {
							defaultValue: 'Honest words from travelers who trusted our service. Real experiences, genuine satisfaction.',
						})}
					</Typography>
					<Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
						{categoryButtons.map((button) => (
							<Button
								key={button.value}
								variant={selectedCategory === button.value ? 'contained' : 'outlined'}
								onClick={() => handleCategoryChange(button.value)}
								sx={{
									minWidth: 120,
									textTransform: 'none',
								}}
							>
								{button.label}
							</Button>
						))}
					</Stack>
				</Stack>
				<Stack className={isDesktop ? 'reviews-grid' : 'reviews-list'}>{renderCards()}</Stack>
			</Stack>
		</Stack>
	);
};

export default CommunityBoards;
