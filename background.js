// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

/***
 * Constants
 *
 */

const initialStorage = {
    'clearedTabs': {

    },
    'nextUrls': {

    },
    'prevUrls': {

    }
};

const defaultWebsites = {
    'facebook.com': 0,
    'youtube.com': 0,
    'reddit.com': 0,
    'twitter.com': 0
};


/***
 * CHROME LISTENERS
 *
 */

chrome.runtime.onStartup.addListener(function () {
    chrome.storage.local.clear();
    chrome.storage.local.set(initialStorage);
})

chrome.runtime.onInstalled.addListener(function () {
    // TODO: remove this
    chrome.storage.local.clear();
    chrome.storage.sync.clear();

    chrome.storage.local.set(initialStorage);
    chrome.storage.sync.set({websites: defaultWebsites});
});


// Navigate to new page
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    const newUrl = changeInfo.url;
    const newHost = getHostName(newUrl);
    const prevUrl = window.sessionStorage[tabId];
    const prevHost = getHostName(prevUrl);

    chrome.storage.sync.get('websites', function(items) {
        const websites = items['websites'];
        if (prevHost !== newHost && newHost in websites) {
            chrome.storage.local.get('clearedTabs', function (items) {

                const clearedTabs = items['clearedTabs'];

                if (!(tabId in clearedTabs)) {

                    // Update number of visits
                    websites[newHost] += 1;

                    chrome.storage.sync.set({websites: websites}, function() {
                        chrome.tabs.update(tabId, {url: "prompt.html"});
                    });

                    chrome.storage.local.get('nextUrls', function(items) {
                        var nextUrls = items['nextUrls'];
                        nextUrls[tabId] = newUrl;
                        chrome.storage.local.set({nextUrls: nextUrls}, function() {

                        });
                    });

                    chrome.storage.local.get('prevUrls', function(items) {
                        var prevUrls = items['prevUrls'];
                        prevUrls[tabId] = prevUrl;
                        chrome.storage.local.set({prevUrls: prevUrls}, function() {

                        });
                    });


                }
            });
        }
    });


    if (changeInfo && changeInfo.status !== 'loading') {
        chrome.storage.local.get('clearedTabs', function (items) {
            // TODO: do something with true/false instead of deleting
            const clearedTabs = items['clearedTabs'];
            delete clearedTabs[tabId];
            chrome.storage.local.set({clearedTabs: clearedTabs});
        });
    }


    if (newUrl) {
        window.sessionStorage[tabId] = newUrl;
    }

});


/***
 * Main Functionality
 *
 */

function goForward(tabId) {
    // TODO: define const for clearedTabs
    chrome.storage.local.get(['clearedTabs', 'nextUrls'], function (items) {
        const clearedTabs = items['clearedTabs'];
        clearedTabs[tabId] = true;
        chrome.storage.local.set({clearedTabs: clearedTabs});

        const nextUrls = items['nextUrls'];
        const url = nextUrls[tabId];
        chrome.tabs.update(tabId, {url: url});
    });
}

function goBack(tabId) {
    chrome.storage.local.get(['clearedTabs', 'prevUrls'], function (items) {
        const clearedTabs = items['clearedTabs'];
        clearedTabs[tabId] = true;
        chrome.storage.local.set({clearedTabs: clearedTabs});

        const prevUrls = items['prevUrls'];
        const url = prevUrls[tabId];
        if (!url) {
            chrome.tabs.remove(tabId);
        } else {
            chrome.tabs.update(tabId, {url: url});
        }

    });
}


/****
 * HELPER FUNCTIONS
 *
 */

function getHostName(url) {
    if (!url) {
        return null;
    }
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    } else {
        return null;
    }
}

function getOrdinalSuffix(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

function showNotification(url, visit_number) {
    const message_string = 'You have visited ' + url + ' ' + visit_number + ' times.';
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/get_started128.png',
        title: url,
        message: message_string
    }, function () {
    });
}