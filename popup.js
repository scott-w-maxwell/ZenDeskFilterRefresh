var saveButton = document.getElementById('save')

saveButton.addEventListener('click', ()=>{

    var newInterval = document.getElementById('interval').value
    console.log(newInterval)
    // Send value to background.js
    chrome.runtime.sendMessage({action: 'update', interval:newInterval})
})


function intervalFill(currentInterval){
    document.getElementById('interval').value = currentInterval
}

chrome.runtime.sendMessage({action: 'getInterval'}, (response)=>{
    if(response.interval){
        intervalFill(response.interval)
    }else{
        setTimeout(()=>{
            intervalFill(response)
        }, "300")
    }
})