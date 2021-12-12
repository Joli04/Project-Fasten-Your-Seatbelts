import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import App from "../Classes/app.js";


document.addEventListener("DOMContentLoaded", function () {

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
    var elements = document.querySelectorAll("input");
    if (App.validate(elements)) {
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

