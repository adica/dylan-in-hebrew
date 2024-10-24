import React from "react";
import Link from 'next/link';

interface SongLyricsProps {
    songId: string | string[];
    songName: string,
    albumId: string | string[];
    songTranslation?: {
        songName: string;
        songLyrics?: {
            verses: string[][];
        }
    };
}

const SongLyrics: React.FC<SongLyricsProps> = ({songId, songTranslation, albumId, songName}) => {
    if (!songTranslation?.songLyrics) return null;
    const songTitle = songTranslation?.songName ? `${songTranslation.songName} / ${songName}` : songName;

    return (
        <div dir="rtl">
            <div>
                <Link href={`/album/${albumId}`} className="inline-block mb-4 text-blue-500 hover:text-blue-700">
                    &larr; Back to album
                </Link>
                <h2 className="text-2xl font-bold mb-4">{songTitle}</h2>
            </div>

            {songTranslation?.songLyrics.verses.map((verse: string[], index: number) => {
                const key = `verse-${verse.length}-${index}`;
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
    );
}

export {SongLyrics};
