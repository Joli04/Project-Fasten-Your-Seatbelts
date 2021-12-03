import {GetCurrentPage, addError,validate} from "../app.js";
import Profile from "../classes/Profile.js";
const profiel = new Profile();


document.addEventListener("DOMContentLoaded", function () {
    var registerBtn = document.querySelector("#aanmelden");
    // registerBtn.addEventListener('click', register());

});

function register(){
    var elements = document.querySelectorAll(".regi form input");
    if(validate(elements)){
        profiel.registerProfile();
    }
}
