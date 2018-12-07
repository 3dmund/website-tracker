// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function onKeyPress() {
    var key = window.event.keyCode;

    // If the user has pressed enter
    if (key === 13) {
        console.log("enter pressed");
        let url = document.getElementById("addSiteField").value.trim();
        console.log(url);

        // TODO: check if already exists
        chrome.storage.sync.get('websites', function (items) {
            const websites = items['websites'];
            websites[url] = 0;
            chrome.storage.sync.set({websites: websites}, function() {
                removeTable();
                constructTable();
                document.getElementById("addSiteField").focus();
            });
        });
    }
}

function onRemovePress(i) {
    let td = document.getElementById(i);
    let toRemove = td.innerText;
    console.log(toRemove);

    chrome.storage.sync.get('websites', function (items) {
        const websites = items['websites'];
        delete websites[toRemove];
        chrome.storage.sync.set({websites: websites}, function() {
            removeTable();
            constructTable();
        });
    });

}

function removeTable() {
    let table = document.getElementById('table');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
}

function constructTable() {
    let table = document.getElementById('table');
    let tbody = document.createElement('tbody');

    var topRow = document.createElement('tr');
    var dummyCell = document.createElement('td');
    dummyCell.className = 'buttonCell';
    topRow.appendChild(dummyCell);
    var addCell = document.createElement('td');
    addCell.innerHTML =
        '<textarea data-limit-rows="true" rows="1" name="Add" placeholder="Add website..." id="addSiteField"></textarea>'
    addCell.className = 'siteCell';
    topRow.appendChild(addCell);
    tbody.appendChild(topRow);

    chrome.storage.sync.get('websites', function (items) {
        const websites = items['websites'];

        Object.keys(websites).forEach(function(key, i) {
            var tr = document.createElement('tr');

            var buttonTd = document.createElement('td');
            buttonTd.className = 'buttonCell';
            var btn = document.createElement('input');
            btn.type = "button";
            btn.className = "removeButton";

            btn.addEventListener('click', function () {
                onRemovePress(i.toString());
            });
            buttonTd.appendChild(btn);

            var siteTd = document.createElement('td');
            siteTd.className = 'siteCell';
            var text = document.createElement('div');
            text.className = 'siteText';
            text.id = i.toString();
            text.appendChild(document.createTextNode(key));
            siteTd.appendChild(text);

            var visitsTd = document.createElement('td');
            visitsTd.className = 'visitsCell';
            var numVisitsDiv = document.createElement('div');
            var numVisits = websites[key];
            var end = " visits";
            if (numVisits === 1) {
                end = " visit";
            }
            numVisitsDiv.appendChild(document.createTextNode(numVisits + end));
            visitsTd.appendChild(numVisitsDiv);

            tr.appendChild(buttonTd);
            tr.appendChild(siteTd);
            tr.appendChild(visitsTd);
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        document.getElementById("addSiteField").addEventListener("keypress", onKeyPress);
    });
}

constructTable();
