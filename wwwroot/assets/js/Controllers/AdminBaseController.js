/**
 * Admin controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";
import Profile from "../Classes/Profile.js";
import App from "../Classes/App.js";
import Login_Controller from "./Login_Controller.js";

export default class AdminBaseController extends Controller {

    constructor(model, view) {
        super(model, view);
    }
    async loadTemplate()
    {
        const profiel = new Profile();
        await profiel.setProfile();
        if(profiel.account_type === "admin"){
            //Remove Basic layouts
            document.querySelector("body").remove();
            document.querySelector("html").append(document.createElement("body"))


            //Load admin layout
            const url = "layouts/admin.html",
                http = new XMLHttpRequest();
            http.onreadystatechange = async function () {
                if (this.readyState === 4 && this.status === 200) {
                    document.querySelector("body").innerHTML = this.response;

                    const logoutBtn = document.querySelector('#adminNav_logout');
                    logoutBtn.addEventListener('click', function() {
                        Login_Controller.logout();
                        window.location.reload();
                    });
                }
            };
            http.open('GET', url, true);
            http.send();
        }else{
            App.redirect("#/home")
            App.ShowNotifyError("Geen toegang", "Je hebt helaas geen toegang tot deze pagina")
        }

    }

    render(){
        return null;
    }
}