import Profile from "../Classes/Profile.js";
import Countries from "../Objects/Countries.js";
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import {validateEmail, addError, redirect} from "../app.js";

const profiel = new Profile();
await profiel.setProfile();
const saveBtn = document.querySelector('#profile_save');
const fileInput = document.getElementById('uplaud_img');
const preview = document.getElementById('avatar');
const d = profiel.getBirtdayStringFormatedLocale("en");

var gender = document.querySelector('#profiel_gender');
Countries.initCountrieSelector(document.querySelector("#profiel_country"));
var country = document.querySelector('#countries');
var name = document.querySelector("#form_profile_name");
var email = document.querySelector("#form_profile_email");
var age = document.querySelector('#profiel_age');
const current_name = document.querySelector("#form_current_name");


document.getElementById("avatar").src = profiel.getProfilePicture();
console.log(profiel);
var quill = new Quill('#editor', {
    theme: 'snow'
});

current_name.innerHTML = profiel.getFullName();
console.log(current_name);
name.value = profiel.getFullName();
age.value = d;
email.value = profiel.email;
saveBtn.addEventListener('click', save);
email.addEventListener('change', ve);
gender.value = profiel.gender;
if(country){
    country.value = profiel.country_id;
}

/**
 * Validate email and throw visible error
 */
function ve(){
    const errors = document.querySelectorAll('.error');
    errors.forEach(e => {
        e.remove();
    });
    if(!validateEmail(email.value)){
        addError(this,"Email is niet juist");

    }
}

/**
 * Save entire profile_Controller
 */
function save() {
    const names = name.value.split(" ");
    profiel.updateProfile(names[0], names[1],email.value,age.value,gender.value,country.value,quill.container.firstChild.innerHTML());
    redirect("profiel.html");
}

fileInput.onchange = () => {
    uplaud()
}

function uplaud() {
    console.log("click")
    profiel.setProfilePicture(fileInput, preview);
}

