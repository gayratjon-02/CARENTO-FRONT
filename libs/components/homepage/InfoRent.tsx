import { Stack, Button } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { NextPage } from 'next';

const CHECKPOINTS = [
	'Expert Certified Mechanics',
	'Get Reasonable Price',
	'Genuine Spares Parts',
	'First Class Services',
	'24/7 road assistance',
	'Free Pick-Up & Drop-Off',
];

const InfoRent: NextPage = () => {
	return (
		<Stack className={'info-rent'}>
			<Stack className={'container'}>
				<Stack className={'visual'}>
					<div className="visual-glow" />
					<div className="visual-card">
						<video className="info-video" src="/video/InfoRent.mp4" controls playsInline preload="metadata" />
						<Button className="play-btn" variant="contained" color="success">
							<PlayArrowRoundedIcon fontSize="large" />
						</Button>
					</div>
				</Stack>
				<Stack className={'content'}>
					<div className="badge">Best Car Rental System</div>
					<h3>
						Receive a Competitive Offer
						<br />
						Sell Your Car to Us Today.
					</h3>
					<p>
						We are committed to delivering exceptional service, competitive pricing, and a diverse selection of options for
						our customers.
					</p>
					<Stack className="checks">
						{CHECKPOINTS.map((item) => (
							<div key={item} className="check-item">
								<CheckCircleRoundedIcon />
								<span>{item}</span>
							</div>
						))}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default InfoRent;
