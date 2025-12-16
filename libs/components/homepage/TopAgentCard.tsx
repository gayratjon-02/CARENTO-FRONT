import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import { useReactiveVar } from '@apollo/client';
import { userVar } from 'apollo/store';

interface TopAgentProps {
	agent: Member;
	likeMemberHandler: any;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { agent, likeMemberHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const isLiked = agent?.meLiked && agent?.meLiked[0]?.myFavorite;
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<div className="card-shell">
					<div className="card-header">
						<span className="pill">Featured</span>
						<span className="pill accent">Fast reply</span>
					</div>
					<div className="avatar">
						<div className="ring">
							<img src={agentImage} alt="" />
						</div>
					</div>
					<div className="card-body">
						<strong>{agent?.memberNick}</strong>
						<span>{agent?.memberType}</span>
						<div className="tags">
							<span className="tag">Verified</span>
							<span className="tag">Flexible hours</span>
						</div>
						<div className="meta">
							<div
								className={`meta-item like ${isLiked ? 'active' : ''}`}
								onClick={() => likeMemberHandler(user, agent?._id)}
								role="button"
							>
								<svg
									className="heart"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M12.62 20.88c-.37.19-.87.19-1.24 0C7.88 18.93 2 14.62 2 8.86 2 6 4.24 3.75 6.74 3.75c1.62 0 3.14.78 4.06 2.03a.75.75 0 0 0 1.2 0c.92-1.25 2.44-2.03 4.06-2.03 2.5 0 4.74 2.25 4.74 5.11 0 5.76-5.88 10.07-8.98 12.12Z"
										stroke="#111827"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<span>{agent?.memberLikes ?? 0}</span>
							</div>
							<div className="meta-item">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Z"
										stroke="#111827"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<circle cx="12" cy="12" r="3.5" stroke="#111827" strokeWidth="1.5" />
								</svg>
								<span>{agent?.memberViews ?? 0}</span>
							</div>
						</div>
					</div>
				</div>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card">
				<div className="card-shell">
					<div className="card-header">
						<span className="pill">Featured</span>
						<span className="pill accent">Fast reply</span>
					</div>
					<div className="avatar">
						<div className="ring">
							<img src={agentImage} alt="" />
						</div>
					</div>
					<div className="card-body">
						<strong>{agent?.memberNick}</strong>
						<span>{agent?.memberType}</span>
						<div className="tags">
							<span className="tag">Verified</span>
							<span className="tag">Flexible hours</span>
						</div>
						<div className="meta">
							<div
								className={`meta-item like ${isLiked ? 'active' : ''}`}
								onClick={() => likeMemberHandler(user, agent?._id)}
								role="button"
							>
								<svg
									className="heart"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M12.62 20.88c-.37.19-.87.19-1.24 0C7.88 18.93 2 14.62 2 8.86 2 6 4.24 3.75 6.74 3.75c1.62 0 3.14.78 4.06 2.03a.75.75 0 0 0 1.2 0c.92-1.25 2.44-2.03 4.06-2.03 2.5 0 4.74 2.25 4.74 5.11 0 5.76-5.88 10.07-8.98 12.12Z"
										stroke="#111827"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<span>{agent?.memberLikes ?? 0}</span>
							</div>
							<div className="meta-item">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Z"
										stroke="#111827"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<circle cx="12" cy="12" r="3.5" stroke="#111827" strokeWidth="1.5" />
								</svg>
								<span>{agent?.memberViews ?? 0}</span>
							</div>
						</div>
					</div>
				</div>
			</Stack>
		);
	}
};

export default TopAgentCard;
