//Calls what is needed for JIRA
function jiraSetup(url, image) {
  var xhr = new XMLHttpRequest();
  createIssue(xhr, url, image);
}

//Creates an Issue in JIRA
function createIssue(xhr, url, image){
  var projID = 11300 //CONSULTING ID
  var issueID = 10401 //Software Dev type
  var accountID = 85 //Default Yext Account
  json = JSON.stringify(createJSON(projID, issueID, accountID, url));

  xhr.onreadystatechange=function() {
  if (xhr.readyState === 4){   //if complete
      if(xhr.status === 201){  //check if "OK" (200
          var result = JSON.parse(xhr.responseText);
          addAttachment(image, result.key);
      } else {
          console.log("Error", xhr.responseText);
      }
    }
  }

  xhr.open("POST", "https://yexttest.atlassian.net/rest/api/2/issue/");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(json);
}

//Creates JSON needed to create an issue
function createJSON(proj, issue, account, url){
  json =
  {
      "fields": {
          "project": {
            "id": proj,
          },
          "issuetype": {
            "id": issue,
          },
          "summary": "Chrome Extension test issue",
          "assignee": {
              "name": "wspencer"
          },
          // "reporter": {
          //     "name": "tterbush"
          // },
          "description": "Problem seen at this URL: " + url,
          "customfield_11000": account,
      }
  } ;

  return json;
}

//Used to log Project and Issue types that can be used to create an Issue
function printMeta(){
  xhr.open("GET", "https://yexttest.atlassian.net/rest/api/2/issue/createmeta", false);

  xhr.onreadystatechange=function() {
    if (xhr.readyState === 4){   //if complete
        if(xhr.status === 200){  //check if "OK" (200)
          var result = JSON.parse(xhr.responseText);

          //code for logging projects in createmeta
          var projects = result.projects
          for(var x = 0; x < projects.length; x++)
          {
            console.log("PROJECT:", projects[x].name, projects[x].id, projects[x].key);
            if(projects[x].id == 11300) //Consulting
            {
              var types = projects[x].issuetypes

              //code for logging issue types
              for(var i = 0; i < types.length; i++)
              {
                console.log(types[i].name, types[i].id);
              }
            }
          }
        } else {
            console.log("Error", xhr.responseText);
        }
      }
    }

  xhr.send();
}

function addAttachment(image, key){
  var xhr = new XMLHttpRequest();

  var formData = new FormData();
  formData.append("file", image, "Screenshot.jpeg");

  xhr.open("POST", "https://yexttest.atlassian.net/rest/api/2/issue/"+key+"/attachments/", false);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("X-Atlassian-Token", "no-check");
  xhr.onreadystatechange=function() {
    if (xhr.readyState === 4){   //if complete
      if(xhr.status === 200){  //check if "OK" (200)
        var result = JSON.parse(xhr.responseText);
        var jiraURL = "https://yexttest.atlassian.net/browse/" + key
        chrome.tabs.create({ url: jiraURL });
      }
      else {
        console.log("Error", xhr.responseText);
      }
    }
  }

  xhr.send(formData);
}

//Retrieve information about issue, used to test the add attachment function
function getIssue(key){
  var xhr = new XMLHttpRequest();

  xhr.open("GET", "https://yexttest.atlassian.net/rest/api/2/issue/"+key+"/", false);
  xhr.onreadystatechange=function() {
    if (xhr.readyState === 4){   //if complete
      if(xhr.status === 200){  //check if "OK" (200)
        var result = JSON.parse(xhr.responseText);
        console.log(result)
      }
      else {
        console.log("Error", xhr.responseText);
      }
    }
  }

  xhr.send();
}

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}
