import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Avatar, Box, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { GET_BOARD_ARTICLE } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CommunityDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;

	const articleId = query?.id as string;
	const articleCategory = query?.articleCategory as string;

	const user = useReactiveVar(userVar);
	const [memberImage, setMemberImage] = useState<string>('/img/types/Sedan.jpeg');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const [boardArticle, setBoardArticle] = useState<BoardArticle>();

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: boardArticleLoading,
		refetch: boardArticleRefetch,
	} = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		skip: !articleId,
		variables: {
			input: articleId,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setBoardArticle(data?.getBoardArticle);
			if (data?.getBoardArticle?.memberData?.memberImage) {
				setMemberImage(`${process.env.REACT_APP_API_URL}/${data?.getBoardArticle?.memberData?.memberImage}`);
			}
		},
	});

	/** HANDLERS **/
	const likeBoArticleHandler = async (user: any, id: any) => {
		try {
			if (likeLoading) return;
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			setLikeLoading(true);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});
			await boardArticleRefetch({ input: articleId });
			await sweetTopSmallSuccessAlert('Success!', 800);
		} catch (err: any) {
			console.log('ERROR, likeBoArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLikeLoading(false);
		}
	};

	const isArticleLoading = boardArticleLoading || !boardArticle?._id;

	if (device === 'mobile') return <div>COMMUNITY DETAIL PAGE MOBILE</div>;

	return (
		<div id="community-detail-page">
			<div className="container">
				{!isArticleLoading && !boardArticle?._id && (
					<Box className="cd-empty">
						<Typography className="hero-title">Article not found</Typography>
						<Typography className="hero-sub">We could not load this post. Please try again.</Typography>
					</Box>
				)}

				<Stack className="cd-header-simple" spacing={1.2}>
					<Stack direction="row" alignItems="center" justifyContent="space-between">
						<Chip label={articleCategory || 'Board'} className="hero-chip" />
						<Typography className="hero-date">
							{isArticleLoading ? <Skeleton variant="text" width={90} /> : <Moment format="DD MMM, YYYY">{boardArticle?.createdAt}</Moment>}
						</Typography>
					</Stack>
					{isArticleLoading ? (
						<Stack spacing={1}>
							<Skeleton variant="text" width="65%" height={34} />
							<Skeleton variant="text" width="80%" />
						</Stack>
					) : (
						<>
							<Typography className="hero-title">{boardArticle?.articleTitle || 'Article'}</Typography>
							<Typography className="hero-sub">
								{boardArticle?.articleContent?.slice(0, 140) || 'Stories, tips, and road moments from the community.'}
							</Typography>
						</>
					)}
				</Stack>

				<Stack className="cd-author-card" direction="row" spacing={2} alignItems="center">
					<Avatar src={memberImage} sx={{ width: 64, height: 64 }} />
					<Box sx={{ flex: 1 }}>
						{isArticleLoading ? (
							<>
								<Skeleton variant="text" width="30%" />
								<Skeleton variant="text" width="45%" />
							</>
						) : (
							<>
								<Typography className="hero-author">{boardArticle?.memberData?.memberNick || 'Member'}</Typography>
								<Typography className="hero-date">
									Posted on <Moment format="DD MMM, YYYY HH:mm">{boardArticle?.createdAt}</Moment>
								</Typography>
							</>
						)}
					</Box>
					<Stack direction="row" spacing={1.5} className="hero-stats">
						<span>
							<VisibilityIcon /> {boardArticle?.articleViews ?? 0}
						</span>
						<span onClick={() => likeBoArticleHandler(user, boardArticle?._id)} className="like-pill">
							{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
							{boardArticle?.articleLikes ?? 0}
						</span>
					</Stack>
				</Stack>

				<Stack className="cd-content-card" spacing={2.5}>
					{isArticleLoading ? (
						<Skeleton variant="rounded" height={320} />
					) : (
						<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
					)}
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutBasic(CommunityDetail);
