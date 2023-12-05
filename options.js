// options.js

document.addEventListener('DOMContentLoaded', function () {
    const speedListInput = document.getElementById('speedList');
    const saveButton = document.getElementById('saveButton');
  
    // Load the current speed list from storage and populate the input field
    chrome.storage.sync.get({ speedList: '1, 1.25, 1.5, 2' }, function (data) {
      speedListInput.value = data.speedList;
    });
  
    // Save the speed list to storage when the "Save" button is clicked
    saveButton.addEventListener('click', function () {
      const speedList = speedListInput.value;
      chrome.storage.sync.set({ speedList }, function () {
        alert('Playback speed list saved!');
      });
    });
  });
  