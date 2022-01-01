/**
 * Profile controller
 */
import Controller from './Controller.js';
import App from '../Classes/app.js';
import Profile from "../Classes/Profile.js";
import Countries from "../Objects/Countries.js";
const profiel = new Profile();
import view from "../Classes/View.js";


export default class Register_Controller extends Controller
{
    show() {
        /**
         * Added Script to header
         * @type {HTMLScriptElement}
         */
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "./vendors/jsSHA/sha.js";
        document.head.appendChild(script);
        window.onchange = function () {
            const selector = document.querySelector("#country_selector");
            selector.innerHTML= "";
            Countries.initCountrieSelector(selector);
            const registerBtn = document.querySelector("#aanmelden");
            if(registerBtn) {

                registerBtn.addEventListener('click', Register_Controller.register);
            }
        };

    }
    static register(){
    let elements = document.querySelectorAll("form input");
    if(App.validate(elements)){

        const firstname =  document.querySelector('input[name="firstname"]');
        const lastname =  document.querySelector('input[name="lastname"]');
        const email =  document.querySelector('input[name="email"]');
        const password =  document.querySelector('input[name="password"]');
        const shaObj = new jsSHA("SHA-512", "TEXT", {encoding: "UTF8"});

        shaObj.update(password.value);
        const hash = shaObj.getHash("HEX");

        const birthday = document.querySelector('input[name="birthday"]');
        const genderValue = document.querySelector('#gender');
        const gender = genderValue.options[genderValue.selectedIndex].value;
        const country = document.getElementById("countries")
        try{
            return profiel.registerProfile(firstname.value,lastname.value,email.value,hash,birthday.value,gender,country.value);
            //redirect("profiel.html");
        }catch (e){
            App.addError(elements.parent,"Gebruiker bestaadt al")
            console.log('Register:'+ e);
        }

    }
}
    render() {
        return new view('registratie.html',"Commonflight Home");
    }
}