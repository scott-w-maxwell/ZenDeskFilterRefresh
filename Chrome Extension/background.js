let systemState = {
  interval: 10 // seconds
};

// Change default interval to set interval
chrome.storage.local.get('systemState', function(result){
  let isEmpty = Object.keys(result).length === 0;
  
  // Extensions was installed
  if (isEmpty){
    console.log('Setting interval in storage to 10')
    chrome.storage.local.set({'systemState': systemState})
  }else{
    console.log('unique interval value exists')
    systemState.interval = result.systemState.interval
  }
});

async function getZenDeskTabs() {

  let queryOptions = { url:"https://*.zendesk.com/agent/filters/*" };

  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tabs] = await chrome.tabs.query(queryOptions);

  console.log(tabs);

  return tabs;
}

// Function that runs on ZenDesk Page
function clickRefresh(interval = 1){

  // Clear interval if one already exists
  if(zendesk_refresh !== undefined){
    clearInterval(zendesk_refresh)
  }

  // Set interval to click button
  zendesk_refresh = setInterval(function(){
    let refresh = document.querySelectorAll("[data-test-id='views_views-list_header-refresh']")[0];
    if(refresh !== undefined){
      refresh.click();
    }
  }, interval * 1000);
}

chrome.webRequest.onBeforeRequest.addListener((request)=>{
  if(request.url !== undefined){
      injectScript(request.tabId, clickRefresh);
  }
}, {urls: ['*://*.zendesk.com/agent/filters/*'], types: ["main_frame", "sub_frame", "xmlhttprequest"] });

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse){

    // If save button was pressed in popup
    if(request.action == 'update'){

      // Set new interval to systemState object
      systemState.interval = request.interval

      // Set new interval in storage
      chrome.storage.local.set({'systemState': systemState})

      // Show that the interval was loaded
      // console.log('Updated interval to: ' + request.interval + " seconds")

      let tabs = getZenDeskTabs();
      tabs.then((tabs)=>{
        
        // Inject script to click refresh button into each ZenDesk Tab
        tabs.foreach((tab)=>{
          injectScript(tab.id, clickRefresh, [systemState.interval]);
        });

      });
    }

    // If popup was opened
    if (request.action == 'getInterval') {
      chrome.storage.local.get('systemState', function(result) {
        console.log(result)
        sendResponse(result);
      })
      return true
    }

});


function injectScript(tabId, injection, arguments = [10]){

  // Injecting a JS file
  if(typeof(injection) === 'string'){
    chrome.scripting.executeScript(
      {
        target: { 'tabId': tabId, allFrames: true },
        func: injectScript,
        args: arguments
      });
  }

  // Injecting a function
  if(typeof(injection) === 'function'){
    chrome.scripting.executeScript(
      {
        target: { 'tabId': tabId, allFrames: true },
        func: injectScript,
        args: arguments
      });
  }
}
