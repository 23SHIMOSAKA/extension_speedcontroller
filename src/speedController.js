// speedController.js

import { getVideo } from './utils.js';

class SpeedController {
    constructor(container) {
        this.container = container;
        this.video = null;
        this.speeds = [];
        this.init();
    }

    init() {
        this.loadSpeeds();
        this.setupVideoObserver();
    }

    loadSpeeds() {
        chrome.storage.sync.get({ speedList: '1, 1.25, 1.5, 2' }, (data) => {
            this.speeds = data.speedList.split(',').map(speed => parseFloat(speed.trim()));
            this.speeds.forEach(speed => this.createButton(speed));
        });
    }

    createButton(speed) {
        const button = document.createElement('button');
        button.textContent = `${speed}x`;
        button.addEventListener('click', () => this.onSpeedButtonClick(speed));
        this.container.appendChild(button);
    }

    onSpeedButtonClick(speed) {
        if (this.video) {
            this.video.playbackRate = speed;
            this.savePlaybackRate(speed);
            this.updateButtonColors(speed);
        }
    }

    savePlaybackRate(speed) {
        chrome.storage.sync.set({ playbackRate: speed });
    }

    applySavedPlaybackRate() {
        chrome.storage.sync.get(['playbackRate'], (result) => {
            if (result.playbackRate && this.video) {
                this.video.playbackRate = result.playbackRate;
                this.updateButtonColors(result.playbackRate);
            }
        });
    }

    updateButtonColors(selectedSpeed) {
        const buttons = this.container.querySelectorAll('button');
        buttons.forEach(button => {
            if (parseFloat(button.textContent) === selectedSpeed) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    setupVideoObserver() {
        // 最初の動画要素を取得
        this.video = getVideo();

        // 動画が存在しない場合、DOMの変化を監視
        if (!this.video) {
            const bodyObserver = new MutationObserver((mutations, obs) => {
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

        // 動画要素の置き換えを監視
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

    addVideoEventListeners() {
        if (this.video) {
            // 動画のメタデータがロードされたときに再生速度を適用
            this.video.addEventListener('loadedmetadata', () => this.applySavedPlaybackRate());
            // ページ読み込み時にも再生速度を適用
            this.applySavedPlaybackRate();
        }
    }
}

export default SpeedController;
