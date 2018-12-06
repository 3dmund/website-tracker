// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function onKeyPress() {
    var key = window.event.keyCode;

    // If the user has pressed enter
    if (key === 13) {
        console.log("enter pressed");
        let url = document.getElementById("add").value.trim();
        console.log(url);

        // addUrl(url);
        // TODO: check if already exists
        chrome.storage.sync.get('websites', function (items) {
            const websites = items['websites'];
            websites[url] = 0;
            chrome.storage.sync.set({websites: websites}, function() {
                removeTable();
                constructTable();
            });
        });
    }
}

function onRemovePress(i) {
    // var td=btn.parentNode.parentNode;
    // console.log(td.html);
    // p.parentNode.removeChild(p);

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

    chrome.storage.sync.get('websites', function (items) {
        const websites = items['websites'];
        console.log(websites);

        Object.keys(websites).forEach(function(key, i) {
            console.log(key, websites[key]);
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            // td.id = i.toString();

            var btn = document.createElement('input');
            btn.type = "button";
            btn.className = "btn";
            // btn.id = i.toString();
            console.log(i);
            // btn.value = entry.email;

            // document.getElementById(i.toString()).addEventListener('click', onRemovePress);

            btn.addEventListener('click', function () {
                onRemovePress(i.toString());
            });
            

            // btn.onclick = (function(entry) {return function() {chooseUser(entry);}})(entry);


            var text = document.createElement('div');
            text.id = i.toString();
            text.appendChild(document.createTextNode(key));

            var numVisits = document.createElement('div');
            numVisits.appendChild(document.createTextNode(websites[key]));

            // td.appendChild(document.createTextNode(key));
            td.appendChild(btn);
            td.appendChild(text);
            td.appendChild(numVisits);
            tr.appendChild(td);
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        table.insertRow(0).innerHTML = '<tr><td><textarea data-limit-rows="true" rows="1" name="Add" placeholder="Add website..." id="add" style = "resize: none; width:100%;"></textarea></td></tr>';
        document.getElementById("add").addEventListener("keypress", onKeyPress);
    });
}

constructTable();
