import React, { useEffect, useRef, useState } from 'react';

const VideoCarousel = () => {
	const videos = ['/video/video1.mp4', '/video/video2.mp4', '/video/video3.mp4'];
	const [currentIndex, setCurrentIndex] = useState(0);
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const handleEnded = () => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
		};

		video.addEventListener('ended', handleEnded);
		video.load();
		video.play().catch((error) => {
			console.error('Video autoplay failed:', error);
		});

		return () => {
			video.removeEventListener('ended', handleEnded);
		};
	}, [currentIndex, videos.length]);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		video.play().catch((error) => {
			console.error('Video autoplay failed:', error);
		});
	}, [currentIndex]);

	return (
		<video
			ref={videoRef}
			key={currentIndex}
			src={videos[currentIndex]}
			autoPlay
			muted
			loop={false}
			playsInline
			className="header-video"
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				objectFit: 'cover',
				zIndex: 0,
			}}
		/>
	);
};

export default VideoCarousel;

