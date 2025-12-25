import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ButtonBase, Stack } from '@mui/material';
import { Member } from '../../types/member/member';
import { useReactiveVar } from '@apollo/client';
import { userVar } from 'apollo/store';
import { REACT_APP_API_URL } from '../../config';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

interface TopAgentProps {
	agent: Member;
	likeMemberHandler: any;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { agent, likeMemberHandler } = props;
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const agentId = agent?._id ? String(agent._id) : '';

	const agentImage = agent?.memberImage ? `${REACT_APP_API_URL}/${agent.memberImage}` : '/img/profile/defaultUser.svg';

	const isLikedFromApi = useMemo(() => {
		const anyAgent = agent as any;
		if (Array.isArray(anyAgent?.meLiked) && anyAgent.meLiked.length > 0) {
			return Boolean(anyAgent.meLiked[0]?.myFavorite);
		}
		return Boolean(anyAgent?.isLiked ?? anyAgent?.liked ?? anyAgent?.isFavorite ?? false);
	}, [agent]);

	const [liked, setLiked] = useState<boolean>(isLikedFromApi);
	const [likesCount, setLikesCount] = useState<number>(Number((agent as any)?.memberLikes ?? 0));

	useEffect(() => {
		setLiked(isLikedFromApi);
	}, [isLikedFromApi]);

	useEffect(() => {
		setLikesCount(Number((agent as any)?.memberLikes ?? 0));
	}, [agent]);

	const viewsCount = Number((agent as any)?.memberViews ?? 0);
	const ratingValue = Number((agent as any)?.memberRank ?? 0);

	/** HANDLERS **/
	const openAgentDetail = () => {
		if (!agentId) return;
		router.push({ pathname: '/dealers/detail', query: { agentId } });
	};

	const handleLikeClick = async (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		e.preventDefault();
		if (!agentId) return;

		const prevLiked = liked;
		const nextLiked = !prevLiked;
		setLiked(nextLiked);
		setLikesCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));

		try {
			await likeMemberHandler(user, agentId);
		} catch (err) {
			setLiked(prevLiked);
			setLikesCount((prev) => Math.max(0, prev + (prevLiked ? 1 : -1)));
		}
	};

	return (
		<Stack className="top-agent-card" onClick={openAgentDetail}>
			<div className="card-shell">
				<div className="card-header">
					<div className="header-left">
						<span className="pill">Featured</span>
						<span className="pill accent">Fast reply</span>
					</div>
					<ButtonBase className={`like-pill ${liked ? 'active' : ''}`} onClick={handleLikeClick}>
						{liked ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
						<span>{likesCount}</span>
					</ButtonBase>
				</div>
				<div className="avatar">
					<div className="ring">
						<img src={agentImage} alt="" />
					</div>
				</div>
				<div className="card-body">
					<strong>{agent?.memberNick}</strong>
					<span>Agent</span>
					<div className="tags">
						<span className="tag">Verified</span>
						<span className="tag">Flexible hours</span>
					</div>
				</div>
				<div className="card-footer">
					<div className="footer-item">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Z"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
						</svg>
						<span>{viewsCount.toLocaleString()}</span>
					</div>
					<div className="footer-item">
						<StarRoundedIcon />
						<span>{ratingValue ? ratingValue.toFixed(1) : '0.0'}</span>
					</div>
				</div>
			</div>
		</Stack>
	);
};

export default TopAgentCard;
