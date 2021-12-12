/**
 * Profile controller
 */
import Controller from './Controller.js';
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import view from "../Classes/View.js";
import App from "../Classes/app.js";

export default class Login_Controller extends Controller {

    async show() {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "./vendors/jsSHA/sha.js";
        document.head.appendChild(script);
        window.onload = function () {
            const login_bt = document.querySelector("#login_button");
            login_bt.addEventListener('click', Login_Controller.Excutelogin);
            if (Login_Controller.isLoggedIn()) {
                App.redirect("profiel");
            }
        }
    }

    static isLoggedIn() {
        var id = FYSCloud.Session.get("user_id");
        if (id > 0) {
            return true;
        }
        return false;
    }

    static Excutelogin() {
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
            Login_Controller.getLogin(email.value, hash);
        }
    }

    static getLogin(email, password) {
        FYSCloud.API.queryDatabase(
            "SELECT id, email, password FROM users WHERE email = ?", [email]
        ).then(function (data) {
            //Get User info
            if (data[0].password === password) {
                FYSCloud.Session.set("user_id", data[0].id);
                //Redirect page to an URL with querystring
                App.redirect("#/profiel");

            } else {
                App.addError(document.querySelector("form"), "Wachtwoord is incorrect");
            }
        }).catch(function (reason) {
            //Log reason
            console.log(reason);
        });

    }

    static logout() {
        FYSCloud.Session.clear();
        //Set basic lang to nl
        FYSCloud.Session.set('lang', 'nl');
        App.redirect("#/home");
    }

    render() {
        return new view('login.html', "Commonflight Profiel");
    }
}