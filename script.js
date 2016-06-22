function getselection(info, tab) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            parseResults(xhttp);
        }
    };
    xhttp.open("GET", "http://cdsweb.u-strasbg.fr/cgi-bin/nph-sesame/-ox/SNVA?" + info.selectionText, true);
    xhttp.send();
}

function parseResults(xml) {
    chrome.tabs.create({
        url: chrome.extension.getURL('popup.html'),
        active: false
    }, function (tab) {
        // After the tab has been created, open a window to inject the tab
        chrome.windows.create({
            tabId: tab.id,
            type: 'popup',
            focused: true
            // incognito, top, left, ...
        });
    });

    var xmlDoc = xml.responseXML;
    
    var data = xmlDoc.getElementsByTagName("Sesame")[0].getElementsByTagName("Target")[0].getElementsByTagName("Resolver")[0];
    var ra = data.getElementsByTagName("jradeg")[0].innerHTML;
    alert(ra);
}

function loadData() {
    chrome.tabs.executeScript({
        code: "window.getSelection().toString();"
    }, function (selection) {
        getselection(selection[0], null);
    });
}

function parseRaDec(coord) {

}

chrome.contextMenus.create({
  title: "Details: %s", 
  contexts:["selection"], 
  onclick: getselection,
});

//window.addEventListener('load', function (evt) {
//    //loadData();
//});;

//window.addEventListener('activate', function (evt) {
//   // loadData();
//});;
chrome.browserAction.onClicked.addListener(function(tab) {
    loadData();
});

window.onload = function () {
    console.log("onload" + Date())
}