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