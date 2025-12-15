import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Stack, Typography, Box, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_ARTICLES } from '../../../apollo/user/query';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { Article } from '../../types/board-article/board-article';
import { T } from '../../types/common';

const CommunityBoards = () => {
	const device = useDeviceDetect();
	const isDesktop = device !== 'mobile';
	const [newsArticles, setNewsArticles] = useState<Article[]>([]);

	const [selectedCategory, setSelectedCategory] = useState<BoardArticleCategory>(BoardArticleCategory.FREE);

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

		return newsArticles.map((article) => (
			<Box key={article._id} className="review-card">
				<Typography component="h3" className="review-title">
					{article.articleTitle}
				</Typography>
				<Typography component="p" className="review-description">
					{article.articleContent}
				</Typography>
				<Box className="review-footer">
					<Box className="reviewer">
						<Box className="avatar" aria-hidden="true"></Box>
						<Box className="reviewer-meta">
							<strong>{article.memberData?.memberNick || 'Guest user'}</strong>
							<span>{article.memberData?.memberAddress || 'Unknown location'}</span>
						</Box>
					</Box>
					{renderRating(article.memberData?.memberRank || 0)}
				</Box>
			</Box>
		));
	};

	const categoryButtons = [
		{ value: BoardArticleCategory.FREE, label: 'Free' },
		{ value: BoardArticleCategory.RECOMMEND, label: 'Recommend' },
		{ value: BoardArticleCategory.NEWS, label: 'News' },
	];

	const handleCategoryChange = (category: BoardArticleCategory) => {
		setSelectedCategory(category);
	};

	return (
		<Stack className={'user-reviews'}>
			<Stack className={'container'}>
				<Stack className="reviews-header">
					<Typography component="h2">Users review</Typography>
					<Typography component="p">
						Honest words from travelers who trusted our service. Real experiences, genuine satisfaction.
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
