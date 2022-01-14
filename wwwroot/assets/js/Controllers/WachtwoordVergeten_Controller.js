import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import '../config.js';
/**
 * Home controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";

export default class Wachtwoord_vergeten extends Controller
{
    index() {
            document.querySelector(".zoeken").addEventListener("click", event => {
                let invoer = document.getElementById("email").value;
                let ad = invoer.includes("@")
                    FYSCloud.API.queryDatabase('SELECT email FROM users WHERE email = ?', [invoer])
                        .then(function (data) {
                                if(invoer === null || invoer === ""){
                                    document.getElementById("error").innerHTML = "Je moet iets invoeren"
                                    document.getElementById("error").style.color = "red"
                                }
                                else if(invoer !== '@'){
                                    document.getElementById("error").innerHTML = "Je moet een emailadres invoeren."
                                    document.getElementById("error").style.color = "red"
                                }
                                if(data.length === 1){
                                    document.getElementById("titel").innerHTML = "Er is een email verstuurd naar het ingevulde emailadres"
                                    document.getElementById("titel").style.backgroundColor = "green"
                                    document.getElementById("error").innerHTML = "Er is een account gevonden met dit emailadres!"
                                    document.getElementById("error").style.color = " green"
                                }
                                if(ad === true && data.length === 0){
                                    document.getElementById("error").innerHTML = "Er bestaat geen account met dit emailadres."
                                    document.getElementById("error").style.color = "red"
                                }


                        }).catch(function (reason) {
                        console.log(reason);
                    });

            })

    }
    render() {
        return new view('wachtwoord_vergeten.html',"CommonFlight | Password forgot").extends("blank.html");
    }
}
