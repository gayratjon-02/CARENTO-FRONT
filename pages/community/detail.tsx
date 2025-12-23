import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Avatar, Backdrop, Box, Button, Chip, IconButton, Pagination, Stack, TextField, Typography } from '@mui/material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import dynamic from 'next/dynamic';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import EditIcon from '@mui/icons-material/Edit';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { CREATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE, UPDATE_COMMENT } from '../../apollo/user/mutation';
import { GET_ARTICLES, GET_BOARD_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetMixinSuccessAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });
import { Article } from '../../libs/types/board-article/board-article';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;

	const articleId = query?.id as string;
	const articleCategory = query?.articleCategory as string;

	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
		...initialInput,
	});
	const [memberImage, setMemberImage] = useState<string>('/img/types/Sedan.jpeg');
	const [anchorEl, setAnchorEl] = useState<any | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const [boardArticle, setBoardArticle] = useState<BoardArticle>();
	const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	const {
		loading: boardArticleLoading,
		data: boardArticleData,
		error: getBoardArticleError,
		refetch: boardArticleRefetch,
	} = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
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

	useQuery(GET_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		skip: !articleCategory,
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: 'DESC',
				search: { articleCategory: articleCategory as BoardArticleCategory },
			},
		},
		onCompleted: (data: T) => {
			setRelatedArticles(data?.getArticles?.list || []);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: searchFilter,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setComments(data.getComments.list);
			setTotal(data.getComments?.metaCounter?.[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (articleId) setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
	}, [articleId]);

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

	const creteCommentHandler = async () => {
		if (!comment) return;
		try {
			if (!user?._id) throw new Error(Messages.error2);
			const commentInput: CommentInput = {
				commentGroup: CommentGroup.ARTICLE,
				commentRefId: articleId,
				commentContent: comment,
			};
			await createComment({
				variables: {
					input: commentInput,
				},
			});
			await getCommentsRefetch({ input: searchFilter });
			await boardArticleRefetch({ input: articleId });
			setComment('');
			await sweetMixinSuccessAlert('Successfully commented!');
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		}
	};
	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (!commentId) throw new Error('Select a comment to update!');
			if (updatedComment === comments?.find((comment) => comment?._id === commentId)?.commentContent) return;

			const updateData: CommentUpdate = {
				_id: commentId,
				...(commentStatus && { commentStatus: commentStatus }),
				...(updatedComment && { commentContent: updatedComment }),
			};

			if (!updateData?.commentContent && !updateData?.commentStatus)
				throw new Error('Provide data to update your comment!');

			if (commentStatus) {
				if (await sweetConfirmAlert('Do you want to delete the comment?')) {
					await updateComment({
						variables: {
							input: updateData,
						},
					});
					await sweetMixinSuccessAlert('Successfully deleted!');
				} else return;
			} else {
				await updateComment({
					variables: {
						input: updateData,
					},
				});
				await sweetMixinSuccessAlert('Successfully updated!');
			}
			await getCommentsRefetch({ input: searchFilter });
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		} finally {
			setOpenBackdrop(false);
			setUpdatedComment('');
			setUpdatedCommentWordsCnt(0);
			setUpdatedCommentId('');
		}
	};

	const getCommentMemberImage = (imageUrl: string | undefined) => {
		if (imageUrl) return `${process.env.REACT_APP_API_URL}/${imageUrl}`;
		else return '/img/community/articleImg.png';
	};

	const goMemberPage = (id: any) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') return <div>COMMUNITY DETAIL PAGE MOBILE</div>;

	return (
		<div id="community-detail-page">
			<div className="container">
				<Stack className="cd-hero" sx={{ backgroundImage: boardArticle?.articleImage ? `url(${process.env.REACT_APP_API_URL}/${boardArticle.articleImage})` : undefined }}>
					<Box className="hero-overlay" />
					<Stack spacing={1} className="hero-text">
						<Chip label={articleCategory || 'Board'} className="hero-chip" />
						<Typography className="hero-title">{boardArticle?.articleTitle || 'Article'}</Typography>
						<Typography className="hero-sub">
							{boardArticle?.articleContent?.slice(0, 140) || 'Stories, tips, and road moments from the community.'}
						</Typography>
						<Stack direction="row" spacing={1.5} alignItems="center" className="hero-meta">
							<Avatar src={memberImage} />
							<Box>
								<Typography className="hero-author">{boardArticle?.memberData?.memberNick || 'Member'}</Typography>
								<Typography className="hero-date">
									<Moment format="DD MMM, YYYY">{boardArticle?.createdAt}</Moment>
								</Typography>
							</Box>
							<Stack direction="row" spacing={1.5} className="hero-stats">
								<span>
									<VisibilityIcon /> {boardArticle?.articleViews ?? 0}
								</span>
								<span>
									{total > 0 ? <ChatIcon /> : <ChatBubbleOutlineRoundedIcon />} {total}
								</span>
								<span onClick={() => likeBoArticleHandler(user, boardArticle?._id)} className="like-pill">
									{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
										<ThumbUpAltIcon />
									) : (
										<ThumbUpOffAltIcon />
									)}
									{boardArticle?.articleLikes ?? 0}
								</span>
							</Stack>
						</Stack>
					</Stack>
				</Stack>

				<Stack className="cd-content-card" spacing={3}>
					<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
					<Box className="like-row">
						<Button variant="contained" onClick={() => likeBoArticleHandler(user, boardArticle?._id)}>
							{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
								<ThumbUpAltIcon sx={{ mr: 1 }} />
							) : (
								<ThumbUpOffAltIcon sx={{ mr: 1 }} />
							)}
							{boardArticle?.articleLikes ?? 0} Likes
						</Button>
						<Typography className="views-pill">
							<VisibilityIcon fontSize="small" /> {boardArticle?.articleViews ?? 0} views
						</Typography>
					</Box>
				</Stack>

				<Stack className="cd-comments" spacing={2.2}>
					<Stack direction="row" alignItems="center" justifyContent="space-between">
						<Typography className="section-title">Comments ({total})</Typography>
					</Stack>
					<Box className="comment-input">
						<TextField
							fullWidth
							placeholder="Share your thoughts..."
							value={comment}
							onChange={(e) => {
								if (e.target.value.length > 100) return;
								setWordsCnt(e.target.value.length);
								setComment(e.target.value);
							}}
							multiline
							minRows={2}
						/>
						<Box className="comment-actions">
							<Typography className="char-count">{wordsCnt}/100</Typography>
							<Button variant="contained" onClick={creteCommentHandler}>
								Post comment
							</Button>
						</Box>
					</Box>

					{comments?.length === 0 && (
						<Box className="empty-comments">
							<img src="/img/icons/icoAlert.svg" alt="" />
							<Typography className="empty-title">No comments yet</Typography>
							<Typography className="empty-desc">Start the conversation with your insight.</Typography>
						</Box>
					)}

					{comments?.map((commentData) => (
						<Box key={commentData?._id} className="comment-card">
							<Stack direction="row" spacing={1.5} alignItems="center">
								<Avatar src={getCommentMemberImage(commentData?.memberData?.memberImage)} />
								<Box sx={{ flex: 1 }}>
									<Typography className="comment-author" onClick={() => goMemberPage(commentData?.memberData?._id as string)}>
										{commentData?.memberData?.memberNick}
									</Typography>
									<Typography className="comment-date">
										<Moment format="DD MMM, YYYY HH:mm">{commentData?.createdAt}</Moment>
									</Typography>
								</Box>
								{commentData?.memberId === user?._id && (
									<Stack direction="row" spacing={0.5}>
										<IconButton
											onClick={() => {
												setUpdatedCommentId(commentData?._id);
												updateButtonHandler(commentData?._id, CommentStatus.DELETE);
											}}
										>
											<DeleteForeverIcon sx={{ color: '#d14343' }} />
										</IconButton>
										<IconButton
											onClick={() => {
												setUpdatedComment(commentData?.commentContent);
												setUpdatedCommentWordsCnt(commentData?.commentContent?.length || 0);
												setUpdatedCommentId(commentData?._id);
												setOpenBackdrop(true);
											}}
										>
											<EditIcon sx={{ color: '#475569' }} />
										</IconButton>
									</Stack>
								)}
							</Stack>
							<Typography className="comment-text">{commentData?.commentContent}</Typography>
						</Box>
					))}

					{total > 0 && (
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(total / searchFilter.limit) || 1}
								page={searchFilter.page}
								shape="rounded"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
					)}
				</Stack>

				<Backdrop
					sx={{
						top: '10%',
						left: 0,
						right: 0,
						width: '100%',
						height: '100%',
						color: '#ffffff',
						zIndex: 999,
					}}
					open={openBackdrop}
				>
					<Box className="edit-dialog">
						<Typography variant="h5" className="edit-title">
							Update comment
						</Typography>
						<TextField
							fullWidth
							value={updatedComment}
							onChange={(e) => updateCommentInputHandler(e.target.value)}
							autoFocus
						/>
						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Typography className="char-count">{updatedCommentWordsCnt}/100</Typography>
							<Stack direction="row" spacing={1}>
								<Button variant="outlined" onClick={() => setOpenBackdrop(false)}>
									Cancel
								</Button>
								<Button variant="contained" onClick={() => updateButtonHandler(updatedCommentId, undefined)}>
									Update
								</Button>
							</Stack>
						</Stack>
					</Box>
				</Backdrop>
			</div>
		</div>
	);
};
CommunityDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(CommunityDetail);
