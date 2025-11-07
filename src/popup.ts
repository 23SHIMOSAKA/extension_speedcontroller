document.addEventListener('DOMContentLoaded', () => {
  let speedListContainer = document.getElementById('speedListContainer') as HTMLDivElement | null;
  const newSpeedInput = document.getElementById('newSpeed') as HTMLInputElement | null;
  const addSpeedButton = document.getElementById('addSpeedButton') as HTMLButtonElement | null;
  const saveButton = document.getElementById('saveButton') as HTMLButtonElement | null;

  if (!newSpeedInput || !addSpeedButton || !saveButton) {
    return;
  }

  let speedList: number[] = [];

  chrome.storage.sync.get({ speedList: '1, 1.25, 1.5, 2' }, (data) => {
    const raw = typeof data.speedList === 'string' ? data.speedList : '1, 1.25, 1.5, 2';
    speedList = raw
      .split(',')
      .map((speed) => parseFloat(speed.trim()))
      .filter((speed) => !Number.isNaN(speed));
    renderSpeedList();
  });

  function getSpeedListContainer(): HTMLDivElement | null {
    // Re-query the DOM in case the popup re-rendered and the old node was detached
    if (!speedListContainer || !speedListContainer.isConnected) {
      speedListContainer = document.getElementById('speedListContainer') as HTMLDivElement | null;
    }
    return speedListContainer;
  }

  function renderSpeedList(): void {
    const container = getSpeedListContainer();
    if (!container) {
      return;
    }
    speedList.sort((a, b) => a - b);
    container.innerHTML = '';
    speedList.forEach((speed, index) => {
      const speedItem = document.createElement('div');
      speedItem.className = 'speed-item';

      const speedLabel = document.createElement('span');
      speedLabel.textContent = `${speed}x`;

      const removeButton = document.createElement('button');
      removeButton.textContent = '削除';
      removeButton.addEventListener('click', () => {
        speedList.splice(index, 1);
        renderSpeedList();
      });

      speedItem.appendChild(speedLabel);
      speedItem.appendChild(removeButton);
      container.appendChild(speedItem);
    });
  }

  addSpeedButton.addEventListener('click', () => {
    const newSpeed = parseFloat(newSpeedInput.value);
    if (!Number.isNaN(newSpeed) && newSpeed > 0) {
      if (!speedList.includes(newSpeed)) {
        speedList.push(newSpeed);
        newSpeedInput.value = '';
        renderSpeedList();
      } else {
        showMessage('この速度は既に追加されています。');
      }
    } else {
      showMessage('有効な速度を入力してください。');
    }
  });

  saveButton.addEventListener('click', () => {
    const speedListString = speedList.join(', ');
    chrome.storage.sync.set({ speedList: speedListString }, () => {
      showMessage('再生速度リストを保存しました。\n変更を反映するためには、YouTubeのページをリロードしてください。');
    });
  });

  function showMessage(message: string): void {
    const messageBox = document.getElementById('messageBox');
    if (!messageBox) {
      return;
    }
    messageBox.textContent = message;
    messageBox.style.display = 'block';
    setTimeout(() => {
      messageBox.style.display = 'none';
    }, 3000);
  }
});
