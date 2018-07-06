let takeScreenshot = document.getElementById('takeScreenshot');

// chrome.storage.sync.get('color', function(data) {
//   takeScreenshot.style.backgroundColor = data.color;
//   takeScreenshot.setAttribute('value', data.color);
// });

takeScreenshot.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'document.body.style.backgroundColor = "' + color + '";'});
  });
};
