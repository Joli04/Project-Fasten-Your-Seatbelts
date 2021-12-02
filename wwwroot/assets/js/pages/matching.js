import {GetCurrentPage} from "../app.js";
import Profile from "../classes/Profile.js";
const profiel = new Profile();
await profiel.setProfile();

var profile_name =document.querySelector('#mathing_profile_name');
profile_name.innerHTML = profiel.getFullName();

var profile_age =document.querySelector('#mathing_profile_age');
profile_age.innerHTML = profiel.birthday;

var profile_orgin =document.querySelector('#mathing_profile_orgin');
profile_orgin.innerHTML = profiel.getQountry();