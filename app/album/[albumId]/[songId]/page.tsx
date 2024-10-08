'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import albumData from '../../../data/bob-dylan-discography.json';

export default function SongPage() {
    const { albumId, songId } = useParams();

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

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href={`/album/${albumId}`} className="inline-block mb-4 text-blue-500 hover:text-blue-700">
                &larr; Back to album
            </Link>
            <h1 className="text-4xl font-bold mb-4">{song.name}</h1>
        </div>
    );
}
