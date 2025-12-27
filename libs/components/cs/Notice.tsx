import React from 'react';
import { Stack, Box, Chip, Typography, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Notice = () => {
	const device = useDeviceDetect();

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	const data = [
		{
			no: 1201,
			type: 'Maintenance',
			title: 'Seoul hub vehicle detailing schedule (Jun 12, 02:00–04:00)',
			date: '2025-06-08',
			tag: 'Fleet',
		},
		{
			no: 1198,
			type: 'Promo',
			title: 'Summer drive: 10% off EV rentals for trips over 3 days',
			date: '2025-06-02',
			tag: 'Offers',
		},
		{
			no: 1189,
			type: 'Policy',
			title: 'Updated insurance coverage for cross-border rentals (KR→JP)',
			date: '2025-05-28',
			tag: 'Policy',
		},
		{
			no: 1185,
			type: 'System',
			title: 'Payment gateway upgrade: brief downtime Jun 15, 01:30–01:45',
			date: '2025-05-20',
			tag: 'System',
		},
	];

	if (device === 'mobile') {
		return (
			<Stack spacing={2} className="notice-content mobile">
				<Typography variant="h6" fontWeight={800}>
					Notices
				</Typography>
				{data.map((item) => (
					<Box key={item.no} className="notice-card">
						<div className="notice-card__header">
							<Chip label={item.tag || item.type} size="small" color="primary" variant="outlined" />
							<span className="date">{item.date}</span>
						</div>
						<div className="title">{item.title}</div>
					</Box>
				))}
			</Stack>
		);
	} else {
		return (
			<Stack className={'notice-content'}>
				<div className="notice-head">
					<div>
						<p className="eyebrow">Platform updates</p>
						<h3>Carento notices</h3>
						<p className="muted">Texnik xizmat, aksiyalar va ijaraga oid muhim xabarlar.</p>
					</div>
					<Button variant="outlined" size="small">
						View all
					</Button>
				</div>

				<Stack className={'notice-grid'}>
					{data.map((item) => (
						<Box component={'div'} className={'notice-card'} key={item.no}>
							<div className="notice-top">
								<Chip label={item.tag || item.type} size="small" color="primary" variant="outlined" />
								<span className="date">{item.date}</span>
							</div>
							<div className="notice-title">{item.title}</div>
							<div className="notice-meta">
								<span className="pill">{item.type}</span>
								<span className="pill muted">#{item.no}</span>
							</div>
						</Box>
					))}
				</Stack>
			</Stack>
		);
	}
};

export default Notice;
