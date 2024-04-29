function makeAllContainer() {
    const allContainer = document.createElement('div');
    allContainer.id = 'AllContainer';

    // 動画部分
    let video = document.querySelector('.video-stream').addEventListener('loadedmetadata', applySavedPlaybackRate);

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
                savePlaybackRate(speed); // 新しい速度を保存
                updateButtonColors(speed); // ボタンの色を更新
            } catch (e) {
                video = getVideo();
                video.playbackRate = speed
                savePlaybackRate(speed); // 新しい速度を保存
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
        video = getVideo();
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
                    showTooltip(screenShotButton, 'スクリーンショットをクリップボードにコピーしました。');
                }).catch(err => {
                    showTooltip(screenShotButton, 'クリップボードへのコピーに失敗しました');
                });
            } catch (err) {
                showTooltip(screenShotButton, 'クリップボードAPIの使用中にエラーが発生しました');
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

    applySavedPlaybackRate(); // 保存された再生速度を適用

    return allContainer;
}

function getVideo() {
    return document.querySelector('.video-stream');
}

// ツールチップ表示関数
function showTooltip(button, message) {
    // ツールチップエレメントの作成
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip-text');
    tooltip.textContent = message;
    tooltip.style.visibility = 'hidden'; // 最初は非表示
    document.body.appendChild(tooltip);

    // ツールチップの位置をボタンに合わせて調整
    const buttonRect = button.getBoundingClientRect();
    tooltip.style.position = 'absolute'; // 絶対位置指定に変更
    tooltip.style.left = `${buttonRect.left + window.scrollX + (button.offsetWidth - tooltip.offsetWidth) / 2}px`; // ボタンの中央に配置
    tooltip.style.top = `${buttonRect.top + window.scrollY + button.offsetHeight + 5}px`; // ボタンの下に表示
    tooltip.style.visibility = 'visible';

    // 数秒後にツールチップを非表示にする
    setTimeout(() => {
        tooltip.remove();
    }, 3000); // 3000ミリ秒後に消える
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

// 再生速度をchrome.storageに保存する関数
function savePlaybackRate(speed) {
    chrome.storage.sync.set({ playbackRate: speed });
}

// 保存された再生速度を適用する関数
function applySavedPlaybackRate() {
    chrome.storage.sync.get(['playbackRate'], function (result) {
        video = getVideo();
        if (result.playbackRate && video) {
            video.playbackRate = result.playbackRate;
            updateButtonColors(result.playbackRate); // ボタンの色を更新
        }
    });
}

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

// const observer2 = new MutationObserver((mutations, obs) => {
//     // 目的の要素が見つかった場合、新しい要素を追加して監視を停止
//     const itemsWithClass = document.querySelectorAll('#items.style-scope.ytd-guide-section-renderer');
//     if (itemsWithClass) {
//         const searchContainer = document.createElement('div');
//         searchContainer.innerHTML = '<input type="text" id="channelSearchInput" placeholder="チャンネルを検索">';
//         const itemsContainer = document.querySelector('#guide-section-title');
//         console.log(itemsContainer)
//         // itemsContainer.insertBefore(searchContainer, itemsContainer.firstChild);

//         console.log("done")
//         obs.disconnect(); // 監視を停止
//     }
// });

// // 監視を開始する
// observer2.observe(document.body, {
//     childList: true,
//     subtree: true,
// });

