'use client';

import React, {useEffect, useRef, useState} from 'react';
import {PlayIcon, PauseIcon, BackwardIcon} from '@heroicons/react/20/solid';

// Define the expected prop types for YouTubeAudioPlayer
interface YouTubeAudioPlayerProps {
    videoId: string;
    songName: string;
    onPlayingChange: (isPlaying: boolean) => void; // Callback to notify parent
}

const YouTubeAudioPlayer: React.FC<YouTubeAudioPlayerProps> = ({videoId, songName, onPlayingChange}) => {
    const playerRef = useRef<HTMLDivElement>(null);
    const [player, setPlayer] = useState<YT.Player | null>(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
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
                            const _isPlaying = event.data === window.YT.PlayerState.PLAYING;
                            setIsPlaying(_isPlaying);
                            if (_isPlaying) {
                                onPlayingChange(true); // Video is playing
                                // Start a timer to update current time when playing
                                const interval = setInterval(() => {
                                    if (newPlayer && newPlayer.getCurrentTime) {
                                        // @ts-ignore
                                        setCurrentTime(newPlayer.getCurrentTime());
                                    }
                                }, 1000);
                                return () => clearInterval(interval);
                            } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                                onPlayingChange(false); // Video is paused or ended
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
        <div className="audio-player w-full flex flex-col p-0 m-0 h-[80px]">
        {/* Hidden YouTube iframe */}
            <div style={{display: 'none'}}>
                <div ref={playerRef}></div>
            </div>

            <div className="relative w-full group">
                {/* Background track (thin when not hovered) */}
                <div
                    className="absolute top-1/2 left-0 w-full h-[3px] bg-gray-300 rounded-full
                   transition-all duration-200 group-hover:h-[6px]"
                    style={{ transform: "translateY(-50%)" }}
                ></div>

                {/* Progress bar (hidden initially, thickens on hover) */}
                <div
                    className="absolute top-1/2 left-0 bg-gray-500 rounded-full
                   transition-all duration-200 group-hover:h-[6px]"
                    style={{
                        width: `${(currentTime / duration) * 100}%`,
                        transform: "translateY(-50%)",
                        height: "3px", // Default height
                    }}
                ></div>

                {/* Range input (thumb is only visible on hover) */}
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSliderChange}
                    className="w-full h-[3px] appearance-none bg-transparent absolute top-1/2 left-0 z-10
                   transition-all duration-200 group-hover:h-[6px]
                   [&::-webkit-slider-runnable-track]:bg-transparent
                   [&::-moz-range-track]:bg-transparent

                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
                   [&::-webkit-slider-thumb]:border-gray-500 [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100
                   [&::-webkit-slider-thumb]:transition-opacity

                   [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4
                   [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2
                   [&::-moz-range-thumb]:border-gray-500 [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:opacity-0 group-hover:[&::-moz-range-thumb]:opacity-100
                   [&::-moz-range-thumb]:transition-opacity"
                    style={{ transform: "translateY(-50%)" }}
                />
            </div>





            {/* Display song duration and current time */}
            <div className="time-display flex items-center justify-between w-full h-full">
                <span>{formatTime(currentTime)}</span>
                <div className="flex items-center gap-2">
                    {/* Control Buttons */}
                    <div className="controls flex space-x-4">
                        {!isPlaying ? (
                            <button onClick={handlePlay} className="bg-gray-100 p-2 rounded-full">
                                <PlayIcon className="h-6 w-6 text-black" />
                            </button>
                        ) : (
                            <button onClick={handlePause} className="bg-gray-100 p-2 rounded-full">
                                <PauseIcon className="h-6 w-6 text-black" />
                            </button>
                        )}
                    </div>
                </div>
                <span>{formatTime(duration)}</span>
            </div>


        </div>
    );
};

export {YouTubeAudioPlayer};
