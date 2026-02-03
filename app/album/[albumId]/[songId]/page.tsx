'use client';
import React, {useState} from 'react';
import {useParams} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {YouTubeAudioPlayer} from '@/app/components/youtube-audio-player';
import {SongLyrics} from '@/app/components/song-lyrics';
import {OriginalLyrics} from '@/app/components/original-lyrics';
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
    const albumIdParam = Array.isArray(albumId) ? albumId[0] : albumId ?? '';
    const songIdParam = Array.isArray(songId) ? songId[0] : songId ?? '';

    if (!songIdParam) {
        return <div>song not found</div>;
    }
    const album = albumData.albums.find((a) => a.albumId === albumIdParam);
    if (!album) {
        return <div>album not found</div>;
    }
    const song = album.songs.find((s) => s.songId.toString() == songIdParam);
    if (!song) {
        return <div>song not found</div>;
    }

    const songTranslation = translations.songs.find((s) => s.songId.toString() == songIdParam);

    const ytId = song.ytId ?? '';
    const isPlayable = Boolean(ytId);
    const hasHebrewLyrics = Boolean(songTranslation?.songLyrics);
    return (
        <div className="relative min-h-screen bg-[#0b0b0f] text-white">
            <div className="absolute -top-24 left-10 h-64 w-64 rounded-full bg-red-500/20 blur-3xl" />
            {isSmallScreen && isPlayable && (
                <div className="fixed top-0 left-0 right-0 z-50 h-24 border-b border-white/10 bg-black/80 backdrop-blur">
                    <div className="flex h-full items-center px-4">
                        <YouTubeAudioPlayer songName={song.name} videoId={ytId} onPlayingChange={handlePlayingChange} />
                    </div>
                </div>
            )}

            <div
                className={`
                    ${isSmallScreen && isPlayable ? 'mt-24 h-[calc(100vh-96px)]' : 'h-[calc(100vh-96px)]'}
                    overflow-hidden
                `}
            >
                <div className="mx-auto h-full max-w-6xl px-6">
                    <div className="flex h-full flex-col gap-8 pt-8 lg:flex-row lg:items-start">
                        <div className="hidden lg:block lg:w-1/2">
                            <div className="relative mx-auto w-full max-w-[520px]">
                                <div className="absolute inset-0 rounded-3xl bg-red-500/10 blur-3xl" />
                                <div className="relative aspect-square overflow-hidden rounded-3xl bg-zinc-900/70 p-6 ring-1 ring-white/10">
                                    <Image
                                        src={album.coverImage}
                                        alt={album.name}
                                        fill
                                        className="object-cover rounded-2xl"
                                        sizes="(max-width: 1200px) 45vw, 500px"
                                        priority
                                    />
                                    <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-black/40">
                                        <Image
                                            src="/images/vinyl.png"
                                            alt="Vinyl"
                                            fill
                                            className={`object-cover ${isPlaying ? 'rotate' : ''}`}
                                            sizes="160px"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 lg:w-1/2">
                            <div className="rounded-3xl border border-white/5 bg-zinc-900/50 px-6 py-6">
                                {hasHebrewLyrics ? (
                                    <SongLyrics
                                        songName={song.name}
                                        songId={songIdParam}
                                        songTranslation={songTranslation}
                                        albumId={albumIdParam}
                                    />
                                ) : (
                                    <OriginalLyrics
                                        songName={song.name}
                                        songId={songIdParam}
                                        albumId={albumIdParam}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!isSmallScreen && isPlayable && (
                <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/80 backdrop-blur">
                    <div className="mx-auto flex h-24 max-w-6xl items-center px-6">
                        <YouTubeAudioPlayer songName={song.name} videoId={ytId} onPlayingChange={handlePlayingChange} />
                    </div>
                </div>
            )}
        </div>
    );
}
