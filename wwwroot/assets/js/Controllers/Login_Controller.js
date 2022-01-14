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
        window.onchange = function () {
            const login_bt = document.querySelector("#login_button");
            if (login_bt) {
                login_bt.addEventListener('click', Login_Controller.Excutelogin);
            }
            if (Login_Controller.isLoggedIn()) {
                App.redirect("#/profiel");
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
            "SELECT id, email, password, account_type FROM users WHERE email = ?", [email]
        ).then(function (data) {
            //Get User info
            if (data[0].password === password) {
                FYSCloud.Session.set("user_id", data[0].id);
                FYSCloud.Session.set("account_type", data[0].account_type);
                //Redirect page to an URL with querystring
                App.redirect("#/profiel");

            } else {
                App.addError(document.querySelector("form"), "Wachtwoord is incorrect");
                App.ShowNotifyError("Login", "Helaas, jouw wachtwoord komt niet overeen met wat bekent is")
            }
        }).catch(function (reason) {
            App.ShowNotifyError("Login", "Er is een fatale fout ontstaan")
            console.log(reason);
        });

    }

    static logout() {
        FYSCloud.Session.clear();
        //Set basic lang to nl
        FYSCloud.Session.set('lang', 'nl');
        //LogoutEvents
        const logoutEvent = document.createEvent('Event');
        // Define that the event name is 'build'.
        logoutEvent.initEvent('logout', true, true);
        App.redirect("#/home");
        document.dispatchEvent(logoutEvent);

    }


    static Listen() {
        document.addEventListener('logout', function (e) {
            App.setActivePage();

        }, false);
    }

    render() {
        return new view('login.html', "CommonFlight | Login").extends("blank.html");
    }
}