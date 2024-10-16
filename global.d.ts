declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: {
            Player: any;
            PlayerState: {
                UNSTARTED: number;
                ENDED: number;
                PLAYING: number;
                PAUSED: number;
                BUFFERING: number;
                CUED: number;
            };
        };
    }

    namespace YT {
        interface Player {
            playVideo: () => void;
            pauseVideo: () => void;
            seekTo: (seconds: number, allowSeekAhead: boolean) => void;
            getDuration: () => number;
            getCurrentTime: () => number;
            destroy: () => void;
        }

        interface PlayerState {
            UNSTARTED: number;
            ENDED: number;
            PLAYING: number;
            PAUSED: number;
            BUFFERING: number;
            CUED: number;
        }
    }
}

export {};
