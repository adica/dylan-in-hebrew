import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import albumData from '../data/bob-dylan-discography.json';

const AlbumGrid = () => {
    return (
        <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center my-8">Bob Dylan Discography</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {albumData.albums.map((album) => (
                    <Link href={`/album/${album.albumId}`} key={album.albumId}>
                        <div key={album.id} className="relative group">
                            <div
                                className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 group-hover:scale-105">
                                <Image
                                    src={album.coverImage}
                                    alt={album.name}
                                    layout="fill"
                                    objectFit="cover"
                                />
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300"></div>
                                <div
                                    className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <h2 className="text-xl font-semibold">{album.name}</h2>
                                    <p className="text-sm">{album.releaseDate}</p>
                                </div>
                            </div>
                            <div
                                className="absolute top-1/2 left-1/2 w-3/4 h-3/4 bg-gray-900 rounded-full -translate-x-1/2 -translate-y-1/2 transform scale-95 transition-all duration-300 group-hover:scale-100 group-hover:translate-y-[calc(-50%+0.5rem)] z-[-1]"></div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AlbumGrid;
