// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// $(document).ready(function() {
//   $('#yes').click(function() {
//     console.log("yes");
//     testNotification();
//   });
// });


//
// VARIABLES
//
// const tracked = new Set(['facebook.com', 'youtube.com', 'reddit.com', 'purple.com', 'producthunt.com']);
const tracked = {
    'facebook.com': 0,
    'youtube.com': 0,
    'mail.google.com': 0,
    'reddit.com': 0,

    // Filler
    'purple.com': 0,
    'producthunt.com': 0,
};
var tabIdToPreviousUrl = {};

/***
 * CHROME LISTENERS
 */

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({color: '#3aa757'}, function () {
        console.log('The color is green.');
    });
    showNotification();
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'developer.chrome.com'},
                // pageUrl: {hostEquals: 'www.youtube.com'},
            })],
            // actions: [new chrome.declarativeContent.ShowPageAction(), new showNotification()]
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});


// Navigate to new page

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log("onUpdated");

    const nextConst = "next_";
    const prevConst = "prev_";

    console.log("newUrl, newHost, prevUrl, prevHost");
    const newUrl = changeInfo.url;
    const newHost = getHostName(newUrl);
    console.log(newUrl);
    console.log(newHost);

    const prevUrl = window.sessionStorage[tabId];
    const prevHost = getHostName(prevUrl);
    console.log(prevUrl);
    console.log(prevHost);

    // chrome.tabs.update(tabId, {url: "prompt.html"});


    if (prevHost !== newHost && newHost in tracked) {
        tracked[newHost] += 1;
        showNotification(newHost, tracked[newHost]);
        chrome.tabs.update(tabId, {url: "prompt.html"});


        // Update tabid with next and previous
        const nextStr = nextConst + tabId;
        chrome.storage.local.set({nextStr: newUrl}, function () {
            console.log('Value is set to ' + newUrl);
        });

        const prevStr = prevConst + tabId;
        const prevUrl = window.sessionStorage[tabId];
        chrome.storage.local.set({prevStr: prevUrl}, function () {
            console.log('Value is set to ' + prevUrl);
        });

    }

    window.sessionStorage[tabId] = newUrl;
});


chrome.history.onVisited.addListener(showNotification);

/***
 * Main Functionality
 * @param content
 */

function navigateToGoogle(tabId) {
    chrome.tabs.update(tabId, {url: "https://www.google.com/"});
}


function test(content) {
    console.log("Sent content is: " + content);
}


/****
 *
 * HELPER FUNCTIONS
 *
 * @param url
 * @returns {*}
 */

// function resetVisits() {
//   for (website in tracked) {
//     tracked[website] = 0;
//   }
// }

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

var getLocation = function (href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

function showNotification(url, visit_number) {
    console.log('showing notification');
    const message_string = 'You have visited ' + url + ' ' + visit_number + ' times.';
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/get_started128.png',
        title: url,
        message: message_string
    }, function () {
        console.log('Popup done');
    });
}

function testNotification(content) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/get_started128.png',
        title: test,
        message: content
    }, function () {
        console.log('Popup done');
    });
}



// document.getElementById("yes").onclick = function () { 
//   alert('hello!'); 
// };


// chrome.runtime.onInstalled.addListener(function() {
//   chrome.storage.sync.set({color: '#3aa757'}, function() {
//     console.log('The color is green.');
//   });
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//     chrome.declarativeContent.onPageChanged.addRules([{
//       conditions: [new chrome.declarativeContent.PageStateMatcher({
//         pageUrl: {hostEquals: 'developer.chrome.com'},
//         // pageUrl: {hostEquals: 'www.youtube.com'},
//       })],
//       actions: [new chrome.declarativeContent.ShowPageAction()]
//     }]);
//   });
// });
