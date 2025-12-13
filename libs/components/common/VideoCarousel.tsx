import React, { useEffect, useRef, useState } from 'react';

const VideoCarousel = () => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
	const videos = ['/video/video1.mp4', '/video/video2.mp4', '/video/video3.mp4'];

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const handleVideoEnd = () => {
			// Current video tugaganda keyingi videoga o'tish
			setCurrentVideoIndex((prevIndex) => {
				const nextIndex = (prevIndex + 1) % videos.length;
				return nextIndex;
			});
		};

		video.addEventListener('ended', handleVideoEnd);
		
		// Video src ni o'zgartirish
		video.src = videos[currentVideoIndex];
		video.load();
		video.play().catch((error) => {
			console.log('Video autoplay error:', error);
		});

		return () => {
			video.removeEventListener('ended', handleVideoEnd);
		};
	}, [currentVideoIndex, videos]);

	return (
		<video
			ref={videoRef}
			className="header-video"
			autoPlay
			muted
			playsInline
			loop={false}
		>
			Your browser does not support the video tag.
		</video>
	);
};

export default VideoCarousel;

