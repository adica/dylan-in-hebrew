import React from "react";

interface OriginalLyricsProps {
    songId: string | string[];
    songName: string;
    albumId: string | string[];
}

interface LyricsSource {
    name: string;
    url: string;
}

const parseLyrics = (lyricsText: string) => {
    return lyricsText
        .split(/\n{2,}/)
        .map((verse) =>
            verse
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
        )
        .filter((verse) => verse.length > 0);
};

const OriginalLyrics: React.FC<OriginalLyricsProps> = ({songId, songName, albumId}) => {
    const [lyricsText, setLyricsText] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [source, setSource] = React.useState<LyricsSource | null>(null);

    React.useEffect(() => {
        let isActive = true;

        const loadLyrics = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `/api/lyrics?artist=${encodeURIComponent("Bob Dylan")}&title=${encodeURIComponent(songName)}`
                );
                if (!response.ok) {
                    throw new Error("Lyrics not found");
                }
                const data = await response.json();
                if (!isActive) return;
                setLyricsText(data.lyrics ?? "");
                setSource(data.source ?? null);
            } catch (err) {
                if (!isActive) return;
                setError("Original lyrics are not available yet.");
            } finally {
                if (!isActive) return;
                setIsLoading(false);
            }
        };

        loadLyrics();

        return () => {
            isActive = false;
        };
    }, [songName]);

    const verses = React.useMemo(() => {
        if (!lyricsText) return [];
        return parseLyrics(lyricsText);
    }, [lyricsText]);

    return (
        <div dir="ltr">
            <div>
                <h2 className="text-2xl font-semibold text-white">{songName}</h2>
                {source && (
                    <p className="mt-1 text-xs text-zinc-400">
                        Source: <a className="underline hover:text-white" href={source.url} target="_blank" rel="noreferrer">{source.name}</a>
                    </p>
                )}
            </div>

            <div
                className="custom-scroll relative mt-6 h-[calc(100vh-260px)] overflow-y-auto pr-4 text-base leading-7 text-zinc-200"
                style={{direction: 'ltr', textAlign: 'left'}}
            >
                {isLoading && (
                    <p className="text-sm text-zinc-400">Loading original lyrics...</p>
                )}
                {!isLoading && error && (
                    <p className="text-sm text-zinc-400">{error}</p>
                )}
                {!isLoading && !error && verses.length > 0 && (
                    <div className="w-full pb-2">
                        {verses.map((verse, index) => {
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
                )}
            </div>
        </div>
    );
};

export {OriginalLyrics};
