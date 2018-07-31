let createItem = document.getElementById('createItem');
var displayUrl = null

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  displayUrl = tabs[0].url;
});

addAccountOptions()

createItem.addEventListener("click", function() {
  var title = document.getElementById("title").value
  var ask = document.getElementById("ask").value
  var types = document.getElementById("types").value
  var user = document.getElementById("username").value
  var account = document.getElementById("account").name
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
    document.getElementById("success").classList.add("Container--display")
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
      description += "*"+descParts[i].name + ":* " + descParts[i].value + "\n\n";
    }
    if(descParts[i].id == "ask")
    {
      description +=  "!Screenshot.jpeg|thumbnail!\n\n" //embeds screenshot into ask
    }
  }
  if(prod)
  {
    description += "*Straight to Prod*\n"
  }

  return description
}

var inputs = document.getElementsByClassName("Container-saved");
for(var input of inputs)
{
  //listener to store data on change
  input.addEventListener('change', function (evt) {
    var val = this.value;
    var id = this.id;

    //special checkbox conditionals
    if (this.classList.contains("Container-checkbox"))
      if (this.checked == false)
        val = "off"
      else
        val = "on"

    var testPrefs = JSON.stringify({
        'val': val
    });
    var jsonfile = {};
    jsonfile[id] = testPrefs;

    chrome.storage.sync.set(jsonfile);
  });
  retrieveData(input);
}

function retrieveData(element){
  chrome.storage.sync.get(element.id, function(obj) {
    console.log(obj)
    var json = JSON.parse(obj[element.id])
    if(json.val != undefined)
    {
      element.value = json.val;
      if(element.classList.contains("Container-checkbox") && json.val == "on")
      {
        element.checked = true;
      }
    }
  });
}

function addAccountOptions()
{
  var xhr = new XMLHttpRequest();
  var url = "http://jenkins-consulting.yext.com:8080/job/Jira%20List%20Accounts/ws/accounts.json"
  xhr.open("GET", url, true);

  xhr.onreadystatechange=function() {
    if (xhr.readyState === 4){   //if complete
      if(xhr.status === 200){  //check if "OK" (200)
        var accData = JSON.parse(xhr.responseText);

        var accInput = document.getElementById("account");
        var map = new Map();
        for(var key in accData)
        {
          var option = document.createElement("option");
          map.set(key, accData[key])
        }

        autocomplete(accInput, map);
      }
      else {
        console.log("Error", xhr.responseText);
      }
    }
  }

  xhr.send();
}

function autocomplete(inp, map) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      var currCount = 0;
      /*for each item in the array...*/
      for (var key of map.keys()) {
        /*check if the item starts with the same letters as the text field value:*/
        if (map.get(key).substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          if(currCount <= 11) //max number of items to display at one time
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          b.id = key;
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + map.get(key).substr(0, val.length) + "</strong>";
          b.innerHTML += map.get(key).substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + map.get(key) + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              inp.name = b.id;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
          currCount++;
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}
