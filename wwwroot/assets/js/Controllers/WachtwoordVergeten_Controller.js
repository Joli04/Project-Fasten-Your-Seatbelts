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
            console.log("test")

            document.querySelector(".zoeken").addEventListener("click", event => {
                FYSCloud.API.queryDatabase(
                    "SELECT email FROM users"
                ).then(function(data) {
                    console.log(data)
                    let invoer = document.getElementById("email").value;
                    console.log(data.length)
                    for (let i = 0; i <data.length ; i++) {
                        let {email} = data[i];
                        if(invoer === email){
                            console.log("We hebben je account gevonden.")
                        }
                        console.log(email)
                    }

                }).catch(function(reason) {
                    console.log(reason);
                });
            })
    }
    render() {
        return new view('wachtwoord_vergeten.html',"CommonFlight | Password forgot").extends("blank.html");
    }
}
