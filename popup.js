let createItem = document.getElementById('createItem');
var displayUrl = null

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  displayUrl = tabs[0].url;
});

createItem.addEventListener("click", function() {
  var title = document.getElementById("title").value
  var user = document.getElementById("username").value
  var account = document.getElementById("account").value
  var component = document.getElementById("component").value
  var bug = document.getElementById("bug").checked
  var due = document.getElementById("date").value;
  console.log("Date", due)

  var descParts = document.getElementsByClassName("Container-description")
  var desc = "";
  for(var i=0; i < descParts.length; i++)
  {
    if(descParts[i].value.length > 0)
    {
      desc += "*"+descParts[i].name + "* : " + descParts[i].value + "\n\n";
    }
  }


  var accountID = parseInt(account)

  if(title == "")
    document.getElementById("error").classList.add("Container--display")
  else {
    document.getElementById("error").classList.remove("Container--display")
    chrome.extension.getBackgroundPage().backgroundListener(displayUrl, user, title, desc, accountID, component, bug, due)
  }

});
