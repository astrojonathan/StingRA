function getselection(info) {
    getLocation();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            parseResults(xhttp);
        }
    };
    xhttp.open("GET", "http://cdsweb.u-strasbg.fr/cgi-bin/nph-sesame/-ofx/SNVA?" + info, true);
    xhttp.send();
}

function parseResults(xml) {
    
    var xmlDoc = xml.responseXML;
    
    var data = xmlDoc.getElementsByTagName("Sesame")[0].getElementsByTagName("Target")[0].getElementsByTagName("Resolver")[0];
    var name = data.getElementsByTagName("oname")[0].innerHTML;
    ra = data.getElementsByTagName("jradeg")[0].innerHTML;
    dec = data.getElementsByTagName("jdedeg")[0].innerHTML;

   


    var hd = data.getElementsByTagName("jpos")[0].innerHTML;
    var hdRa = hd.split(" ")[0];
    var hdDec = hd.split(" ")[1];

    document.getElementById("objectname").innerHTML = name;
    document.getElementById("ra").innerHTML = ra;
    document.getElementById("dec").innerHTML = dec;
    document.getElementById("dssimage").src = "http://archive.stsci.edu/cgi-bin/dss_search?v=poss2ukstu_red&r=" + ra + "&d=" + dec + "&e=J2000&h=3.4&w=3.4&f=gif&c=none&fov=NONE&v3=";
    document.getElementById("wwtlink").href = "http://www.worldwidetelescope.org/webclient/#/ra=" + Number(ra) / 15 + "&dec=" + dec + "&fov=0.29329";
    document.getElementById("wwtlink").target = "_blank";
    document.getElementById("simbadlink").href = "http://simbad.u-strasbg.fr/simbad/sim-coo?Coord=" + ra + "+" + dec + "&Radius=2m&Radius.unit=arcmin&output.max=1&output.format=html";
    document.getElementById("simbadlink").target = "_blank";

    setSkyChart();

    var mags = data.getElementsByTagName("mag");

    var magDiv = document.getElementById("mags");
   
    if (mags != null) {

        for(let mag of mags) {
            var lDiv = document.createElement('div');

            lDiv.id = mag.getAttribute("band");

            lDiv.className = 'label';
            lDiv.innerHTML = mag.getAttribute("band") + ": ";
            magDiv.appendChild(lDiv);

            var vDiv = document.createElement('div');

            vDiv.className = 'data';

            vDiv.innerHTML = mag.getElementsByTagName("v")[0].innerHTML;

            magDiv.appendChild(vDiv);

            magDiv.appendChild(document.createElement('br'));
        }
    }
}

function loadData() {
    chrome.tabs.executeScript({
        code: "window.getSelection().toString();"        
    }, function (selection) {
       //a//lert(selection);
        getselection(selection);
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
//chrome.browserAction.onClicked.addListener(function(tab) {
//    loadData();
//});

//window.onload = function () {
//    console.log("onload" + Date())
//}

document.addEventListener('DOMContentLoaded', function () {
    loadData();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, function (positionError) {
            console.error(positionError);
        });
    } else {
        //x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
var ra = 0;
var dec = 0;

var lat = 0;
var lng = 0;

function showPosition(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
  
    setSkyChart();
}

function setSkyChart() {
    document.getElementById("skychart").src = "http://www.worldwidetelescope.org/wwtweb/starchart.aspx?lat=" + lat + "&lng=" + lng + "&dec=" + dec + "&ra=" + ra + "&width=200&height=200";
    document.getElementById("chartlink").href = "http://www.worldwidetelescope.org/wwtweb/starchart.aspx?lat=" + lat + "&lng=" + lng + "&dec=" + dec + "&ra=" + ra + "&width=800&height=800";
    document.getElementById("chartlink").target = "_blank";
    document.getElementById("lat").innerHTML = lat.toString();
    document.getElementById("lng").innerHTML = lng.toString();
   
}
