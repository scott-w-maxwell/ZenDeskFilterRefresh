var saveButton = document.getElementById('save')

saveButton.addEventListener('click', ()=>{

    var newInterval = document.getElementById('interval').value
    
    // Check if not a number
    if( isNaN(parseInt(newInterval))){

        var message = document.getElementById('message')
        message.innerHTML = "Not a valid interval"
        message.classList = "show"
       setTimeout(()=>{
        message.classList = "hidden"
       }, "3000");

    }else{
        console.log(newInterval)

        var message = document.getElementById('message')
        message.innerHTML = "Interval Saved & Updated"
        // Send value to background.js
        chrome.runtime.sendMessage({action: 'update', interval:newInterval})
        var message = document.getElementById('message')
        message.classList = "show"
       setTimeout(()=>{
        message.classList = "hidden"
       }, "3000");
    }

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