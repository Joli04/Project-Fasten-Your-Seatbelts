import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import {GetCurrentPage, redirect} from "../app.js";
import Profile from "../classes/Profile.js";
import Countries from "../Objects/Countries.js";

let query = FYSCloud.URL.queryString()

if(query.id > 0) {
    var user = await FYSCloud.API.queryDatabase('SELECT * FROM users WHERE id = ?', [query.id])

    let countries = await FYSCloud.API.queryDatabase('SELECT * FROM countries')

    console.log(user)
    console.log(countries)

    if(user.length > 0) { 
        user = user[0]
        var fullName = document.querySelector('.profile_name');
        fullName.innerHTML = user.first_name + ' ' + user.last_name;

        var bio = document.querySelector('.profile_bio');
        var intress = document.querySelector('.profile_name');

        var age = document.querySelector('#profiel_age');
        const d = new Date(user.birthday);

        age.innerHTML = d.toLocaleDateString().replace("T", " ");

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

        var genderObject = document.querySelector('#profiel_gender');
        genderObject.innerHTML = formatted_gender
        var countryObject = document.querySelector('#profiel_country');
        countryObject.innerHTML = formatted_country_name

        var profile_picture

        if(user.profile == null) {
            profile_picture = generateAvatar("white", getComputedStyle(document.documentElement).getPropertyValue('--dark_green'), user.first_name, user.last_name)
        } else {
            profile_picture = user.profile
        }

        document.getElementById("avatar").src = profile_picture
    } else {
        redirect('404.htm')
    }
} else {
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

    //capitalizing first letter of gender
    const formatted_gender = profiel.gender.charAt(0).toUpperCase() + profiel.gender.slice(1)

    gender.innerHTML = formatted_gender

    var country = document.querySelector('#profiel_country');

    //capitalizing first letter of country name
    const arr = profiel.getQountry().split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

    }
    const formatted_country_name = arr.join(" ");

    country.innerHTML = formatted_country_name

    document.getElementById("avatar").src = profiel.getProfilePicture();

    const change_profile = document.querySelector(".btn_edit");
    console.log(change_profile);
    change_profile.addEventListener('click', edit);
}

function edit() {
    redirect('profiel_edit.html')
}

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