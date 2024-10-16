'use client';

import React, {useEffect, useRef, useState} from 'react';

// Define the expected prop types for YouTubeAudioPlayer
interface YouTubeAudioPlayerProps {
    videoId: string;
}

const YouTubeAudioPlayer: React.FC<YouTubeAudioPlayerProps> = ({videoId}) => {
    const playerRef = useRef<HTMLDivElement>(null);
    const [player, setPlayer] = useState<YT.Player | null>(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [duration, setDuration] = useState(0); // Track the duration of the song
    const [currentTime, setCurrentTime] = useState(0); // Track the current playback time

    useEffect(() => {
        // Load the YouTube Iframe API dynamically
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag?.parentNode) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // Create a YouTube player when the API is ready
        window.onYouTubeIframeAPIReady = () => {
            if (playerRef.current) {
                const newPlayer = new window.YT.Player(playerRef.current, {
                    videoId,
                    events: {
                        onReady: () => {
                            setPlayer(newPlayer);
                            setIsPlayerReady(true);
                            // @ts-ignore
                            setDuration(newPlayer.getDuration()); // Set the duration when ready
                        },
                        onStateChange: (event: { data: any; }) => {
                            if (event.data === window.YT.PlayerState.PLAYING) {
                                // Start a timer to update current time when playing
                                const interval = setInterval(() => {
                                    if (newPlayer && newPlayer.getCurrentTime) {
                                        // @ts-ignore
                                        setCurrentTime(newPlayer.getCurrentTime());
                                    }
                                }, 1000);
                                return () => clearInterval(interval);
                            }
                        },
                        onError: (error: any) => {
                            console.error('Player error:', error);
                        },
                    },
                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                        modestbranding: 1,
                        playsinline: 1,
                    },
                });
            }
        };
    }, [videoId]);

    // Play the video
    const handlePlay = () => {
        if (player && isPlayerReady) {
            player.playVideo();
        }
    };

    // Pause the video
    const handlePause = () => {
        if (player && isPlayerReady) {
            player.pauseVideo();
        }
    };

    // Stop the video (seek to the beginning)
    const handleStop = () => {
        if (player && isPlayerReady) {
            player.pauseVideo();
            player.seekTo(0, true);
            setCurrentTime(0); // Reset the current time to 0
        }
    };

    // Back to start (seek to 0)
    const handleBackToStart = () => {
        if (player && isPlayerReady) {
            player.seekTo(0, true);
            setCurrentTime(0);
        }
    };

    // Handle slider change (seeking)
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(event.target.value);
        if (player && isPlayerReady) {
            player.seekTo(newTime, true);
            setCurrentTime(newTime);
        }
    };

    // Format the time as mm:ss
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="audio-player">
            {/* Hidden YouTube iframe */}
            <div style={{display: 'none'}}>
                <div ref={playerRef}></div>
            </div>

            {/* Display song duration and current time */}
            <div className="time-display flex items-center justify-between w-full mb-4">
                <span>{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSliderChange}
                    className="slider w-full mx-4"
                />
                <span>{formatTime(duration)}</span>
            </div>

            {/* Control Buttons */}
            <div className="controls flex space-x-4">
                <button onClick={handlePlay} className="bg-green-500 text-white px-4 py-2 rounded">
                    Play
                </button>
                <button onClick={handlePause} className="bg-yellow-500 text-white px-4 py-2 rounded">
                    Pause
                </button>
                <button onClick={handleStop} className="bg-red-500 text-white px-4 py-2 rounded">
                    Stop
                </button>
                <button onClick={handleBackToStart} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Back to Start
                </button>
            </div>
        </div>
    );
};

export {YouTubeAudioPlayer};
