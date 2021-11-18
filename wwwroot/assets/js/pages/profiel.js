
import {GetCurrentPage} from "../app.js";
import Profile from "../classes/Profile.js";
const profiel = new Profile();

var fullName =document.querySelector('.profile_name');
fullName.innerHTML = profiel.getFullName();

var bio =document.querySelector('.profile_bio');
var intress =document.querySelector('.profile_name');

var age =document.querySelector('#profiel_age');
profiel.setProfile();
console.log(profiel);
age.innerHTML = profiel.birthday;
var gender =document.querySelector('#profiel_gender');
var country =document.querySelector('#profiel_country');
