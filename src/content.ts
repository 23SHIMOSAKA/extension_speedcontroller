import SpeedController from './speedController';
import ScreenshotController from './screenshotController';

let currentUrl: string = location.href;

function initializeExtension(): void {
    if (!location.href.includes('/watch')) {
        return;
    }

    if (document.getElementById('AllContainer')) {
        return;
    }

    insertAfterClarifyBox();
}

// Hook pushState and replaceState to detect SPA navigation
(function hookHistory(history: History) {
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function patchedPushState(...args) {
        const result = pushState.apply(history, args as [data: unknown, unusedTitle: string, url?: string | URL | null]);
        window.dispatchEvent(new Event('locationchange'));
        return result;
    };

    history.replaceState = function patchedReplaceState(...args) {
        const result = replaceState.apply(history, args as [data: unknown, unusedTitle: string, url?: string | URL | null]);
        window.dispatchEvent(new Event('locationchange'));
        return result;
    };
})(window.history);

window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'));
});

window.addEventListener('locationchange', () => {
    if (location.href !== currentUrl) {
        currentUrl = location.href;
        initializeExtension();
    }
});

function createAllContainer(): HTMLDivElement {
    const allContainer = document.createElement('div');
    allContainer.id = 'AllContainer';

    const screenshotButton = document.createElement('button');
    screenshotButton.id = 'screenshotButton';
    screenshotButton.textContent = '📷';
    allContainer.appendChild(screenshotButton);
    new ScreenshotController(screenshotButton);

    const speedContainer = document.createElement('div');
    speedContainer.id = 'speedContainer';
    allContainer.appendChild(speedContainer);
    new SpeedController(speedContainer);

    return allContainer;
}

function insertAfterClarifyBox(): void {
    const observer = new MutationObserver((_, obs) => {
        const targetElement = document.getElementById('clarify-box');
        if (targetElement && targetElement.parentNode) {
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

initializeExtension();
