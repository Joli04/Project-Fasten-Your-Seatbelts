/**
 * Profile controller
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import Controller from './Controller.js';
import view from "../Classes/View.js";
import App from '../Classes/app.js';
import Profile from "../Classes/Profile.js";


export default class Profile_Controller extends Controller {

    async show() {
        window.onload = async function () {
            const profiel = new Profile();
            let query = FYSCloud.URL.queryString()

            if (query.id > 0) {
                document.getElementById('edit_btn').style.display = 'none';
                profiel().setId(query.id);
                function contact() {
                    window.open(`mailto:${profiel.email}`);
                }
                const change_profile = document.querySelector("#contact_btn");
                change_profile.addEventListener('click', contact);
            } else {
                console.log(profiel.id);
                await profiel.setProfile();
                console.log(profiel);
                document.getElementById('contact_btn').style.display = 'none'
                const change_profile = document.querySelector("#edit_btn")
                change_profile.addEventListener('click', edit());
                function edit() {
                    App.redirect('#/profiel/edit')
                    return null;
                }
            }

            var fullName = document.querySelector('.profile_name');
            fullName.innerHTML = profiel.getFullName();

            var bio = document.querySelector('.profile__bio');

            bio.innerHTML = profiel.bio || "";
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
        };
    }


    generateAvatar(foregroundColor = "white", backgroundColor = "black", first_name, last_name) {
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

    render() {
        return new view('profiel.html', "Commonflight Profiel");
    }
}