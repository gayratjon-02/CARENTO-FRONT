import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ReviewCard from '../../libs/components/agent/ReviewCard';
import { Box, Button, Pagination, Stack, Tabs, Tab, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Car } from '../../libs/types/property/cars';
import { Member } from '../../libs/types/member/member';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CREATE_COMMENT, LIKE_TARGET_CAR } from '../../apollo/user/mutation';
import { GET_CARS, GET_COMMENTS, GET_MEMBER } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import DealerCarCard from '../../libs/components/dealers/DealerCarCard';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const DealerDetail: NextPage = ({ initialInput, initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [agentId, setAgentId] = useState<string | null>(null);
	const [agent, setAgent] = useState<Member | null>(null);
	const [searchFilter, setSearchFilter] = useState<any>(initialInput);
	const [dealerCars, setDealerCars] = useState<Car[]>([]);
	const [carTotal, setCarTotal] = useState<number>(0);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [agentComments, setAgentComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [activeTab, setActiveTab] = useState<'cars' | 'reviews'>('cars');
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});
	const carsTotal = useMemo(() => Number((agent as any)?.memberCars ?? agent?.memberProperties ?? 0), [agent]);

	/** APOLLO REQUESTS **/
	const [createComment] = useMutation(CREATE_COMMENT);
	const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: agentId },
		skip: !agentId,
		onCompleted: (data: T) => {
			setAgent(data?.getMember);
			setSearchFilter((prev) => ({ ...prev, search: { ...prev.search, memberId: data?.getMember?._id } }));
			setCommentInquiry((prev) => ({ ...prev, search: { ...prev.search, commentRefId: data?.getMember?._id } }));
			setInsertCommentData((prev) => ({ ...prev, commentRefId: data?.getMember?._id }));
		},
	});

	const {
		loading: getCarsLoading,
		data: getCarsData,
		error: getCarsError,
		refetch: getCarsRefetch,
	} = useQuery(GET_CARS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setDealerCars(data?.getCars?.list ?? []);
			setCarTotal(data?.getCars?.metaCounter?.[0]?.total ?? 0);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.agentId) setAgentId(router.query.agentId as string);
	}, [router]);

	useEffect(() => {}, [searchFilter]);
	useEffect(() => {}, [commentInquiry]);

	/** HANDLERS **/
	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	const carPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		const next = { ...searchFilter, page: value };
		setSearchFilter(next);

		const refetchRes = await getCarsRefetch({ input: next });
		if (refetchRes?.data?.getCars) {
			setDealerCars(refetchRes.data.getCars.list ?? []);
			setCarTotal(refetchRes.data.getCars.metaCounter?.[0]?.total ?? 0);
		}
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		const next = { ...commentInquiry, page: value };
		setCommentInquiry(next);

		const refetchRes = await getCommentsRefetch({ input: next });
		if (refetchRes?.data?.getComments) {
			setAgentComments(refetchRes.data.getComments.list ?? []);
			setCommentTotal(refetchRes.data.getComments.metaCounter?.[0]?.total ?? 0);
		}
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			if (user._id === agentId) throw new Error('Cannot write a rewiew for yourself');
			await createComment({
				variables: {
					input: insertCommentData,
				},
			});

			setInsertCommentData({ ...insertCommentData, commentContent: '' });

			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const likeCarHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetCar({
				variables: {
					input: id,
				},
			});
			await getCarsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeCarHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'dealer-detail-page mobile'}>
				<Stack className={'container'}>
					<Stack className="dealer-hero">
						<Box className="dealer-hero__avatar">
							<img
								src={agent?.memberImage ? `${REACT_APP_API_URL}/${agent?.memberImage}` : '/img/profile/defaultUser.svg'}
								alt=""
							/>
						</Box>
						<Box className="dealer-hero__meta">
							<Typography className="dealer-hero__name">{agent?.memberFullName ?? agent?.memberNick}</Typography>
							<Typography className="dealer-hero__role">Dealer</Typography>
							{agent?.memberPhone && (
								<Typography className="dealer-hero__phone">
									<img src="/img/icons/call.svg" alt="" />
									<span>{agent.memberPhone}</span>
								</Typography>
							)}
						</Box>
						<Box className="dealer-hero__stats">
							<div className="stat">
								<strong>{carsTotal.toLocaleString()}</strong>
								<span>Cars</span>
							</div>
							<div className="stat">
								<strong>{Number(agent?.memberLikes ?? 0).toLocaleString()}</strong>
								<span>Likes</span>
							</div>
							<div className="stat">
								<strong>{Number(agent?.memberViews ?? 0).toLocaleString()}</strong>
								<span>Views</span>
							</div>
						</Box>
					</Stack>

					<Stack className="dealer-panels">
						<Box className="dealer-tabs">
							<Tabs
								value={activeTab}
								onChange={(_, v) => setActiveTab(v)}
								variant="fullWidth"
								textColor="primary"
								indicatorColor="primary"
							>
								<Tab value="cars" label={`Cars (${carTotal ?? 0})`} />
								<Tab value="reviews" label={`Reviews (${commentTotal ?? 0})`} />
							</Tabs>
						</Box>

						{activeTab === 'cars' && (
							<Stack className="dealer-panel">
								<Stack className={'card-wrap'}>
									{dealerCars.map((car: Car) => (
										<DealerCarCard car={car} likeCarHandler={likeCarHandler} key={car?._id} />
									))}
								</Stack>
								<Stack className={'pagination'}>
									{carTotal ? (
										<>
											<Stack className="pagination-box">
												<Pagination
													page={searchFilter.page}
													count={Math.ceil(carTotal / searchFilter.limit) || 1}
													onChange={carPaginationChangeHandler}
													shape="circular"
													color="primary"
												/>
											</Stack>
											<span>Total {carTotal.toLocaleString()} cars available</span>
										</>
									) : (
										<div className={'no-data'}>
											<img src="/img/icons/icoAlert.svg" alt="" />
											<p>No cars found!</p>
										</div>
									)}
								</Stack>
							</Stack>
						)}

						{activeTab === 'reviews' && (
							<Stack className="dealer-panel">
								<Stack className={'main-intro'}>
									<span>Reviews</span>
									<p>Share your experience with this dealer</p>
								</Stack>

								{commentTotal !== 0 && (
									<Stack className={'review-wrap'}>
										<Box component={'div'} className={'title-box'}>
											<StarIcon />
											<span>
												{commentTotal} review{commentTotal > 1 ? 's' : ''}
											</span>
										</Box>
										{agentComments?.map((comment: Comment) => {
											return <ReviewCard comment={comment} key={comment?._id} />;
										})}
										<Box component={'div'} className={'pagination-box'}>
											<Pagination
												page={commentInquiry.page}
												count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
												onChange={commentPaginationChangeHandler}
												shape="circular"
												color="primary"
											/>
										</Box>
									</Stack>
								)}

								<Stack className={'leave-review-config'}>
									<Typography className={'main-title'}>Leave A Review</Typography>
									<Typography className={'review-title'}>Review</Typography>
									<textarea
										onChange={({ target: { value } }: any) => {
											setInsertCommentData({ ...insertCommentData, commentContent: value });
										}}
										value={insertCommentData.commentContent}
									></textarea>
									<Box className={'submit-btn'} component={'div'}>
										<Button
											className={'submit-review'}
											disabled={insertCommentData.commentContent === '' || user?._id === ''}
											onClick={createCommentHandler}
										>
											<Typography className={'title'}>Submit Review</Typography>
										</Button>
									</Box>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'dealer-detail-page'}>
				<Stack className={'container'}>
					<Stack className="dealer-detail-grid">
						<Stack className="dealer-profile-card">
							<Box className="profile-top">
								<img
									src={
										agent?.memberImage ? `${REACT_APP_API_URL}/${agent?.memberImage}` : '/img/profile/defaultUser.svg'
									}
									alt=""
								/>
								<Box
									className="profile-meta"
									onClick={() => redirectToMemberPageHandler(agent?._id as string)}
									role="button"
								>
									<strong>{agent?.memberFullName ?? agent?.memberNick}</strong>
									<span className="role">Dealer</span>
									{agent?.memberAddress ? (
										<span className="sub">{agent.memberAddress}</span>
									) : (
										<span className="sub muted">Unknown location</span>
									)}
								</Box>
							</Box>

							{agent?.memberPhone && (
								<Box className="profile-actions">
									<Button className="primary" href={`tel:${agent.memberPhone}`}>
										Call
									</Button>
									<Button className="ghost" href={`tel:${agent.memberPhone}`}>
										Save
									</Button>
								</Box>
							)}

							<Box className="quick-stats">
								<div className="stat">
									<strong>{carsTotal.toLocaleString()}</strong>
									<span>Cars</span>
								</div>
								<div className="stat">
									<strong>{Number(agent?.memberLikes ?? 0).toLocaleString()}</strong>
									<span>Likes</span>
								</div>
								<div className="stat">
									<strong>{Number(agent?.memberViews ?? 0).toLocaleString()}</strong>
									<span>Views</span>
								</div>
							</Box>
						</Stack>

						<Stack className="dealer-content">
							<Stack className="dealer-panels">
								<Box className="dealer-tabs">
							<Tabs
								value={activeTab}
								onChange={(_, v) => setActiveTab(v)}
								variant="fullWidth"
								textColor="primary"
								indicatorColor="primary"
							>
								<Tab value="cars" label={`Cars (${carTotal ?? 0})`} />
								<Tab value="reviews" label={`Reviews (${commentTotal ?? 0})`} />
							</Tabs>
						</Box>

								{activeTab === 'cars' && (
									<Stack className="dealer-panel">
										<Box className="panel-head">
											<Typography className="panel-title">Cars</Typography>
											<Typography className="panel-sub">
												{carTotal ? `${carTotal.toLocaleString()} available` : 'No cars found'}
											</Typography>
										</Box>

										<Stack className={'card-wrap'}>
											{dealerCars.map((car: Car) => (
												<DealerCarCard car={car} likeCarHandler={likeCarHandler} key={car?._id} />
											))}
										</Stack>

										<Stack className={'pagination'}>
											{carTotal ? (
												<>
													<Stack className="pagination-box">
														<Pagination
															page={searchFilter.page}
															count={Math.ceil(carTotal / searchFilter.limit) || 1}
															onChange={carPaginationChangeHandler}
															shape="circular"
															color="primary"
														/>
													</Stack>
													<span>Total {carTotal.toLocaleString()} cars available</span>
												</>
											) : (
												<div className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No cars found!</p>
												</div>
											)}
										</Stack>
									</Stack>
								)}

								{activeTab === 'reviews' && (
									<Stack className="dealer-panel">
										<Stack className={'main-intro'}>
											<span>Reviews</span>
											<p>Share your experience with this dealer</p>
										</Stack>

										{commentTotal !== 0 && (
											<Stack className={'review-wrap'}>
												<Box component={'div'} className={'title-box'}>
													<StarIcon />
													<span>
														{commentTotal} review{commentTotal > 1 ? 's' : ''}
													</span>
												</Box>
												{agentComments?.map((comment: Comment) => {
													return <ReviewCard comment={comment} key={comment?._id} />;
												})}
												<Box component={'div'} className={'pagination-box'}>
													<Pagination
														page={commentInquiry.page}
														count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
														onChange={commentPaginationChangeHandler}
														shape="circular"
														color="primary"
													/>
												</Box>
											</Stack>
										)}

										<Stack className={'leave-review-config'}>
											<Typography className={'main-title'}>Leave A Review</Typography>
											<Typography className={'review-title'}>Review</Typography>
											<textarea
												onChange={({ target: { value } }: any) => {
													setInsertCommentData({ ...insertCommentData, commentContent: value });
												}}
												value={insertCommentData.commentContent}
											></textarea>
											<Box className={'submit-btn'} component={'div'}>
												<Button
													className={'submit-review'}
													disabled={insertCommentData.commentContent === '' || user?._id === ''}
													onClick={createCommentHandler}
												>
													<Typography className={'title'}>Submit Review</Typography>
												</Button>
											</Box>
										</Stack>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

DealerDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			memberId: '',
		},
	},
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(DealerDetail);
