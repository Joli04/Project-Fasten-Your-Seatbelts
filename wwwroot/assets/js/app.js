import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "./config.js";
// import {isLoggedIn, logout} from './pages/login.js';

//Todo Added web.js to work with Custom spa routes
import {web} from './Routes/web.js';
import {isLoggedIn, logout} from "./pages/login.js";
import Profile from "./Classes/Profile.js";
import App from "./Classes/app.js";
import Countries from "./Objects/Countries.js";

const app = new App();
document.addEventListener("DOMContentLoaded", async function () {


    checkNeedsLogin(GetCurrentPage());

    //Set default translations
    FYSCloud.Localization.setTranslations(await getTransable());
    const initialLanguage = FYSCloud.Session.get('lang') !== undefined ? FYSCloud.Session.get('lang') : 'nl';
    translate(initialLanguage);

    const headerData = await FYSCloud.Utils.fetchAndParseHtml("layouts/_header.html");
    //Add the header to the page
    if (document.querySelector("#nav") !== null) {
        addHeader(headerData);
        var logout_btn = document.querySelector("#nav_logout");
        logout_btn.addEventListener('click', logout);

        setActivePage();
        document.querySelector("#languageSwitch").value = initialLanguage;
        document.querySelector("#languageSwitch").addEventListener("change", function () {
            translate(this.value)
        });
        document.querySelector("#mobile_nav").addEventListener("click", function () {
            var x = document.querySelector(".topnav");
            console.log(x);
            if (x.className === "topnav") {
                x.className += " responsive";
            } else {
                x.className = "topnav";
            }
        });

    }

    //Add the footer to the page
    const footerData = await FYSCloud.Utils.fetchAndParseHtml("layouts/_footer.html");
    if (document.querySelector("#footer") !== null) {
        addFooter(footerData);
    }

});

function addHeader(data) {
    const firstElement = data[0];
    var nav = document.querySelector("#nav");
    // checkLoggedIn(firstElement);
    // const nav =document.querySelector("#nav");
    // if(nav !== undefined){
    //     nav.appendChild(firstElement);
    // }
    nav.insertBefore(firstElement, nav.firstElementChild);
}

function addFooter(data) {
    const firstElement = data[0];
    document.querySelector("#footer").appendChild(firstElement);
    var copyright_year = document.querySelector(".copyright .year");
    copyright_year.innerHTML = new Date().getFullYear();
}

/**
 *
 * @constructor
 */
export function Previous() {
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
    const other_links = document.querySelectorAll(".topnav a");
    if (GetCurrentPage() !== "profile_wizard") {

        for (let i = 0; i < other_links.length; i++) {
            if (other_links[i].classList.contains('icon')) {

            } else {
                other_links[i].classList.remove("active");
                if (isLoggedIn()) {
                    other_links[i].style.display = "block";
                    HandleLinks(false);
                }
            }


        }
        var nav_page = null;
        const current_page = GetCurrentPage().split('.html')[0];
        if (current_page !== "") {
            nav_page = document.querySelector(".topnav #" + current_page);
        }

        if (nav_page) {
            nav_page.classList.add("active");
        }

    } else {

    }

}

function HandleLinks(show) {
    const login = document.querySelector(".topnav #login");
    const register = document.querySelector(".topnav #registratie");
    const heroButton = document.querySelector(".hero__button");
    if (show) {
        login.style.display = "block";
        register.style.display = "block";
        heroButton.style.display = "flex";
    } else {
        login.style.display = "none";
        register.style.display = "none";
        if (heroButton) {
            heroButton.style.display = "none";
        }

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
        case "verify.html":
            const profiel = new Profile();
            var queryString = FYSCloud.URL.queryString();
            if (queryString.id > 0) {
                profiel.setId(queryString.id);
                profiel.update('email_verified_at', queryString.timestamp);
                redirect('profile_wizard.html');
            }

            break;
        case "registratie.html":
            if (isLoggedIn()) {
                FYSCloud.URL.redirect("profiel.html");
            }
            break;
        case "matching.html":
            redirectToLogin()
            break;
    }
}

export function redirect(endpoint) {
    FYSCloud.URL.redirect(endpoint);
}

function redirectToLogin() {
    if (!isLoggedIn()) {
        FYSCloud.URL.redirect("login.html");
    }
}

async function getTransable() {
    //Get the same accommodations again, but this time from a local JSON-file.
    try {
        return await FYSCloud.Utils.fetchJson("data/translations.json");
    } catch (reason) {
        console.log(reason);
    }
}

export function findObjectByLabel(obj, label) {
    if (obj.label === label) {
        return obj;
    }
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            var foundLabel = findObjectByLabel(obj[i], label);
            if (foundLabel) {
                return foundLabel;
            }
        }
    }
    return null;
};

function translate(lang_code) {
    FYSCloud.Session.set('lang', lang_code);
    FYSCloud.Localization.switchLanguage(lang_code);
    FYSCloud.Localization.translate();
}

export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function validatePassword(password) {
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
    return strongRegex.test(String(password));
}

export function validate(elements) {
    var isValid = true;
    var errorMsg = "";
    const errors = document.querySelectorAll('.error');
    errors.forEach(e => {
        e.remove();
    });
    elements.forEach(e => {
        if (e.type === "email") {
            if (!validateEmail(e.value)) {
                errorMsg = "Geen geldig email address";
                addError(e, errorMsg);
                isValid = false;
            }
        }
        if (e.type === "password") {
            if (e.value === "") {
                errorMsg = "Wachtwoord is een verplicht veld";
                console.log(e.value, errorMsg);
                addError(e, errorMsg);
                isValid = false;
            }
            console.log(validatePassword(e.value));
            if (!validatePassword(e.value)) {
                errorMsg = "Wachtwoord voldoet niet aan de voorwaardes";
                console.log(e.value, errorMsg);
                addError(e, errorMsg);
                isValid = false;
            }
        }
        if (e.type === "date") {
            if (e.value === "") {
                errorMsg = "Datum is verplicht, selecteer een datum";
                console.log(e.value, errorMsg);
                addError(e, errorMsg);
                isValid = false;
            }
        }
        if (e.type === "text") {
            if (!e.value > "") {
                errorMsg = "Veld heeft geen waarde";
                console.log(e.value, errorMsg);
                addError(e);
                isValid = false;
            }
        }
    });
    console.log(isValid);
    return isValid;
}

/**
 * Add Custom error block
 * @param element
 * @param errorMsg
 */
export function addError(element, errorMsg = "Dit veld is een verplicht veld") {
    const error = document.createElement("p");
    error.className = "error";
    error.style.display = 'block';
    error.innerText = errorMsg;
    document.querySelector('.errorWrapper').appendChild(error);

    function myFunction(sm,lg) {
        if (lg.matches) {
            document.querySelector('.wrapper__auth').style.padding = '0';
        } else if(sm.matches) {
            document.querySelector('.wrapper__auth').style.padding = '100px 0';
        } else {
            document.querySelector('.wrapper__auth').style.padding = '50px 0';
        }
    }

    let sm = window.matchMedia("(min-width: 576px)");
    let lg = window.matchMedia("(min-width: 992px)");
    myFunction(sm,lg)
}

