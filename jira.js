//Calls what is needed for JIRA
function jiraSetup() {
  var xhr = new XMLHttpRequest();
  createIssue(xhr);
}

//Creates an Issue in JIRA
function createIssue(xhr){
  var projID = 11300 //CONSULTING ID
  var issueID = 10401 //Software Dev type
  var accountID = 85 //Default Yext Account
  json = JSON.stringify(createJSON(projID, issueID, accountID));

  xhr.onreadystatechange=function() {
  if (xhr.readyState === 4){   //if complete
      if(xhr.status === 200){  //check if "OK" (200)
          console.log("Success", xhr.statusText);
          var result = JSON.parse(xhr.responseText);
          console.log(result);
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
function createJSON(proj, issue, account){
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
          "description": "This was a test issue created from a Chrome Extension",
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
          console.log("Success", xhr.statusText);
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
}
