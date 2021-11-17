import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "./config.js";
import {isLoggedIn, logout} from './pages/login.js';

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
        // const nav =document.querySelector("#nav");
        // if(nav !== undefined){
        //     nav.appendChild(firstElement);
        // }
        document.body.insertBefore(firstElement, document.body.firstElementChild);
    }

    function addFooter(data) {
        const firstElement = data[0];
        document.querySelector("#footer").appendChild(firstElement);
        var copyright_year = document.querySelector(".copyright .year");
        copyright_year.innerHTML = new Date().getFullYear();
    }

    checkNeedsLogin(GetCurrentPage());
    setActivePage();
});

/**
 *
 * @constructor
 */
function Previous() {
    console.log("click?")
    window.history.back()
}

/**
 *
 * @return {string}
 * @constructor
 */
export function GetCurrentPage() {
    return window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1, window.location.pathname.length);
}

function setActivePage() {
    const other_links = document.querySelectorAll(".nav li");
    for (let i = 0; i < other_links.length; i++) {
        other_links[i].classList.remove("active");
        if (isLoggedIn()) {
            other_links[i].style.display = "block";
            HandleLinks(false);
        }

    }
    const nav_page = document.querySelector(".nav #" + GetCurrentPage().split('.html')[0]);
    nav_page.style.display = "block"; //first show if is hidden
    nav_page.classList.add("active");
}
function HandleLinks(show) {
    const login = document.querySelector(".nav #login");
    const register = document.querySelector(".nav #registratie");
    if(show){
        login.style.display = "block";
        register.style.display = "block";
    }else{
        login.style.display = "none";
        register.style.display = "none";
    }

}



function checkNeedsLogin(endpoint) {
    //Todo
    //Check if user is on a page that needs login
    //Redirect user to login page with message

    switch (endpoint) {
        case "profiel.html":
            redirectToLogin();
            break;
        case "matching.html":
            redirectToLogin()
            break;
    }
}

function redirectToLogin() {
    if (!isLoggedIn()) {
        FYSCloud.URL.redirect("login.html");
    }
}

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
