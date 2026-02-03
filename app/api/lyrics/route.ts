import {NextRequest, NextResponse} from "next/server";

const DEFAULT_ARTIST = "Bob Dylan";
const SOURCE_NAME = "lyrics.ovh";
const SOURCE_URL = "https://lyrics.ovh";

const normalizeTitle = (title: string) => {
    return title
        .replace(/\(.*?\)/g, "")
        .replace(/[^\w\s']/g, "")
        .replace(/\s+/g, " ")
        .trim();
};

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const title = searchParams.get("title");
    const artist = searchParams.get("artist") ?? DEFAULT_ARTIST;
    const debug = searchParams.get("debug") === "1";

    if (!title) {
        return NextResponse.json({error: "Missing title"}, {status: 400});
    }

    const candidates = [title, normalizeTitle(title)];
    const uniqueCandidates = Array.from(new Set(candidates.filter(Boolean)));

    const tried: {candidate: string; status?: number; error?: string}[] = [];

    try {
        for (const candidate of uniqueCandidates) {
            const endpoint = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(candidate)}`;
            const response = await fetch(endpoint, {
                next: {revalidate: 60 * 60 * 24 * 7},
            });

            if (!response.ok) {
                tried.push({candidate, status: response.status});
                continue;
            }

            const data = await response.json();
            if (!data?.lyrics) {
                tried.push({candidate, status: 204});
                continue;
            }

            return NextResponse.json({
                lyrics: data.lyrics,
                source: {
                    name: SOURCE_NAME,
                    url: SOURCE_URL,
                },
            });
        }
    } catch (error) {
        if (debug) {
            return NextResponse.json({error: "Lyrics provider unavailable", tried}, {status: 502});
        }
        return NextResponse.json({error: "Lyrics provider unavailable"}, {status: 502});
    }

    if (debug) {
        return NextResponse.json({error: "Lyrics not found", tried}, {status: 404});
    }
    return NextResponse.json({error: "Lyrics not found"}, {status: 404});
}
