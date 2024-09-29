import { getVideo } from './utils.js';

class SpeedController {
    constructor(container) {
        this.container = container;
        this.video = null;
        this.speeds = [];
        this.init();
    }

    init() {
        this.video = getVideo();
        if (!this.video) {
            // 動画要素が見つからない場合は待機
            const observer = new MutationObserver((mutations, obs) => {
                this.video = getVideo();
                if (this.video) {
                    this.applySavedPlaybackRate();
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            this.applySavedPlaybackRate();
        }
        this.loadSpeeds();
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
        if (!this.video) {
            this.video = getVideo();
        }
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
}

export default SpeedController;
