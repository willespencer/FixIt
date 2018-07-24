let createItem = document.getElementById('createItem');
var displayUrl = null

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  displayUrl = tabs[0].url;
});

createItem.addEventListener("click", function() {
  var title = document.getElementById("title").value
  var ask = document.getElementById("ask").value
  var types = document.getElementById("types").value
  var user = document.getElementById("username").value
  var account = document.getElementById("account").value
  var component = document.getElementById("component").value
  var bug = document.getElementById("bug").checked
  var prod = document.getElementById("prod").checked;
  var due = document.getElementById("date").value;
  var ycdesk = document.getElementById("ycdesk").value;

  var accountID = parseInt(account)

  if(title == "" || ask == "" || types == "") //required parameters
    document.getElementById("error").classList.add("Container--display")
  else {
    desc = createDescription(prod)
    document.getElementById("error").classList.remove("Container--display")
    chrome.extension.getBackgroundPage().backgroundListener(displayUrl, user, title, desc, accountID, component, bug, due, ycdesk)
  }

});

function createDescription(prod)
{
  var descParts = document.getElementsByClassName("Container-description")
  var description = "";
  for(var i=0; i < descParts.length; i++)
  {
    if(descParts[i].value.length > 0)
    {
      description += "*"+descParts[i].name + "* : " + descParts[i].value + "\n\n";
    }
  }
  if(prod)
  {
    description += "*Straight to Prod*\n"
  }

  return description
}
