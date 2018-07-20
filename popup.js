let createItem = document.getElementById('createItem');
var displayUrl = null

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  displayUrl = tabs[0].url;
});

createItem.addEventListener("click", function() {
  var user = document.getElementById("username").value
  var title = document.getElementById("title").value
  var desc = document.getElementById("description").value
  var account = document.getElementById("account").value
  var component = document.getElementById("component").value
  var bug = document.getElementById("bug").checked

  var accountID = parseInt(account)

  chrome.extension.getBackgroundPage().backgroundListener(displayUrl, user, title, desc, accountID, component, bug)
});
