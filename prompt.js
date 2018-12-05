function clickHandler(e) {
  // setTimeout(awesomeTask, 1000);
  console.log("Yes");
  alert('hello!'); 
  // testNotification();
}

document.addEventListener('DOMContentLoaded', function() {
    var yes = document.getElementById('yes');
    // onClick's logic below:
    yes.addEventListener('click', function() {
        console.log("Yes");
        // testNotification();
        // alert('hello!'); 



        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		  console.log(tabs[0]);
		  const tabId = tabs[0]['id'];

	  	  chrome.storage.local.get(['next_' + tabId], function(result) {
            console.log('Navigating to ' + result.key);
          });

		  // chrome.tabs.update(tabs[0]['id'],{url:"https://www.linkedin.com/"});
		});

		
        
    });
});