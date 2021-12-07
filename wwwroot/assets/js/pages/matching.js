import {GetCurrentPage} from "../app.js";
import Profile from "../classes/Profile.js";
import Countries from "../Objects/Countries.js";
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
const profiel = new Profile();
await profiel.setProfile();


Countries.initCountrieSelector(document.querySelector("#countrie_selector"));
Countries.initCountrieSelector(document.querySelector("#countrie_selector_2"));

var profile_name =document.querySelector('#mathing_profile_name');
profile_name.innerHTML = profiel.getFullName();

var profile_age =document.querySelector('#mathing_profile_age');
profile_age.innerHTML = profiel.birthday;

var profile_orgin =document.querySelector('#mathing_profile_orgin');
profile_orgin.innerHTML = profiel.getQountry();

let users = await FYSCloud.API.queryDatabase('SELECT * FROM users')
let countries = await FYSCloud.API.queryDatabase('SELECT * FROM countries')

for(var user in users) {
    user = users[user]

    //getting age from current date / users birthday
    const age = new Date().getFullYear() - new Date(user.birthday).getFullYear()

    //filtering to get users country (name)
    const country = countries.filter(country => country.id == user.country_origin_id)[0]

    //capitalizing first letter of country name
    const arr = country.names.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

    }
    const formatted_country_name = arr.join(" ");

    //capitalizing first letter of gender
    const formatted_gender = user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
    
    //adding user card to container
    document.getElementById('card-container').innerHTML += `
    <div class="grid-child">
        <div class="card" onclick="window.open('profiel.html?id=${user.id}');" style="cursor: pointer;">
            <div id="image">
                <img class="align_image" src="${user.profile}" alt="Profile Picture">
            </div>
            <p id="user_name">${user.first_name} ${user.last_name}</p>
            <div id="info">
                <p>${age}</p>
                <p>${formatted_country_name}</p>
                <p>${formatted_gender}</p>
            </div>
        </div>
    </div>`
}