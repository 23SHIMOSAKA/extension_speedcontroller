function makeAllContainer() {
    const allContainer = document.createElement('div');
    allContainer.id = 'AllContainer';

    // 動画部分
    let video = document.querySelector('.video-stream');

    // 再生速度ボタン
    const speedButtons = document.createElement('div');
    speedButtons.id = 'speedContainer';
    allContainer.appendChild(speedButtons);

    const addButton = (speed) => {
        const button = document.createElement('button');
        button.textContent = `${speed}x`;
        button.addEventListener('click', () => {
            try {
                video.playbackRate = speed
                updateButtonColors(speed); // ボタンの色を更新
            } catch (e) {
                video = document.querySelector('.video-stream');
                video.playbackRate = speed
                updateButtonColors(speed); // ボタンの色を更新
            }
        });
        speedButtons.appendChild(button);
    };

    chrome.storage.sync.get({ speedList: '1, 1.25, 1.5, 2' }, function (data) {
        const speeds = data.speedList.split(',').map(speed => parseFloat(speed.trim()));
        speeds.forEach(speed => addButton(speed));
    });

    // スクショボタン
    const screenShotButton = document.createElement('button');
    screenShotButton.id = 'screenShotButton';
    screenShotButton.textContent = '📷';
    screenShotButton.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // canvasの内容を画像として取得
        canvas.toBlob(blob => {
            try {
                // BlobからClipboardItemを作成
                const item = new ClipboardItem({ "image/png": blob });
                // クリップボードに画像をコピー
                navigator.clipboard.write([item]).then(() => {
                    console.log('スクリーンショットをクリップボードにコピーしました。');
                }).catch(err => {
                    console.error('クリップボードへのコピーに失敗しました:', err);
                });
            } catch (err) {
                console.error('クリップボードAPIの使用中にエラーが発生しました:', err);
            }
        }, 'image/png');
    });
    allContainer.appendChild(screenShotButton);

    // 音量ボタン（ミュート、最大）
    const volumeButtons = document.createElement('div');
    volumeButtons.id = 'volumeContainer';
    const muteButton = document.createElement('button');
    muteButton.textContent = '🔈';
    const maxVolumeButton = document.createElement('button');
    maxVolumeButton.textContent = '🔊';
    volumeButtons.appendChild(muteButton);
    volumeButtons.appendChild(maxVolumeButton);
    muteButton.addEventListener('click', () => {
        video.muted = !video.muted;
        if (video.muted) {
            muteButton.textContent = '🔇';
        } else {
            muteButton.textContent = '🔈';
        }
    });
    maxVolumeButton.addEventListener('click', () => {
        video.muted = false;
        video.volume = 1;
        muteButton.textContent = '🔈';
    });
    allContainer.appendChild(volumeButtons);


    return allContainer;
}

// 再生速度ボタンの色を更新する関数
const updateButtonColors = (selectedSpeed) => {
    const speedButtons = document.getElementById('speedContainer');
    const buttons = speedButtons.querySelectorAll('button');
    buttons.forEach(button => {
        if (parseFloat(button.textContent) === selectedSpeed) {
            button.style.backgroundColor = '#4CAF50'; // 選択されたボタンの色
            button.style.color = 'white';
        } else {
            button.style.backgroundColor = ''; // デフォルトの色
            button.style.color = '';
        }
    });
};

// 新しい要素を追加する関数
function insertAfterNewElement(targetId) {
    const newElement = document.createElement('div');
    newElement.appendChild(makeAllContainer());

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling);
    }
}

// DOMの変更を監視するMutationObserverの設定
const observer = new MutationObserver((mutations, obs) => {
    // 目的の要素が見つかった場合、新しい要素を追加して監視を停止
    const targetElement = document.getElementById('clarify-box');
    if (targetElement) {
        insertAfterNewElement('clarify-box');
        obs.disconnect(); // 監視を停止
    }
});

// 監視を開始する
observer.observe(document.body, {
    childList: true,
    subtree: true,
});
