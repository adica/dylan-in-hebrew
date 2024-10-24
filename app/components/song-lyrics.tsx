import React from "react";

interface SongLyricsProps {
    songId: string | string[];
    songTranslation?: {
        songLyrics?: {
            verses: string[][];
        }
    };
}

const SongLyrics: React.FC<SongLyricsProps> = ({songId, songTranslation}) => {
    if (!songTranslation?.songLyrics) return null;

    return (
        <div dir="rtl">
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
