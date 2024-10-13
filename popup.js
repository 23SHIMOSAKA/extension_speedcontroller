document.addEventListener('DOMContentLoaded', function () {
  const speedListContainer = document.getElementById('speedListContainer');
  const newSpeedInput = document.getElementById('newSpeed');
  const addSpeedButton = document.getElementById('addSpeedButton');
  const saveButton = document.getElementById('saveButton');

  let speedList = [];

  // ストレージから再生速度リストを読み込み、表示
  chrome.storage.sync.get({ speedList: '1, 1.25, 1.5, 2' }, function (data) {
    speedList = data.speedList.split(',').map(speed => parseFloat(speed.trim()));
    renderSpeedList();
  });

  // 再生速度リストを表示する関数
  function renderSpeedList() {
    // リストを昇順にソート
    speedList.sort((a, b) => a - b);

    // リストを表示
    speedListContainer.innerHTML = '';
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
      speedListContainer.appendChild(speedItem);
    });
  }

  // 新しい速度をリストに追加
  addSpeedButton.addEventListener('click', function () {
    const newSpeed = parseFloat(newSpeedInput.value);
    if (!isNaN(newSpeed) && newSpeed > 0) {
      if (!speedList.includes(newSpeed)) {
        speedList.push(newSpeed);
        newSpeedInput.value = '';
        renderSpeedList();
      } else {
        showMessage('この速度は既に追加されています。');
      }
    } else {
      // エラー時に使用
        showMessage('有効な速度を入力してください。');
    }
  });

  // 速度リストを保存
  saveButton.addEventListener('click', function () {
    const speedListString = speedList.join(', ');
    chrome.storage.sync.set({ speedList: speedListString }, function () {
      showMessage('再生速度リストを保存しました。変更を反映するためには、YouTubeのページをリロードしてください。');
    });
  });

  // エラーメッセージを表示する関数
  function showMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 3000);
  }

});
