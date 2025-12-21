import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, ButtonBase, Stack } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from 'apollo/store';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';

interface DealerCardProps {
	dealer: Member;
	likeMemberHandler: (id: string) => Promise<void> | void;
}

const DealerCard = (props: DealerCardProps) => {
	const { dealer, likeMemberHandler } = props;
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const dealerId = dealer?._id ? String(dealer._id) : '';
	const imageUrl = dealer?.memberImage ? `${REACT_APP_API_URL}/${dealer.memberImage}` : '/img/profile/defaultUser.svg';
	const isSelf = Boolean(user?._id && dealerId && String(user._id) === String(dealerId));
	const selfLikeStorageKey = useMemo(() => `carento:self-like:member:${dealerId}`, [dealerId]);

	const isLikedFromApi = useMemo(() => {
		const anyDealer = dealer as any;
		if (Array.isArray(anyDealer?.meLiked) && anyDealer.meLiked.length > 0) {
			return Boolean(anyDealer.meLiked[0]?.myFavorite);
		}
		return Boolean(anyDealer?.isLiked ?? anyDealer?.liked ?? anyDealer?.isFavorite ?? false);
	}, [dealer]);

	const [selfLiked, setSelfLiked] = useState<boolean>(false);
	const derivedLiked = isSelf ? selfLiked : isLikedFromApi;

	const [liked, setLiked] = useState<boolean>(derivedLiked);
	const [likesCount, setLikesCount] = useState<number>(Number((dealer as any)?.memberLikes ?? 0));

	useEffect(() => {
		if (!isSelf) return;
		if (typeof window === 'undefined') return;
		const stored = window.localStorage.getItem(selfLikeStorageKey);
		setSelfLiked(stored === '1');
	}, [isSelf, selfLikeStorageKey]);

	useEffect(() => {
		setLiked(derivedLiked);
	}, [derivedLiked]);

	useEffect(() => {
		const apiLikes = Number((dealer as any)?.memberLikes ?? 0);
		if (isSelf && selfLiked && !isLikedFromApi) {
			setLikesCount(apiLikes + 1);
			return;
		}
		setLikesCount(apiLikes);
	}, [dealer, isSelf, selfLiked, isLikedFromApi]);

	const viewsCount = Number(dealer?.memberViews ?? 0);
	const rankValue = Number(dealer?.memberRank ?? 0);
	const carsCount = Number((dealer as any)?.memberCars ?? dealer?.memberProperties ?? 0);
	const phoneValue = dealer?.memberPhone ? String(dealer.memberPhone) : '';
	const addressValue = dealer?.memberAddress ? String(dealer.memberAddress) : '';

	const handleOpenDetail = () => {
		if (!dealerId) return;
		router.push({ pathname: '/dealers/detail', query: { agentId: dealerId } });
	};

	const handleLikeClick = async (e: MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		if (!dealerId) return;

		const prevLiked = liked;
		const prevLikes = likesCount;
		const nextLiked = !prevLiked;
		setLiked(nextLiked);
		setLikesCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));
		if (isSelf && typeof window !== 'undefined') {
			setSelfLiked(nextLiked);
			window.localStorage.setItem(selfLikeStorageKey, nextLiked ? '1' : '0');
			// Backend typically rejects self-like toggle; keep self-like purely client-side.
			return;
		}

		try {
			await likeMemberHandler(dealerId);
		} catch (err) {
			setLiked(prevLiked);
			setLikesCount(prevLikes);
		}
	};

	return (
		<Stack className="dealer-card" onClick={handleOpenDetail} role="button">
			<Box className="dealer-card__inner">
				<Box className="dealer-card__top">
					<Box className="dealer-avatar">
						<img src={imageUrl} alt="" />
					</Box>

					<Box className="dealer-head">
						<Box className="dealer-name-row">
							<strong className="dealer-name">{dealer?.memberFullName ?? dealer?.memberNick}</strong>
							<span className="dealer-role">Dealer</span>
						</Box>

						{addressValue ? (
							<Box className="dealer-subrow">
								<LocationOnOutlinedIcon />
								<span>{addressValue}</span>
							</Box>
						) : (
							<Box className="dealer-subrow muted">
								<LocationOnOutlinedIcon />
								<span>Unknown location</span>
							</Box>
						)}

						{phoneValue && (
							<Box className="dealer-subrow">
								<CallOutlinedIcon />
								<span>{phoneValue}</span>
							</Box>
						)}
					</Box>

					<ButtonBase
						className={`dealer-like ${liked ? 'liked' : ''}`}
						onClick={handleLikeClick}
						aria-label="Like dealer"
					>
						{liked ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
					</ButtonBase>
				</Box>

				<Box className="dealer-stats-grid">
					<Box className="dealer-stat">
						<DirectionsCarOutlinedIcon />
						<div>
							<strong>{carsCount.toLocaleString()}</strong>
							<span>Cars</span>
						</div>
					</Box>
					<Box className="dealer-stat">
						<VisibilityOutlinedIcon />
						<div>
							<strong>{viewsCount.toLocaleString()}</strong>
							<span>Views</span>
						</div>
					</Box>
					<Box className="dealer-stat">
						{liked ? (
							<FavoriteRoundedIcon className="heart" />
						) : (
							<FavoriteBorderRoundedIcon className="heart-outline" />
						)}
						<div>
							<strong>{likesCount.toLocaleString()}</strong>
							<span>Likes</span>
						</div>
					</Box>
					<Box className="dealer-stat">
						<StarRoundedIcon />
						<div>
							<strong>{rankValue ? rankValue.toFixed(1) : '0.0'}</strong>
							<span>Rating</span>
						</div>
					</Box>
				</Box>
			</Box>
		</Stack>
	);
};

export default DealerCard;
