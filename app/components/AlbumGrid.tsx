import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlayIcon } from '@heroicons/react/20/solid';
import albumData from '../data/bob-dylan-discography.json';

const AlbumGrid = () => {
    return (
        <div className="relative">
            <div className="absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl" />
            <div className="mx-auto max-w-6xl px-6 py-10">
                <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-red-400/80">Dylan In Hebrew</p>
                        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
                            בוב דילן בעברית
                        </h1>
                        <p className="mt-3 max-w-xl text-sm text-zinc-400">
                            כל האלבומים במקום אחד, עם נראות בהשראת YouTube Music.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-200 transition hover:border-red-400/50 hover:text-white">
                            Shuffle
                        </button>
                        <button className="rounded-full bg-red-500 px-5 py-2 text-sm font-medium text-black transition hover:bg-red-400">
                            Play All
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {albumData.albums.map((album) => (
                        <Link href={`/album/${album.albumId}`} key={album.albumId} className="group">
                            <div className="relative rounded-2xl bg-zinc-900/60 p-4 ring-1 ring-white/5 transition hover:-translate-y-1 hover:ring-red-500/30">
                                <div className="relative aspect-square overflow-hidden rounded-xl">
                                    <Image
                                        src={album.coverImage}
                                        alt={album.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                </div>
                                <div className="mt-3">
                                    <h2 className="text-base font-semibold text-zinc-100">{album.name}</h2>
                                    <p className="text-xs text-zinc-400">{album.releaseDate}</p>
                                </div>
                                <div className="absolute right-6 top-[55%] flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-black opacity-0 shadow-lg shadow-red-500/40 transition group-hover:opacity-100">
                                    <PlayIcon className="h-5 w-5" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AlbumGrid;
