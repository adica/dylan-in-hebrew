'use client';

import {useParams} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import albumData from '../../data/bob-dylan-discography.json';
import translations from '../../data/translations.heb.json';

export default function AlbumPage() {
    const {albumId} = useParams();
    const album = albumData.albums.find((a) => a.albumId === albumId);
    const hebrewSongIds = new Set(translations.songs.map((song) => song.songId.toString()));

    if (!album) {
        return <div>Album not found</div>;
    }

    return (
        <div className="relative">
            <div className="pointer-events-none absolute -top-32 right-10 hidden h-64 w-64 rounded-full bg-red-500/20 blur-3xl sm:block" />
            <div className="mx-auto max-w-6xl px-6 py-10">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
                    <span className="text-base">&larr;</span>
                    Back to All Albums
                </Link>

                <div className="mt-8 flex flex-col gap-8 md:flex-row">
                    <div className="md:w-5/12">
                        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/60 p-4 ring-1 ring-white/10">
                            <div className="relative aspect-square overflow-hidden rounded-xl">
                                <Image
                                    src={album.coverImage}
                                    alt={album.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                    className="object-cover"
                                />
                            </div>
                            <div className="mt-4 flex items-center gap-3">
                                <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-200">
                                    {album.releaseDate}
                                </span>
                                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">
                                    Album
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-semibold text-white sm:text-4xl">{album.name}</h1>
                        <p className="mt-3 text-sm text-zinc-400">{album.credits}</p>

                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-zinc-100">Track List</h2>
                            <ol className="mt-4 divide-y divide-white/5 rounded-2xl border border-white/5 bg-zinc-900/40 px-4">
                                {album.songs.map((song, index) => {
                                    const isPlayable = Boolean(song.ytId);
                                    const hasHebrewLyrics = hebrewSongIds.has(song.songId.toString());
                                    return (
                                        <li key={`${song.songId}`} className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-4">
                                                <span className="w-6 text-right text-xs text-zinc-500">
                                                    {index + 1}
                                                </span>
                                                <Link
                                                    key={song.songId}
                                                    href={`/album/${album.albumId}/${song.songId}`}
                                                    className={`text-sm transition hover:text-white ${
                                                        isPlayable ? 'text-zinc-100' : 'text-zinc-500'
                                                    }`}
                                                >
                                                    {song.name}
                                                </Link>
                                                {hasHebrewLyrics ? (
                                                    <Image
                                                        src="/images/flags/il.svg"
                                                        alt="Hebrew translation"
                                                        title="Hebrew translation"
                                                        width={18}
                                                        height={18}
                                                        className="opacity-80"
                                                    />
                                                ) : (
                                                    <span className="text-[11px] text-zinc-500">Lyrics only</span>
                                                )}
                                            </div>
                                            <span className={`text-[11px] ${isPlayable ? 'text-red-300' : 'text-zinc-600'}`}>
                                                {isPlayable ? 'Playable' : 'Lyrics only'}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
