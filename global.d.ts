declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
    }

    namespace YT {
        class Player {
            getCurrentTime: Player;
            constructor(elementId: string | HTMLElement, options: any);
            getDuration(): void;
            playVideo(): void;
            pauseVideo(): void;
            seekTo(seconds: number): void;
            unMute(): void;
            mute(): void;
            PlayerState: {};
        }
    }
}

export {};
