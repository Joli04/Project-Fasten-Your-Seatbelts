import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "./config.js";
document.addEventListener("DOMContentLoaded", async function () {
    //Add the header to the page
    const headerData = await FYSCloud.Utils.fetchAndParseHtml("_header.html");
    addHeader(headerData);

    //Add the footer to the page
    const footerData = await FYSCloud.Utils.fetchAndParseHtml("_footer.html");
    addFooter(footerData);

    function addHeader(data) {
        const firstElement = data[0];
        // checkLoggedIn(firstElement);
        document.querySelector("#nav").appendChild(firstElement);
        // document.body.insertBefore(firstElement, document.body.firstChild);
    }

    function addFooter(data) {
        const firstElement = data[0];
        document.querySelector("#footer").appendChild(firstElement);
    }
});

//NOTE: Global function so other JavaScript files can use this as well
// export function checkLoggedIn(element) {
//     if (FYSCloud.Session.get("loggedin")) {
//         element.querySelectorAll(".js-loggedin-show").forEach(e => e.style.display = "block");
//         element.querySelectorAll(".js-loggedin-hide").forEach(e => e.style.display = "none");
//     } else {
//         element.querySelectorAll(".js-loggedin-show").forEach(e => e.style.display = "none");
//         element.querySelectorAll(".js-loggedin-hide").forEach(e => e.style.display = "block");
//     }
// }
