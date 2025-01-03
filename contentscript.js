var zendeskRefreshId;

const clickRefresh = () => {
    const refresh = document.querySelectorAll("[data-test-id='views_views-list_header-refresh']")[0];
    // Only click when page is a filter/view
    if(refresh !== undefined && window.location.href.includes(".zendesk.com/agent/filters/")){
      console.log("Clicked refresh button");
      refresh.click();
    }
}

const setupInterval = () => {
  chrome.storage.local.get("interval", (result)=>{
    let seconds = 10; // default interval
    if(result['interval'])
      seconds = result['interval']
    
    if(zendeskRefreshId)
      clearInterval(zendeskRefreshId)

    zendeskRefreshId = setInterval(clickRefresh, seconds * 1000);
  });
}

// Update script
chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
  if(message.action === "update"){
      const seconds = message.seconds;
      clearInterval(zendeskRefreshId);
      zendeskRefreshId = setInterval(clickRefresh, seconds * 1000);
  }
});

// Restore interval after inactivity 
window.addEventListener("focus", ()=>{
  setupInterval();
});

setupInterval();