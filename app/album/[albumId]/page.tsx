'use client';

import {useParams} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import albumData from '../../data/bob-dylan-discography.json';

export default function AlbumPage() {
    const {albumId} = useParams();
    const album = albumData.albums.find((a) => a.albumId === albumId);

    if (!album) {
        return <div>Album not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/" className="inline-block mb-4 text-blue-500 hover:text-blue-700">
                &larr; Back to All Albums
            </Link>
            <h1 className="text-4xl font-bold mb-4">{album.name}</h1>
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-4 md:mb-0">
                    <Image
                        src={album.coverImage}
                        alt={album.name}
                        width={300}
                        height={300}
                        className="rounded-lg shadow-lg"
                    />
                </div>
                <div className="md:w-2/3 md:pl-8">
                    <p className="text-xl mb-2">Release Date: {album.releaseDate}</p>
                    <p className="text-xl mb-4">{album.credits}</p>
                    <h2 className="text-2xl font-semibold mb-2">Track List:</h2>
                    <ol className="list-decimal list-inside">
                        {album.songs.map((song) => {
                            return (
                                <li key={`${song.songId}`} className="mb-1">
                                    <Link key={song.songId} href={`/album/${album.albumId}/${song.songId}`}>{song.name}</Link>
                                </li>
                            )
                        })}
                    </ol>
                </div>
            </div>
        </div>
    );
}
