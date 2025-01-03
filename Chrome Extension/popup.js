var saveButton = document.getElementById('save')

saveButton.addEventListener('click', async ()=>{
    var newInterval = document.getElementById('interval').value;
    
    // Check if not a number
    if( isNaN(parseInt(newInterval))){
        var message = document.getElementById('message');
        message.innerHTML = "Not a valid interval";
        message.classList = "show";
       setTimeout(()=>{
        message.classList = "hidden";
       }, "3000");

    }else{
        var message = document.getElementById('message');
        message.innerHTML = "Interval Saved & Updated";

        // get active tabs
        const tabs = await new Promise((resolve)=>{
            chrome.tabs.query({active: true}, (tabs)=>{
                resolve(tabs);
            });
        });
        
        for(const tab of tabs){
            // Send value to content script
            chrome.tabs.sendMessage(tab.id, {action: "update", seconds:newInterval});
        }

        chrome.storage.local.set({"interval": newInterval});

        var message = document.getElementById('message');
        message.classList = "show";
       setTimeout(()=>{
        message.classList = "hidden";
       }, "3000");
    }
});

const intervalFill = async () => {
    const interval = await new Promise((resolve)=>{
        chrome.storage.local.get("interval", (result)=>{
            resolve(result['interval']);
        });
    });

    if(interval)
        document.getElementById('interval').value = interval
}

intervalFill();


  
  
  
  
  







