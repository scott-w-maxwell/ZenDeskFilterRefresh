// Set systemState
let systemState = {
  interval: 10 // seconds
}

chrome.storage.local.get('systemState', function(result){
  let isEmpty = Object.keys(result).length === 0;
  if (isEmpty){
    chrome.storage.local.set({'systemState': systemState})
  }else{
    systemState.interval = result.systemState.interval
  }
})

chrome.storage.local.set({'systemState': systemState})

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.history.onVisited.addListener((visited_site) => {
  let tab = getCurrentTab()
  tab.then(function (tab) {

    // Change visited_site to just the URL data
    visited_site = new URL(visited_site.url)

    // Get full URL for string comparison
    visited_url = visited_site.host + visited_site.pathname

    // Only run this script for urls containing .zendesk.com/agent
    if (visited_url.indexOf('.zendesk.com/agent/filters') != -1) {
      chrome.scripting.executeScript(
        {
          target: { 'tabId': tab.id, allFrames: true },
          files: ['jquery-3.6.3.min.js', 'content.js'],
        });
    }

  })
})

chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse){
    if(request.action == 'update'){
      systemState.interval = request.interval
      chrome.storage.local.set({'systemState': systemState})
      console.log('Updated interval to: ' + request.interval + " seconds")
    }

    if(request.action == 'getInterval'){
      sendResponse(systemState.interval)
    }
  })