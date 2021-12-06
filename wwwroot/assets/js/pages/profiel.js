import {GetCurrentPage, redirect} from "../app.js";
import Profile from "../classes/Profile.js";
import Countries from "../Objects/Countries.js";

const profiel = new Profile();
await profiel.setProfile();


var fullName = document.querySelector('.profile_name');
fullName.innerHTML = profiel.getFullName();

var bio = document.querySelector('.profile_bio');
var intress = document.querySelector('.profile_name');

var age = document.querySelector('#profiel_age');
const d = new Date(profiel.birthday);

age.innerHTML = d.toLocaleDateString().replace("T", " ");

var gender = document.querySelector('#profiel_gender');
var country = document.querySelector('#profiel_country');
country.innerHTML = profiel.getQountry();

document.getElementById("avatar").src = profiel.getProfilePicture();

const change_profile = document.querySelector(".btn_edit");
console.log(change_profile);
change_profile.addEventListener('click', edit);

function edit() {
    redirect('profiel_edit.html')
}
