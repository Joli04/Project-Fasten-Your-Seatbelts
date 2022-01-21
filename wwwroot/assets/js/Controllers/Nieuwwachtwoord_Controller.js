import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import '../config.js';
/**
 * Home controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";



export default class Nieuwwachtwoord_Controller extends Controller
{
    index() {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "./vendors/jsSHA/sha.js";
        document.head.appendChild(script);

        document.querySelector(".zoeken").addEventListener("click", event => {
            let email = localStorage.getItem("email")
            const wachtwoord = document.getElementById("wachtwoord").value;

            const shaObj = new jsSHA("SHA-512", "TEXT", {encoding: "UTF8"});
            shaObj.update(wachtwoord);
            const hash = shaObj.getHash("HEX");



            FYSCloud.API.queryDatabase('UPDATE users SET password = ? WHERE email = ?', [hash,email])
                .then(function(data) {
                        document.getElementById("titel").innerHTML = "Je wachtwoord is veranderd"
                        document.getElementById("titel").style.backgroundColor = "green"
                        document.getElementById("error").innerHTML = "Jouw wachtwoord is veranderd, ga terug naar het login scherm en probeer het uit."
                        document.getElementById("error").style.color = " green"
                        window.localStorage.clear();
                    setTimeout(
                        function( )
                        {
                            window.location.replace("https://dev-is108-3.fys.cloud/#/home")
                        }, 2700);
                }).catch(function (reason) {
                console.log(reason);

            });
        })
    }
    render() {
        return new view('nieuw_wachtwoord.html',"CommonFlight | Nieuw wachtwoord").extends("blank.html");
    }
}
