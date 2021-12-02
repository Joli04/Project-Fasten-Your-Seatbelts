import {GetCurrentPage} from "../app.js";
import Profile from "../classes/Profile.js";
const profiel = new Profile();
await profiel.setProfile();

var fullName =document.querySelector('.profile_name');
fullName.innerHTML = profiel.getFullName();

console.log(profiel);
var bio =document.querySelector('.profile_bio');
var intress =document.querySelector('.profile_name');

var age =document.querySelector('#profiel_age');
const d = new Date(profiel.birthday);

age.innerHTML =d.toLocaleDateString().replace("T"," ");

var gender =document.querySelector('#profiel_gender');
var country =document.querySelector('#profiel_country');
