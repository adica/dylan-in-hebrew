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
        <div className="audio-player w-full">
            <div style={{display: 'none'}}>
                <div ref={playerRef}></div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{songName}</p>
                    <p className="text-xs text-zinc-500">YouTube Audio</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleStop}
                        className="rounded-full border border-white/10 bg-white/5 p-2 text-zinc-200 transition hover:border-red-400/50"
                    >
                        <BackwardIcon className="h-4 w-4" />
                    </button>
                    {!isPlaying ? (
                        <button onClick={handlePlay} className="rounded-full bg-red-500 p-3 text-black shadow-lg shadow-red-500/40">
                            <PlayIcon className="h-5 w-5" />
                        </button>
                    ) : (
                        <button onClick={handlePause} className="rounded-full bg-red-500 p-3 text-black shadow-lg shadow-red-500/40">
                            <PauseIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="relative mt-4 w-full group">
                <div
                    className="absolute top-1/2 left-0 h-[3px] w-full rounded-full bg-white/10 transition-all duration-200 group-hover:h-[6px]"
                    style={{ transform: "translateY(-50%)" }}
                ></div>

                <div
                    className="absolute top-1/2 left-0 rounded-full bg-red-500 transition-all duration-200 group-hover:h-[6px]"
                    style={{
                        width: `${(currentTime / duration) * 100}%`,
                        transform: "translateY(-50%)",
                        height: "3px",
                    }}
                ></div>

                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSliderChange}
                    className="absolute top-1/2 left-0 z-10 h-[3px] w-full appearance-none bg-transparent transition-all duration-200 group-hover:h-[6px]
                   [&::-webkit-slider-runnable-track]:bg-transparent
                   [&::-moz-range-track]:bg-transparent
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
                   [&::-webkit-slider-thumb]:border-red-500 [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100
                   [&::-webkit-slider-thumb]:transition-opacity
                   [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4
                   [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2
                   [&::-moz-range-thumb]:border-red-500 [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:opacity-0 group-hover:[&::-moz-range-thumb]:opacity-100
                   [&::-moz-range-thumb]:transition-opacity"
                    style={{ transform: "translateY(-50%)" }}
                />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
    );
};

export {YouTubeAudioPlayer};
