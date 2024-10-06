import SpeedController from './speedController.js';
import ScreenshotController from './screenshotController.js';

function createAllContainer() {
    const allContainer = document.createElement('div');
    allContainer.id = 'AllContainer';

    // スクリーンショットボタン
    const screenshotButton = document.createElement('button');
    screenshotButton.id = 'screenshotButton';
    screenshotButton.textContent = '📷';
    allContainer.appendChild(screenshotButton);
    new ScreenshotController(screenshotButton);

    // 再生速度ボタン
    const speedContainer = document.createElement('div');
    speedContainer.id = 'speedContainer';
    allContainer.appendChild(speedContainer);
    new SpeedController(speedContainer);

    return allContainer;
}

function insertAfterClarifyBox() {
    const observer = new MutationObserver((mutations, obs) => {
        const targetElement = document.getElementById('clarify-box');
        if (targetElement) {
            const allContainer = createAllContainer();
            targetElement.parentNode.insertBefore(allContainer, targetElement.nextSibling);
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

insertAfterClarifyBox();
