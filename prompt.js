

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

function populateNumVisits() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        const tabId = tabs[0]['id'];
        chrome.storage.local.get('nextUrls', function (items) {
            const nextUrls = items['nextUrls'];
            const url = nextUrls[tabId];
            const host = getHostName(url);
            chrome.storage.sync.get('websites', function (items) {
                const websites = items['websites'];
                const numVisits = websites[host];
                let text = document.getElementById('numVisits');
                text.appendChild(document.createTextNode(getOrdinalSuffix(numVisits) + " attempted visit"));
            });
        });
    });
}

populateNumVisits();