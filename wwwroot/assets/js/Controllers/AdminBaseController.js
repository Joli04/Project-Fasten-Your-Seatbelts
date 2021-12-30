/**
 * Admin controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";
import Profile from "../Classes/Profile.js";
import App from "../Classes/App.js";
export default class AdminBaseController extends Controller {

    constructor(model, view) {
        super(model, view);

    }
    async loadTemplate()
    {
        const profiel = new Profile();
        await profiel.setProfile();
        console.log(profiel.account_type);
        if(profiel.account_type === "user"){
            App.redirect("#/profiel")
            App.ShowNotifyError("Geen toegang", "Je hebt helaas geen toegang tot deze pagina")
        }else{
            //Remove Basic layouts
            document.querySelector("body").remove();
            document.querySelector("html").append(document.createElement("body"))

            //Load admin layout
            const url = "layouts/admin.html",
                http = new XMLHttpRequest();
            http.onreadystatechange = async function () {
                if (this.readyState === 4 && this.status === 200) {
                    document.querySelector("body").innerHTML = this.response;
                }
            };
            http.open('GET', url, true);
            http.send();
        }

    }

    render(){
        return null;
    }
}