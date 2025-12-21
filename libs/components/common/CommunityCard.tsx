import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ButtonBase, Stack, Typography } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface CommunityCardProps {
	boardArticle: BoardArticle;
	size?: string;
	likeArticleHandler?: any;
	likeBoArticleHandler?: any;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { boardArticle, size = 'normal', likeArticleHandler, likeBoArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const likeHandler = likeArticleHandler ?? likeBoArticleHandler;
	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/communityImg.png';

	const isLikedFromApi = useMemo(() => {
		const anyArticle = boardArticle as any;
		if (Array.isArray(anyArticle?.meLiked) && anyArticle.meLiked.length > 0) {
			return Boolean(anyArticle.meLiked[0]?.myFavorite);
		}
		return Boolean(anyArticle?.isLiked ?? anyArticle?.liked ?? anyArticle?.isFavorite ?? false);
	}, [boardArticle]);

	const [liked, setLiked] = useState<boolean>(isLikedFromApi);

	useEffect(() => {
		setLiked(isLikedFromApi);
	}, [isLikedFromApi]);

	const likesCount = useMemo(() => {
		const anyArticle = boardArticle as any;
		const v = anyArticle?.articleLikes ?? anyArticle?.likes ?? anyArticle?.likeCount ?? 0;
		return typeof v === 'number' ? v : Number(v) || 0;
	}, [boardArticle]);

	/** HANDLERS **/
	const chooseArticleHandler = (e: React.SyntheticEvent, boardArticle: BoardArticle) => {
		router.push(
			{
				pathname: '/community/detail',
				query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
			},
			undefined,
			{ shallow: true },
		);
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const handleLikeClick = async (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		e.preventDefault();
		if (!boardArticle?._id || !likeHandler) return;

		const prev = liked;
		const next = !prev;
		setLiked(next);

		try {
			await likeHandler(e, user, boardArticle?._id);
		} catch (err) {
			setLiked(prev);
		}
	};

	if (device === 'mobile') {
		return <div>COMMUNITY CARD MOBILE</div>;
	} else {
		return (
			<Stack
				sx={{ width: size === 'small' ? '285px' : '317px' }}
				className="community-general-card-config"
				onClick={(e) => chooseArticleHandler(e, boardArticle)}
			>
				<Stack className="image-box">
					<img src={imagePath} alt="" className="card-img" />
				</Stack>
				<Stack className="desc-box" sx={{ marginTop: '-20px' }}>
					<Stack>
						<Typography
							className="desc"
							onClick={(e) => {
								e.stopPropagation();
								goMemberPage(boardArticle?.memberData?._id as string);
							}}
						>
							{boardArticle?.memberData?.memberNick}
						</Typography>
						<Typography className="title">{boardArticle?.articleTitle}</Typography>
					</Stack>
					<Stack className={'buttons'}>
						<ButtonBase className={`community-like-btn ${liked ? 'liked' : ''}`} onClick={handleLikeClick}>
							{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
							<Typography className="community-like-count">{Number(likesCount).toLocaleString()}</Typography>
						</ButtonBase>
					</Stack>
				</Stack>
				<Stack className="date-box">
					<Moment className="month" format={'MMMM'}>
						{boardArticle?.createdAt}
					</Moment>
					<Typography className="day">
						<Moment format={'DD'}>{boardArticle?.createdAt}</Moment>
					</Typography>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityCard;
