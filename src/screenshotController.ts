import { getVideo, showTooltip } from './utils';

class ScreenshotController {
    private readonly button: HTMLButtonElement;
    private video: HTMLVideoElement | null;

    constructor(button: HTMLButtonElement) {
        this.button = button;
        this.video = getVideo();
        this.init();
    }

    private init(): void {
        this.button.addEventListener('click', () => this.takeScreenshot());
    }

    private takeScreenshot(): void {
        if (!this.video) {
            this.video = getVideo();
        }

        if (!this.video) {
            showTooltip(this.button, '動画が見つかりません。');
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            showTooltip(this.button, 'Canvasがサポートされていません。');
            return;
        }

        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            if (blob) {
                this.copyToClipboard(blob);
            } else {
                showTooltip(this.button, 'スクリーンショット生成に失敗しました。');
            }
        }, 'image/png');
    }

    private copyToClipboard(blob: Blob): void {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard
            .write([item])
            .then(() => showTooltip(this.button, 'スクリーンショットをコピーしました。'))
            .catch(() => showTooltip(this.button, 'コピーに失敗しました。'));
    }
}

export default ScreenshotController;
