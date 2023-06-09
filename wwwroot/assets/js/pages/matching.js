import {GetCurrentPage} from "../app.js";
import Profile from "../Classes/Profile.js";
import Countries from "../Objects/Countries.js";
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
const profiel = new Profile();
await profiel.setProfile();


await Countries.initCountrieSelector(document.querySelector("#countrie_selector"));
await Countries.initCountrieSelector(document.querySelector("#countrie_selector_2"));

var profile_name =document.querySelector('#mathing_profile_name');
profile_name.innerHTML = profiel.getFullName();

var profile_age =document.querySelector('#mathing_profile_age');
profile_age.innerHTML = profiel.birthday;

var profile_orgin =document.querySelector('#mathing_profile_orgin');
profile_orgin.innerHTML = profiel.getQountry();

let countries = await FYSCloud.API.queryDatabase('SELECT * FROM countries')

var users

async function search() {
    document.getElementById('card-container').innerHTML = ""

    var query_string = `SELECT * FROM users WHERE id != ${profiel.id} AND email_verified_at IS NOT NULL`

    let geslacht = document.getElementById('genders').value
    let country_origin = document.querySelector('#countrie_selector_2 #countries').value

    if(geslacht != "none") {
        query_string += ` AND gender = "${geslacht}"`
    }

    query_string += ` AND country_origin_id = "${country_origin}"`

    users = await FYSCloud.API.queryDatabase(query_string)

    getData()
}

function getData() {
    if(users.length == 0) {
        document.getElementById('card-container').innerHTML +=
            "<h3 class='users__noResult'>Geen resultaten gevonden...</h3>"
    }
    
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
    
        var profile_picture
    
        if(user.profile == null) {
            profile_picture = generateAvatar("white", getComputedStyle(document.documentElement).getPropertyValue('--dark_green'), user.first_name, user.last_name)
        } else {
            profile_picture = user.profile
        }
        
        //adding user card to container
        document.getElementById('card-container').innerHTML += `
        <div class="grid-child">
            <div class="card" onclick="window.open('profiel.html?id=${user.id}');" style="cursor: pointer;">
                <div id="image">
                    <img class="align_image" src="${profile_picture}" alt="Profile Picture">
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
}

//get filter changes
document.querySelector('#countrie_selector_2 #countries').addEventListener("change", search)
document.getElementById('countries').addEventListener("change", search)
document.getElementById('genders').addEventListener("change", search)

//initial search
search()

function generateAvatar(foregroundColor = "white", backgroundColor = "black", first_name, last_name) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 200;
    canvas.height = 200;

    // Draw background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = "bold 100px Assistant";
    context.fillStyle = foregroundColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    const intials = first_name.charAt(0) + last_name.charAt(0);
    context.fillText(intials, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
}