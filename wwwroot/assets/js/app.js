import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";

/**
 * Load Header
 */
function loadHeader(){
    FYSCloud.Utils.fetchAndParseHtml("_header.html")
        .then(function (data) {
            const firstElement = data[0];
            document.body.insertBefore(firstElement, document.body.firstChild);
        });
}

/**
 * LoadFooter
 */
function loadFooter(){
    FYSCloud.Utils.fetchAndParseHtml("_footer.html")
        .then(function (data) {
            const firstElement = data[0];
            document.body.insertBefore(firstElement, document.body.lastChild);
        });
}

loadHeader();
loadFooter();