import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface EventData {
	eventTitle: string;
	releaseWindow: string;
	tagline: string;
	highlight: string;
	imageSrc: string;
	status: string;
}
const eventsData: EventData[] = [
	{
		eventTitle: 'Aurora EV GT',
		releaseWindow: 'Q3 • 2025',
		tagline: 'Ultra-fast 800V charge with 600km range.',
		highlight: 'Tri-motor • Carbon aero pack',
		imageSrc: '/img/events/adrian-kusznirewicz-gzAjFlglIgw-unsplash.jpg',
		status: 'Preorder',
	},
	{
		eventTitle: 'Helix Roadster',
		releaseWindow: 'Summer • 2025',
		tagline: 'Removable glass canopy and adaptive air ride.',
		highlight: '3.1s 0-100 • AWD torque vectoring',
		imageSrc: '/img/events/adrian-kusznirewicz-ykcPHi6gJxI-unsplash.jpg',
		status: 'Concept',
	},
	{
		eventTitle: 'Nebula Coupe',
		releaseWindow: 'Early • 2026',
		tagline: 'Minimal cockpit with wraparound OLED dash.',
		highlight: 'Level 3 pilot • 520km range',
		imageSrc: '/img/events/j-z-HN-twVdZAdo-unsplash.jpg',
		status: 'Next',
	},
	{
		eventTitle: 'Vertex XR SUV',
		releaseWindow: 'Late • 2025',
		tagline: '7-seat luxury with 1,000km projected range.',
		highlight: 'Solar roof • Lounge rear seats',
		imageSrc: '/img/events/luke-miller-klMJ0U_9Bs8-unsplash.jpg',
		status: 'Teaser',
	},
];

const EventCard = ({ event }: { event: EventData }) => {
	const device = useDeviceDetect();

	return (
		<Stack
			className={`event-card ${device === 'mobile' ? 'mobile' : ''}`}
			style={{
				backgroundImage: `linear-gradient(180deg, rgba(6, 8, 20, 0.0) 0%, rgba(6, 8, 20, 0.75) 70%), url(${event?.imageSrc})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
			}}
		>
			<Box component={'div'} className={'card-top'}>
				<span className={'pill'}>{event?.status}</span>
				<span className={'pill ghost'}>{event?.releaseWindow}</span>
			</Box>
			<Box component={'div'} className={'card-bottom'}>
				<strong>{event?.eventTitle}</strong>
				<p>{event?.tagline}</p>
				<div className="meta">
					<span className="chip">{event?.highlight}</span>
					<div className="cta">
						<span>View drop</span>
						<img src="/img/icons/rightup.svg" alt="" />
					</div>
				</div>
			</Box>
		</Stack>
	);
};

const Events = () => {
	const device = useDeviceDetect();

	return (
		<Stack className={'events'}>
			<Box component={'div'} className={'glow glow-left'} />
			<Box component={'div'} className={'glow glow-right'} />
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span className={'white'}>Upcoming Launches</span>
						<p className={'white'}>Future rides we are watching closely—get in early.</p>
					</Box>
					{device !== 'mobile' && (
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<span>Notify me</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					)}
				</Stack>
				<Stack className={`card-wrapper ${device === 'mobile' ? 'mobile' : ''}`}>
					{eventsData.map((event: EventData) => {
						return <EventCard event={event} key={event?.eventTitle} />;
					})}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Events;
