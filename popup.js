var saveButton = document.getElementById('save')

saveButton.addEventListener('click', ()=>{

    var newInterval = document.getElementById('interval').value
    console.log(newInterval)
    // Send value to background.js
    chrome.runtime.sendMessage({action: 'update', interval:newInterval})
})