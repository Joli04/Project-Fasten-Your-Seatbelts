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
        this.profiel = new Profile();
        const query = App.getFromQueryObject();
        if (query.id > 0) {
            await this.profiel.setProfile(query.id);
            document.getElementById('edit_btn').style.display = 'none';
            const change_profile = document.querySelector("#contact_btn");
            change_profile.addEventListener('click', this.contact.bind(this,this.profiel));

            const chat_btn = document.querySelector('#chat_btn')
            chat_btn.addEventListener('click', () => {
                App.redirect(`#/chat?id=${this.profiel.id}&checknew=1`);
            })

        } else {
            await this.profiel.setProfile();
            document.getElementById('contact_btn').style.display = 'none'
            document.getElementById('chat_btn').style.display = 'none';
            const change_profile = document.querySelector("#edit_btn")
            change_profile.addEventListener('click', edit);

            function edit() {
                App.redirect('#/profiel/edit')
            }
        }

        if (this.profiel.getPublic()) {
            console.log("Public");
            await this.loadPublicProfile();
        } else {
            if (query.id > 0) {
                console.log("Private");
                this.loadPrivateProfile();
            } else {
                console.log("Private (but personal)");
                await this.loadPublicProfile();
            }
        }


    }
    async contact(p) {
        const user = new Profile();
        await user.setProfile(); //Get loggedin user data
        await user.sendRequest(p.id);
        // window.open(`mailto:${this.profiel.email}`);
        return null;
    }
    async loadPublicProfile() {
        var fullName = document.querySelector('.profile_name');
        fullName.innerHTML = this.profiel.getFullName();

        var bio = document.querySelector('.profile__bio');

        bio.innerHTML = this.profiel.bio || "";
        var intress = document.querySelector('#intrest__hobbies');
        var intress_countries = document.querySelector('#intrest__country');

        intress_countries.innerHTML = await this.profiel.GetIntressCountryString()
        intress.innerHTML = await this.profiel.GetIntressString()
        var age = document.querySelector('#profiel_age');
        const d = new Date(this.profiel.birthday);
        age.innerHTML = d.toLocaleDateString().replace("T", " ");

        var gender = document.querySelector('#profiel_gender');

        //capitalizing first letter of gender
        gender.innerHTML = this.profiel.gender.charAt(0).toUpperCase() + this.profiel.gender.slice(1)

        var country = document.querySelector('#profiel_country');

        //capitalizing first letter of country name
        const arr = this.profiel.getQountry().split(" ");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

        }
        country.innerHTML = arr.join(" ");
        document.getElementById("avatar").src = this.profiel.getProfilePicture();
    }

    loadPrivateProfile() {
        document.getElementById("avatar").src = this.profiel.generateAvatar("white", getComputedStyle(document.documentElement).getPropertyValue('--dark_green'));
        App.ShowNotifyError("Profiel","Profiel is prive: Contact gebruiker om meer over elkaar te weten te komen")
        document.getElementById('chat_btn').style.display = 'none';
        var fullName = document.querySelector('.profile_name');
        fullName.innerHTML = this.profiel.getFullName();

    }

    verify() {
        console.log("Verify started");
        const profiel = new Profile();
        const queryString = App.getFromQueryObject();
        console.log(queryString);
        if (queryString.id > 0) {

            profiel.setId(queryString.id);
            profiel.update('email_verified_at', queryString.timestamp);
            App.redirect('#/profiel/wizard');
        }
    }

    render() {
        return new view('profiel.html', "CommonFlight | Profiel").extends("blank.html");
    }
}