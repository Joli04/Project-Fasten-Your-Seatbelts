/**
 * Admin controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";
import Profile from "../Classes/Profile.js";
import App from "../Classes/App.js";
import Login_Controller from "./Login_Controller.js";

export default class AdminBaseController extends Controller {

    constructor(view) {
        super(view);
    }

    async CheckAcces()
    {
        const profiel = new Profile();
        await profiel.setProfile();
        if(profiel.account_type === "admin"){

        }else{
            App.redirect("#/home")
            App.ShowNotifyError("Geen toegang", "Je hebt helaas geen toegang tot deze pagina")
        }

    }

    render(){
        return null;
    }
}