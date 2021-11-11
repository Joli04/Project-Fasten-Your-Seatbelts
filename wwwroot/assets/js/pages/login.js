import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("#aanmelden").addEventListener("click", function() {

        if(validate()){
            FYSCloud.Session.set("loggedin", true);
            FYSCloud.URL.redirect("profile.html");
        }; //Valideer input

    });
});
function validate() {
    const loginForm = document.getElementById("login-form");
    const loginButton = document.getElementById("login-form-submit");
    const loginErrorMsg = document.getElementById("login-error-msg");

    const $result = $("#result");
    const email = $("#email").val();
    $result.text("");

    if (validateEmail(email)) {
        $result.text(email + " is valid :)");
        $result.css("color", "green");
    } else {
        $result.text(email + "");
        $result.css("color", "red");
    }
    return false;
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}