document.addEventListener("click", (e) => {

    if (e.target.id === "window-create-panel") {
        let createData = {
            type: "panel",
            url: "/panel/panel.index.html"
        };
        let creating = browser.windows.create(createData);
        creating.then(() => {
            console.log("The panel has been created");
        });
    } else if (e.target.id === "scan-page") {
        browser.tabs.executeScript(null, {
            file: "/content_scripts/scanner.js"
        }).then((result) => {
            console.log("result = " + result);
        })
    } else if (e.target.id === "test") {
        browser.runtime.sendMessage({
                "name": "sagi kirma"
            });
    }


    e.preventDefault();
});
