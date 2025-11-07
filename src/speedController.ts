// speedController.ts

import { getVideo } from './utils';

const DEFAULT_SPEEDS = '1, 1.25, 1.5, 2';

class SpeedController {
    private readonly container: HTMLElement;
    private video: HTMLVideoElement | null;
    private speeds: number[];

    constructor(container: HTMLElement) {
        this.container = container;
        this.video = null;
        this.speeds = [];
        this.init();
    }

    private init(): void {
        this.loadSpeeds();
        this.setupVideoObserver();
    }

    private loadSpeeds(): void {
        chrome.storage.sync.get({ speedList: DEFAULT_SPEEDS }, (data) => {
            const rawSpeeds = typeof data.speedList === 'string' ? data.speedList : DEFAULT_SPEEDS;
            this.speeds = rawSpeeds
                .split(',')
                .map((speed) => parseFloat(speed.trim()))
                .filter((speed) => !Number.isNaN(speed));
            this.speeds.forEach((speed) => this.createButton(speed));
        });
    }

    private createButton(speed: number): void {
        const button = document.createElement('button');
        button.textContent = `${speed}x`;
        button.addEventListener('click', () => this.onSpeedButtonClick(speed));
        this.container.appendChild(button);
    }

    private onSpeedButtonClick(speed: number): void {
        if (this.video) {
            this.video.playbackRate = speed;
            this.savePlaybackRate(speed);
            this.updateButtonColors(speed);
        }
    }

    private savePlaybackRate(speed: number): void {
        chrome.storage.sync.set({ playbackRate: speed });
    }

    private applySavedPlaybackRate(): void {
        chrome.storage.sync.get(['playbackRate'], (result) => {
            const rate = typeof result.playbackRate === 'number' ? result.playbackRate : null;
            if (rate && this.video) {
                this.video.playbackRate = rate;
                this.updateButtonColors(rate);
            }
        });
    }

    private updateButtonColors(selectedSpeed: number): void {
        const buttons = this.container.querySelectorAll('button');
        buttons.forEach((button) => {
            const parsed = parseFloat(button.textContent ?? '');
            if (!Number.isNaN(parsed) && parsed === selectedSpeed) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    private setupVideoObserver(): void {
        // Acquire the initial video element if it already exists
        this.video = getVideo();

        // If the video is missing (e.g. SSR placeholder), observe DOM changes
        if (!this.video) {
            const bodyObserver = new MutationObserver((_, obs) => {
                this.video = getVideo();
                if (this.video) {
                    this.addVideoEventListeners();
                    obs.disconnect();
                }
            });
            bodyObserver.observe(document.body, { childList: true, subtree: true });
        } else {
            this.addVideoEventListeners();
        }

        // Track replacements of the video element to rebind listeners
        const videoParent = document.querySelector('.html5-video-player');
        if (videoParent) {
            const videoObserver = new MutationObserver(() => {
                const newVideo = getVideo();
                if (newVideo && newVideo !== this.video) {
                    this.video = newVideo;
                    this.addVideoEventListeners();
                }
            });
            videoObserver.observe(videoParent, { childList: true, subtree: true });
        }
    }

    private addVideoEventListeners(): void {
        if (this.video) {
            // Apply saved rate once metadata is available
            this.video.addEventListener('loadedmetadata', () => this.applySavedPlaybackRate());
            // Also apply immediately for already loaded videos
            this.applySavedPlaybackRate();
        }
    }
}

export default SpeedController;
