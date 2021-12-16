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
                await profiel.setProfile();
                document.getElementById('contact_btn').style.display = 'none'
                const change_profile = document.querySelector("#edit_btn")
                change_profile.addEventListener('click', edit);
                function edit() {
                    App.redirect('#/profiel/edit')
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
            gender.innerHTML = profiel.gender.charAt(0).toUpperCase() + profiel.gender.slice(1)

            var country = document.querySelector('#profiel_country');

            //capitalizing first letter of country name
            const arr = profiel.getQountry().split(" ");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

            }
            country.innerHTML = arr.join(" ");

            document.getElementById("avatar").src = profiel.getProfilePicture();

    }
    verify(){
        console.log("Verify started");
        const profiel = new Profile();
        const queryString = App.getFromQueryString();
        console.log(queryString);
        if (queryString.id > 0) {

            profiel.setId(queryString.id);
            profiel.update('email_verified_at', queryString.timestamp);
            App.redirect('#/profiel/wizard');
        }
    }
    render() {
        return new view('profiel.html', "Commonflight Profiel");
    }
}