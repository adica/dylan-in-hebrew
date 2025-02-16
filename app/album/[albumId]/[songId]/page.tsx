'use client';
import React, {useState} from 'react';
import {useParams} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {YouTubeAudioPlayer} from '@/app/components/youtube-audio-player';
import {SongLyrics} from '@/app/components/song-lyrics';
import albumData from '../../../data/bob-dylan-discography.json';
import translations from '../../../data/translations.heb.json';
import "./page.css";

export default function SongPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    // Callback function to handle the playing state
    const handlePlayingChange = (playing: boolean) => {
        setIsPlaying(playing);
    };
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 610);
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const {albumId, songId} = useParams();

    if (!songId) {
        return <div>song not found</div>;
    }
    const album = albumData.albums.find((a) => a.albumId === albumId);
    if (!album) {
        return <div>album not found</div>;
    }
    const song = album.songs.find((s) => s.songId.toString() == songId);
    if (!song) {
        return <div>song not found</div>;
    }

    const songTranslation = translations.songs.find((s) => s.songId.toString() == songId);

    if (!song.ytId) {
        return (
            <>
                <Link href={`/album/${albumId}`} className="inline-block mb-4 text-blue-500 hover:text-blue-700">
                    &larr; Back to album
                </Link>
                <h1 className="text-4xl font-bold mb-4">{songTranslation?.songName ? `${songTranslation.songName} / ${song.name}` : song.name}</h1>
            </>
        );
    }
    return (
        <div className="bg-black text-white relative">
            {isSmallScreen && (
                <div className="fixed top-0 left-0 right-0 h-24 bg-black border-b border-gray-800 z-50">
                    <div className="h-full flex items-center px-4">
                        <YouTubeAudioPlayer songName={song.name} videoId={song.ytId.toString()} onPlayingChange={handlePlayingChange} />
                    </div>
                </div>
            )}

            <div className={`
        ${isSmallScreen ? 'mt-24 h-[calc(100vh-96px)]' : 'h-[calc(100vh-88px)]'}
        overflow-hidden
      `}>
                <div className="h-full max-w-[1800px] mx-auto px-6">
                    <div className="h-full flex flex-col lg:flex-row lg:space-x-8 pt-6">
                        <div className="hidden sm:block lg:w-1/2">
                            <div className="w-full max-w-[600px] aspect-square relative mx-auto">
                                <Image
                                    src="/images/vinyl.png"
                                    alt="Album Cover"
                                    fill
                                    className={`object-cover rounded-lg ${isPlaying ? 'rotate' : ''}`}
                                    sizes="(max-width: 610px) 0vw, (max-width: 930px) 80vw, 50vw"
                                    priority
                                />
                            </div>
                        </div>
                        <div className="flex-1 lg:w-1/2">
                            <div className="px-4">
                                <SongLyrics
                                    songName={song.name}
                                    songId={songId}
                                    songTranslation={songTranslation}
                                    albumId={albumId}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed player for medium and large screens */}
            {!isSmallScreen && (
                <div className="fixed bottom-0 left-0 right-0 h-22 bg-black border-t border-gray-800">
                    <div className="h-full flex items-center px-4">
                        <YouTubeAudioPlayer songName={song.name} videoId={song.ytId.toString()} onPlayingChange={handlePlayingChange} />
                    </div>
                </div>
            )}
        </div>
    );
}
