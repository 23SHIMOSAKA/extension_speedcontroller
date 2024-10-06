import { getVideo, showTooltip } from './utils.js';

class ScreenshotController {
    constructor(button) {
        this.button = button;
        this.video = getVideo();
        this.init();
    }

    init() {
        this.button.addEventListener('click', () => this.takeScreenshot());
    }

    takeScreenshot() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => this.copyToClipboard(blob), 'image/png');
    }

    copyToClipboard(blob) {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item])
            .then(() => showTooltip(this.button, 'スクリーンショットをコピーしました。'))
            .catch(() => showTooltip(this.button, 'コピーに失敗しました。'));
    }
}

export default ScreenshotController;
