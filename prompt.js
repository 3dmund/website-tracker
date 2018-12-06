

document.addEventListener('DOMContentLoaded', function() {

    let yes = document.getElementById('yes');
    yes.addEventListener('click', function() {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		  const tabId = tabs[0]['id'];
		  goForward(tabId);
		});
    });

    let no = document.getElementById('no');
    no.addEventListener('click', function() {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            const tabId = tabs[0]['id'];
            goBack(tabId);
        });
    });

});