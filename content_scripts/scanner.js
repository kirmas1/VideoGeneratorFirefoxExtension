var pickedElementsList = [];
//var messagingPort;

/*
send message to the panel. 
type = type of message. 0 = element add/remove
element  = the element
option (int) = 0-Add, 1-Remove
*/
function sendMessageToPanel(type, element, option) {
    browser.runtime.sendMessage({
        type: type,
        element: {tagName: element.tagName,
                 innerHTML: element.innerHTML || null,
                 src: element.src || null},
        option: option
    });

}

function clickListener(e) {


    
    var ele = e.target;
    var index = pickedElementsList.indexOf(ele);

    if (index == -1) {

        if (ele.tagName.toLowerCase() === "img") {
            ele.style.border = "5px solid blue";
        } else
            ele.style.border = "5px solid pink";
        pickedElementsList.push(ele);
        sendMessageToPanel(0, ele, 0);

    } else {
        ele.style.border = "";
        pickedElementsList.splice(index, 1);
        sendMessageToPanel(0, ele, 1);
    }

    e.preventDefault();
    e.stopPropagation();
    return false;
}

function mouseoverListener(e) {

    if (pickedElementsList.indexOf(e.target) == -1) {
        if (e.target.tagName.toLowerCase() === "img")
            e.target.style.border = "5px dotted blue";
        else
            e.target.style.border = "5px dotted pink";
    }
}

function mouseoutListener(e) {
    if (pickedElementsList.indexOf(e.target) == -1)
        e.target.style.border = "";
}

function mouseupListener(e) {
    var t = (document.all) ? document.selection.createRange().text : document.getSelection();

    if (t.toString().length > 0) {

        if (t.anchorNode.parentElement) {
            t.anchorNode.parentElement.innerHTML = t.anchorNode.parentElement.innerHTML.replace(t.toString(), `<span>${t.toString()}</span>`);
        }
    }

}

function startSpy() {

    document.addEventListener("click", clickListener, true);

    document.addEventListener("mouseover", mouseoverListener);

    document.addEventListener("mouseout", mouseoutListener);

    document.addEventListener("mouseup", mouseupListener);
}

function stopSpy() {

    document.removeEventListener("click", clickListener, true);

    document.removeEventListener("mouseover", mouseoverListener);

    document.removeEventListener("mouseout", mouseoutListener);

    document.removeEventListener("mouseup", mouseupListener);
}

function exportData() {

}


function messageListener(message) {
    switch (message.id) {
        case 0:
            startSpy();
            break;
        case 1:
            stopSpy();
            break;
        case 2:
            exportData();
            break;
    }
}

browser.runtime.onMessage.addListener(messageListener);

/*
function messagingPortListener(message) {
    switch (message.id) {
        case 0:
            startSpy();
            break;
        case 1:
            stopSpy();
            break;
        case 2:
            exportData();
            break;
    }
}


function connected(p) {
    messagingPort = p;
    messagingPort.postMessage({
        data: "hi there panel!"
    });

    messagingPort.onMessage.addListener(messagingPortListener);
}

browser.runtime.onConnect.addListener(connected);
*/
