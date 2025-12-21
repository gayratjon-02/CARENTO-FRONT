import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopAgentCard from './TopAgentCard';
import { Member } from '../../types/member/member';
import { AgentsInquiry } from '../../types/member/member.input';
import { useMutation, useQuery } from '@apollo/client';
import { GET_AGENTS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_MEMBER } from 'apollo/user/mutation';
import { Message } from 'libs/enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from 'libs/sweetAlert';

interface TopAgentsProps {
	
	initialInput: AgentsInquiry;
}

const TopAgents = (props: TopAgentsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topAgents, setTopAgents] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/

	const {
		loading: getAgentsLoading,
		data: getAgentsData,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopAgents(data?.getAgents?.list);
		},
	});

	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	/** HANDLERS **/

	const likeMemberHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// execute likeCarHandler Mutation
			await likeTargetMember({
				variables: { input: id },
			});

			// refresh agents to update like count/state
			await getAgentsRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR: likeCarHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'top-agents'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<div className={'eyebrow'}>Community Picks</div>
						<span>Top Agents</span>
						<p>Verified partners with quick response time.</p>
					</Stack>
					<Stack className={'wrapper'}>
						<Swiper
							className={'top-agents-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={18}
							modules={[Autoplay]}
						>
							{topAgents.map((agent: Member) => {
								return (
									<SwiperSlide className={'top-agents-slide'} key={agent?._id}>
										<TopAgentCard agent={agent} key={agent?.memberNick} likeMemberHandler={likeMemberHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-agents'}>
				<Box component={'div'} className={'halo halo-left'} />
				<Box component={'div'} className={'halo halo-right'} />
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<div className={'eyebrow'}>Trusted partners</div>
							<span>Top Agents</span>
							<p>Handpicked professionals ready to serve you any time.</p>
							<Box component={'div'} className={'stats'}>
								<div className={'stat'}>
									<strong>{topAgents?.length || 0}</strong>
									<small>verified experts</small>
								</div>
								<div className={'stat'}>
									<strong>24/7</strong>
									<small>support on call</small>
								</div>
							</Box>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<span>See All Agents</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						<Box component={'div'} className={'switch-btn swiper-agents-prev'}>
							<ArrowBackIosNewIcon />
						</Box>
						<Box component={'div'} className={'card-wrapper'}>
							<Swiper
								className={'top-agents-swiper'}
								slidesPerView={4}
								spaceBetween={32}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-agents-next',
									prevEl: '.swiper-agents-prev',
								}}
								breakpoints={{
									1200: { slidesPerView: 4, spaceBetween: 32 },
									992: { slidesPerView: 3, spaceBetween: 28 },
									768: { slidesPerView: 2, spaceBetween: 24 },
								}}
							>
								{topAgents.map((agent: Member) => {
									return (
										<SwiperSlide className={'top-agents-slide'} key={agent?._id}>
											<TopAgentCard agent={agent} key={agent?.memberNick}  likeMemberHandler={likeMemberHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						</Box>
						<Box component={'div'} className={'switch-btn swiper-agents-next'}>
							<ArrowBackIosNewIcon />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopAgents.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopAgents;
