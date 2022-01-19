import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import '../config.js';
/**
 * Home controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";
import {link} from "./WachtwoordVergeten_Controller.js";

export default class Nieuwwachtwoord_Controller extends Controller
{
    index() {
        document.querySelector(".zoeken").addEventListener("click", event => {
            let email = localStorage.getItem("email")
            console.log(email)
            const wachtwoord = document.getElementById("wachtwoord").value;
            if(wachtwoord === null || wachtwoord === ""){
                document.getElementById("error").innerHTML = "Je moet iets invoeren"
                document.getElementById("error").style.color = "red"
            }
            FYSCloud.API.queryDatabase('UPDATE users SET password = ? WHERE email = ?', [wachtwoord,email])
                .then(function (data) {
                    if(invoer === null || invoer === ""){
                        document.getElementById("error").innerHTML = "Je moet iets invoeren"
                        document.getElementById("error").style.color = "red"
                    }
                        document.getElementById("titel").innerHTML = "Je wachtwoord is veranderd"
                        document.getElementById("titel").style.backgroundColor = "green"
                        document.getElementById("error").innerHTML = "Jouw wachtwoord is veranderd, ga terug naar het login scherm en probeer het uit."
                        document.getElementById("error").style.color = " green"

                    console.log(data)
                }).catch(function (reason) {
                console.log(reason);

            });
        })
    }
    render() {
        return new view('nieuw_wachtwoord.html',"CommonFlight | Nieuw wachtwoord").extends("blank.html");
    }
}
