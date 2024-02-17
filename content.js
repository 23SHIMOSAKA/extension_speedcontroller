function makeAllContainer() {
    const allContainer = document.createElement('div');
    allContainer.id = 'AllContainer';

    const speedButtons = document.createElement('div');
    speedButtons.id = 'speedContainer';
    allContainer.appendChild(speedButtons)

    const addButton = (speed) => {
        const button = document.createElement('button');
        button.textContent = `${speed}x`;
        let video = document.querySelector('.video-stream');
        button.addEventListener('click', () => {
            try {
                video.playbackRate = speed
            } catch (e) {
                video = document.querySelector('.video-stream');
                video.playbackRate = speed
            }
        });
        speedButtons.appendChild(button);
    };

    chrome.storage.sync.get({ speedList: '1, 1.25, 1.5, 2' }, function (data) {
        const speeds = data.speedList.split(',').map(speed => parseFloat(speed.trim()));
        speeds.forEach(speed => addButton(speed));
    });

    let timeout;
    function onButtonActivity() {
        allContainer.style.opacity = '1';
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            allContainer.style.opacity = '0.5';
        }, 2000);
    }

    const toggleButton = document.createElement('button');
    toggleButton.className = 'toggleButton';
    toggleButton.textContent = '-';
    toggleButton.addEventListener('click', function () {
        const isHidden = allContainer.classList.toggle('hidden');
        if (isHidden) {
            toggleButton.textContent = '+';
            speedButtons.style.display = 'none';
        } else {
            toggleButton.textContent = '-';
            speedButtons.style.display = 'flex';
        }
        onButtonActivity()
    });
    allContainer.addEventListener('mouseover', onButtonActivity);

    allContainer.appendChild(toggleButton);

    return allContainer;
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
    const targetElement = document.getElementById('clarify-box');
    if (targetElement) {
        // 目的の要素が見つかった場合、新しい要素を追加して監視を停止
        insertAfterNewElement('clarify-box');
        obs.disconnect(); // 監視を停止
    }
});

// 監視を開始する
observer.observe(document.body, {
    childList: true, // 直接の子要素の変更を監視
    subtree: true, // 全ての子要素を監視
});