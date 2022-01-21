import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import '../config.js';
/**
 * Home controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";

const link = new URL('https://dev-is108-3.fys.cloud/#/nieuw/wachtwoord');

export default class Wachtwoord_vergeten extends Controller
{
    index() {
            document.querySelector(".zoeken").addEventListener("click", event => {
                let invoer = document.getElementById("email").value;
                const apenstaartje = invoer.includes("@")
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
                                if(apenstaartje === true && data.length === 0){
                                    document.getElementById("error").innerHTML = "Er bestaat geen account met dit emailadres."
                                    document.getElementById("error").style.color = "red"
                                }
                                if(data.length === 1){
                                    localStorage.setItem("email",invoer);
                                    document.getElementById("titel").innerHTML = "Er is een email verstuurd naar het ingevulde emailadres"
                                    document.getElementById("titel").style.backgroundColor = "green"
                                    document.getElementById("error").innerHTML = "Er is een account gevonden met dit emailadres!"
                                    document.getElementById("error").style.color = " green"

                                    FYSCloud.API.sendEmail({
                                        from: {
                                            name: "CommonFlight",
                                            address: "IS108-team3@fys.cloud"
                                        },
                                        to: [
                                            {
                                                name: "Gebruiker",
                                                address: invoer
                                            }
                                        ],
                                        subject: "CommonFlight - Een nieuw wachtwoord aanmaken",
                                        html: "<h1>Een nieuw wachtwoord maken</h1><p>Hier is de link om je wachtwoord te veranderen:</p>"+link

                                    }).then(function(data) {
                                        console.log(data);
                                        setTimeout(
                                            function ( )
                                            {
                                                window.location.replace("https://dev-is108-3.fys.cloud/#/home")
                                            }, 2700);

                                    }).catch(function(reason) {
                                        console.log(reason);
                                    });
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
