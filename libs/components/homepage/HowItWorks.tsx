import { Stack } from '@mui/material';
import Image from 'next/image';

const STEPS = [
	{
		title: 'Choose a Location',
		desc: 'Select the ideal destination to begin your journey with ease',
		icon: '/img/icons/chooseLocation.png',
	},
	{
		title: 'Choose Your Vehicle',
		desc: 'Browse our fleet and find the perfect car for your needs',
		icon: '/img/icons/Vehicle.png',
	},
	{
		title: 'Verification',
		desc: 'Review your information and confirm your booking',
		icon: '/img/icons/Verification.png',
	},
	{
		title: 'Begin Your Journey',
		desc: 'Start your adventure with confidence and ease',
		icon: '/img/icons/Journey.png',
	},
];

const HowItWorks = () => {
	return (
		<Stack className="how-works">
			<Stack className="container">
				<Stack className="hw-heading">
					<span className="eyebrow">How It Works</span>
					<h3>
						Presenting Your New
						<br />
						Go-To Car Rental Experience
					</h3>
				</Stack>

				<Stack className="hw-steps">
					{STEPS.map((step) => (
						<Stack key={step.title} className="hw-step">
							<div className="icon-wrap">
								<Image src={step.icon} alt={step.title} width={60} height={60} />
							</div>
							<div className="step-title">{step.title}</div>
							<div className="step-desc">{step.desc}</div>
						</Stack>
					))}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default HowItWorks;
