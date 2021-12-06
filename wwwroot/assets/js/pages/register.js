import {GetCurrentPage, addError, validate,redirect} from "../app.js";
import Profile from "../classes/Profile.js";
import Countries from "../Objects/Countries.js";
const profiel = new Profile();


document.addEventListener("DOMContentLoaded", function () {
    var registerBtn = document.querySelector("#aanmelden");
    registerBtn.addEventListener('click', register);
    Countries.initCountrieSelector(document.querySelector("#countrie_selector"));
});

function register(){
    var elements = document.querySelectorAll("form input");
    if(validate(elements)){

        const firstname =  document.querySelector('input[name="firstname"]');
        const lastname =  document.querySelector('input[name="lastname"]');
        const email =  document.querySelector('input[name="email"]');
        const password =  document.querySelector('input[name="password"]');
        const shaObj = new jsSHA("SHA-512", "TEXT", {encoding: "UTF8"});

        shaObj.update(password.value);
        const hash = shaObj.getHash("HEX");

        const birthday = document.querySelector('input[name="birthday"]');
        const gender = document.querySelector('input[name="gender"]')
        const countrie = document.getElementById("countries")
        try{
            profiel.registerProfile(firstname.value,lastname.value,email.value,hash,birthday.value,gender.value,countrie.value);
            //redirect("login.html");
        }catch (e){
            console.log(e);
        }

    }
}
