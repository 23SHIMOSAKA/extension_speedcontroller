import SpeedController from './speedController.js';
import ScreenshotController from './screenshotController.js';

let currentUrl = location.href;

// 初期化
function initializeExtension() {
    if (!location.href.includes('/watch')) {
      return; // /watch ページでない場合は何もしない
    }
  
    // 既に拡張機能が初期化されている場合はスキップ
    if (document.getElementById('AllContainer')) {
      return;
    }
  
    insertAfterClarifyBox();
  }
  
  // pushState, replaceState をフック
(function(history) {
    const pushState = history.pushState;
    const replaceState = history.replaceState;
  
    history.pushState = function(state) {
      const result = pushState.apply(history, arguments);
      window.dispatchEvent(new Event('locationchange'));
      return result;
    };
  
    history.replaceState = function(state) {
      const result = replaceState.apply(history, arguments);
      window.dispatchEvent(new Event('locationchange'));
      return result;
    };
  })(window.history);

// popstate イベントを監視
window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'));
  });
  
// locationchange イベントを監視
window.addEventListener('locationchange', () => {
    if (location.href !== currentUrl) {
        currentUrl = location.href;
        initializeExtension();
    }
});

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

// 初期ロード時に拡張機能を初期化
initializeExtension();
