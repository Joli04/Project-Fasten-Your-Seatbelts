import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import {GetCurrentPage} from "../app.js";

document.addEventListener("DOMContentLoaded", function () {
    if (GetCurrentPage() === "login.html") {
        var login_bt = document.querySelector("#login_button");
        login_bt.addEventListener('click', login);
        if (isLoggedIn()) {
            FYSCloud.URL.redirect("profiel.html");
        }
    }
});

/**
 * Check if logedin
 */
export function isLoggedIn() {
    var id = FYSCloud.Session.get("user_id");
    if (id>0) {
        return true;
    }
    return false;
}

/**
 * Local storage logout
 */
export function logout() {
    FYSCloud.Session.clear();
    //Set basic lang to nl
    FYSCloud.Session.set('lang','nl');
    FYSCloud.URL.redirect("index.html");
}


/**
 * Login function
 */
function login() {
    //Valideer input
    if (validate()) {
        const email = document.getElementById('email');
        var password = document.getElementById('pass');

        //Hash password directly
        //format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY
        const shaObj = new jsSHA("SHA-512", "TEXT", {encoding: "UTF8"});
        shaObj.update(password.value);
        const hash = shaObj.getHash("HEX");
        getLogin(email.value, hash);

    }
}

export function getLogin(email, password) {
    FYSCloud.API.queryDatabase(
        "SELECT id, email, password FROM users WHERE email = ?", [email]
    ).then(function (data) {
        //Get User info
        if (data[0].password === password) {
            FYSCloud.Session.set("user_id", data[0].id);
            //Redirect page to an URL with querystring
            FYSCloud.URL.redirect("profiel.html");

        } else {
            addError(document.querySelector("form"), "Wachtwoord is incorrect");
        }
    }).catch(function (reason) {
        //Log reason
        console.log(reason);
    });

}

function validate() {
    var isValid = true;
    var elements = document.querySelectorAll("input");
    var errorMsg = "";
    const errors = document.querySelectorAll('.error');
    errors.forEach(e => {
        e.remove();
    });
    elements.forEach(e => {
        if (e.type === "email") {
            if (!validateEmail(e.value)) {
                errorMsg = "Geen geldig email addres";
                addError(e, errorMsg);
                isValid = false;
            }
        }
        if (e.type === "password") {
            if (e.value === "") {
                errorMsg = "Wachtwoord is een verplicht veld";
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
function addError(element, errorMsg = "Dit veld is een verplicht veld") {
    const error = document.createElement("p");
    error.className = "error";
    error.style.display = 'block';
    error.innerText = errorMsg;
    element.parentElement.appendChild(error);
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}