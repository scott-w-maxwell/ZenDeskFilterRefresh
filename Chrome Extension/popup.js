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

chrome.runtime.sendMessage({action: 'getInterval'}, function(response) {
    if (response !== undefined) {
      // Access the interval property if it's not undefined
        intervalFill(response.systemState.interval)
    }
  });


  
  
  
  
  







