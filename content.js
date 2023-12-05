const buttonsContainer = document.createElement('div');
buttonsContainer.id = 'AllContainer';
document.body.appendChild(buttonsContainer);

const speedButtons = document.createElement('div');
speedButtons.id = 'speedContainer';
buttonsContainer.appendChild(speedButtons)


const addButton = (speed) => {
    const button = document.createElement('button');
    button.textContent = `${speed}x`;
    const video = document.querySelector('video');
    button.addEventListener('click', () =>
        video.playbackRate = speed
    );
    speedButtons.appendChild(button);
};

chrome.storage.sync.get({ speedList: '1, 1.25, 1.5, 2' }, function (data) {
    const speeds = data.speedList.split(',').map(speed => parseFloat(speed.trim()));
    speeds.forEach(speed => addButton(speed));
});

const toggleButton = document.createElement('button');
toggleButton.textContent = '-';
toggleButton.addEventListener('click', function () {
    const isHidden = buttonsContainer.classList.toggle('hidden');
    if (isHidden) {
        toggleButton.textContent = '+';
        speedButtons.style.display = 'none';
    } else {
        toggleButton.textContent = '-';
        speedButtons.style.display = 'flex';
    }
});
buttonsContainer.appendChild(toggleButton);

const style = document.createElement('style');
style.textContent = `
#AllContainer {
    position: fixed;
    left: 0;
    buttom: 40%;
    transform: translateY(50%);
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: :rgba(0,0,0,0);
    z-index: 9999;
    align-items: flex-end;
    overflow: hidden;
}

#toggleButton {
    order: 1;
    width: auto;
    background-color: #3498db;
    color: #fff;
    border: none;
    padding: 8px 16px;
    margin-bottom: 10px;
    cursor: pointer;
}
  
#toggleButton:hover {
    background-color: #2980b9;
}
  
#speedContainer {
    order: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

button {
    width: 100%;
    background-color: #ecf0f1;
    border: none;
    padding: 8px 16px;
    margin-bottom: 5px;
    border-radius: 5px;
    cursor: pointer;
}
  
button:hover {
    background-color: #bdc3c7;
}

`;
document.head.appendChild(style);