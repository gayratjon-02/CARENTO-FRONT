import { Stack, Button } from '@mui/material';
import { useRef, useState, useCallback } from 'react';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';

const CHECKPOINTS = [
	'Expert Certified Mechanics',
	'Get Reasonable Price',
	'Genuine Spares Parts',
	'First Class Services',
	'24/7 road assistance',
	'Free Pick-Up & Drop-Off',
];

const InfoRent: NextPage = () => {
	const { t } = useTranslation('common');
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);

	const toggleVideo = useCallback(() => {
		const video = videoRef.current;
		if (!video) return;
		if (video.paused) {
			video.play();
			setIsPlaying(true);
		} else {
			video.pause();
			setIsPlaying(false);
		}
	}, []);

	return (
		<Stack className={'info-rent'}>
			<Stack className={'container'}>
				<Stack className={'visual'}>
					<div className="visual-glow" />
					<div className="visual-card">
						<video
							className="info-video"
							src="/video/InfoRent.mp4"
							playsInline
							preload="metadata"
							ref={videoRef}
							onPause={() => setIsPlaying(false)}
							onPlay={() => setIsPlaying(true)}
						/>
						<Button className="play-btn" variant="contained" color="success" onClick={toggleVideo}>
							{isPlaying ? <PauseRoundedIcon fontSize="large" /> : <PlayArrowRoundedIcon fontSize="large" />}
						</Button>
					</div>
				</Stack>
				<Stack className={'content'}>
					<div className="badge">{t('Best Car Rental System', { defaultValue: 'Best Car Rental System' })}</div>
					<h3>
						{t('Receive a Competitive Offer', { defaultValue: 'Receive a Competitive Offer' })}
						<br />
						{t('Sell Your Car to Us Today.', { defaultValue: 'Sell Your Car to Us Today.' })}
					</h3>
					<p>
						{t(
							'We are committed to delivering exceptional service, competitive pricing, and a diverse selection of options for our customers.',
							{
								defaultValue:
									'We are committed to delivering exceptional service, competitive pricing, and a diverse selection of options for our customers.',
							},
						)}
					</p>
					<Stack className="checks">
						{CHECKPOINTS.map((item) => (
							<div key={item} className="check-item">
								<CheckCircleRoundedIcon />
								<span>{t(item, { defaultValue: item })}</span>
							</div>
						))}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default InfoRent;
