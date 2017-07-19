/*
element = 
{
    tagName: String,
    innerHTML: String,
    src: String
}
*/

var pickedElementsList = [];

function handleMessage(request, sender, sendResponse) {
    switch (request.type) {
        case 0:
            if (request.option === 0) {
                if (request.element.tagName.toLocaleLowerCase() === "img") {
                    var table = document.getElementById("myTable");
                    var row = table.insertRow(0);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    cell1.innerHTML = request.element.tagName;
                    cell2.innerHTML = request.element.src;
                } else {
                    var table = document.getElementById("myTable");
                    var row = table.insertRow(0);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    cell1.innerHTML = request.element.tagName;
                    cell2.innerHTML = request.element.innerHTML;
                }
                
                pickedElementsList.push(request.element);

            } else {
                

            }
            break;
    }
}

browser.runtime.onMessage.addListener(handleMessage);

document.addEventListener("click", clickListener);

function clickListener(event) {
    switch (event.target.id) {
        case "start_spy":
            startSpy2();
            break;
        case "stop_spy":
            stopSpy2();
            break;
        case "import_elements_from_spy":
            importElementFromSpy();
            break;
    }
}

function startSpy2() {
    browser.tabs.query({
        currentWindow: false,
        active: true
    }).then((tabs) => {
        browser.tabs.sendMessage(
            tabs[0].id, {
                id: 0,
                name: "start_spy"
            }
        ).then().catch();
    })
}

function stopSpy2() {
    browser.tabs.query({
        currentWindow: false,
        active: true
    }).then((tabs) => {
        browser.tabs.sendMessage(
            tabs[0].id, {
                id: 1,
                name: "stop_spy"
            }
        ).then().catch();
    })
}





/*
var myPort;

browser.tabs.query({
    currentWindow: false,
    active: true
}).then(connectToTab).catch((err) => {
    window.alert("geetingActive err = " + err);
});

function connectToTab(tabs) {
    window.alert("len = " + tabs.length)
    if (tabs.length > 0) {
        myPort = browser.tabs.connect(
            tabs[0].id, {
                name: "scanner"
            }
        );
        myPort.onMessage.addListener(function (m) {
            window.alert("received message " + m.data);
        });

    }
}
*/
/*
Deprecated. Used to work with Port
*/
function startSpy() {
    document.getElementById("headline").innerHTML = "startSpy()";
    myPort.postMessage({
        id: 0,
        name: "start_spy"
    });
}

function stopSpy() {
    myPort.postMessage({
        id: 1,
        name: "stop_spy"
    });
}

function importElementFromSpy() {
    myPort.postMessage({
        id: 2,
        name: "importData"
    });
}


