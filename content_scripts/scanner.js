var pickedElementsList = [];
//var messagingPort;

function textElement(innerHTML) {
    this.type=0;
    this.innerHTML = innerHTML;
}

function imageElement(src) {
    this.type=1;
    this.src = src;
}

/*
send message to the panel. 
type = type of message. 0 = element add/remove
element  = the element
option (int) = 0-Add, 1-Remove
*/
function sendMessageToPanel(type, element, option) {
//    browser.runtime.sendMessage({
//        type: type,
//        element: {
//            tagName: element.tagName,
//            innerHTML: element.innerHTML || null,
//            src: element.src || null
//        },
//        option: option
//    });
        browser.runtime.sendMessage({
        type: type,
        element: element,
        option: option
    });

}

function clickListener(e) {

    let ele = e.target;
    let element;
    if (ele.tagName.toLowerCase() === "img")
        element = new imageElement(ele.src);
    else
        element = new textElement(ele.innerHTML);
    
    var index  = pickedElementsList.findIndex((ele) => {
            return e.target.tagName == 'IMG' ? ele.src == e.target.src : ele.innerHTML == e.target.innerHTML;
        }) 

    if (index == -1) {

        if (ele.tagName.toLowerCase() === "img") {
            ele.style.border = "5px solid blue";
        } else
            ele.style.border = "5px solid red";

        pickedElementsList.push(element);
        sendMessageToPanel(0, element, 0);

    } else {
        ele.style.border = "";
        pickedElementsList.splice(index, 1);
        sendMessageToPanel(0, element, 1);
    }

    e.preventDefault();
    e.stopPropagation();
    return false;
}

function mouseoverListener(e) {

//    let element;
//    if (e.target.tagName.toLowerCase() === "img")
//        element = new imageElement(e.target.src);
//    else
//        element = new textElement(e.target.innerHTML);

    if (pickedElementsList.findIndex((ele) => {
            return e.target.tagName == 'IMG' ? ele.src == e.target.src : ele.innerHTML == e.target.innerHTML;
        }) === -1) {
        if (e.target.tagName.toLowerCase() === "img")
            e.target.style.border = "5px dotted blue";
        else
            e.target.style.border = "5px dotted red";
    }
}

function mouseoutListener(e) {

    if (pickedElementsList.findIndex((ele) => {
            return e.target.tagName == 'IMG' ? ele.src == e.target.src : ele.innerHTML == e.target.innerHTML;
        }) === -1)
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
