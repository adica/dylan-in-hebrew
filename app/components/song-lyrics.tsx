import React from "react";

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
                <h2 className="text-2xl font-semibold text-white">{songTitle}</h2>
            </div>

            <div
                className="custom-scroll relative mt-6 h-[calc(100vh-260px)] overflow-y-auto pr-4 text-base leading-7 text-zinc-200"
                style={{direction: 'ltr', textAlign: 'right'}}
            >
                <div className="w-full pb-2" style={{direction: 'rtl'}}>
                    {songTranslation?.songLyrics.verses.map((verse: string[], index: number) => {
                        const key = `verse-${verse.length}-${index}`;
                        return (
                            <ul key={key} className="pb-6">
                                {verse.map((line) => {
                                    const key = `${songId}-${line}`;
                                    return (
                                        <li key={key} className="text-zinc-200">
                                            {line}
                                            <br />
                                        </li>
                                    );
                                })}
                            </ul>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export {SongLyrics};
