// clear interval if one already exists
if(typeof zendesk_refresh != 'undefined'){
	clearInterval(zendesk_refresh)
}

// set interval to click button
zendesk_refresh = setInterval(function(){
	let refresh = $("#main_panes button[data-test-id='views_views-list_header-refresh']");
	refresh.click()
}, 10 * 1000);