'use client';
import {useParams} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { YouTubeAudioPlayer } from '@/app/components/youtube-audio-player';
import albumData from '../../../data/bob-dylan-discography.json';
import translations from '../../../data/translations.heb.json';

export default function SongPage() {
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

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href={`/album/${albumId}`} className="inline-block mb-4 text-blue-500 hover:text-blue-700">
                &larr; Back to album
            </Link>
            <h1 className="text-4xl font-bold mb-4">{songTranslation?.songName ? `${songTranslation.songName} / ${song.name}` : song.name}</h1>
            {song.ytId && <YouTubeAudioPlayer videoId={song.ytId.toString()} />}
            {songTranslation?.songLyrics && (
                <div dir="rtl">
                    {songTranslation?.songLyrics.verses.map((verse, index) => {
                        const key = `${songId}-${verse.length}-${index}`;
                        return (
                            <ul key={key} className="pb-6">
                                {verse.map((line) => {
                                    const key = `${songId}-${line}`;
                                    return <li key={key}>{line}<br /></li>
                                })}
                            </ul>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
