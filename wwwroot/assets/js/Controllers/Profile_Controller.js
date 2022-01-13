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
        var ownProfiel = new Profile()
        await ownProfiel.setProfile();
        const query = App.getFromQueryObject();
        if (query.id > 0) {
            await this.profiel.setProfile(query.id);
            document.getElementById('edit_btn').style.display = 'none';
            this.change_profile = document.querySelector("#contact_btn");
            this.change_profile.addEventListener('click', this.contact.bind(this, this.profiel));

            this.chat_btn = document.querySelector('#chat_btn')
            this.chat_btn.addEventListener('click', () => {
                App.redirect(`#/chat?id=${this.profiel.id}&checknew=1`);
            })

            this.ownProfiel = new Profile()
            await this.ownProfiel.setProfile();

            let requestedMatch = await FYSCloud.API.queryDatabase("SELECT * from request WHERE user_id = ? AND to_user = ?", [this.profiel.id, this.ownProfiel.id]);

            if(requestedMatch.length > 0){
                this.isRequestedMatch()
                await this.loadPublicProfile()
                return
            }

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
                await this.profiel.getMatches()
                let match = false;

                this.profiel.matches.filter(function (item) {
                    if (item.user_id == ownProfiel.id) {
                        match = true;
                    }
                });
                if(match){
                    console.log("Load public because is match")
                    this.change_profile.style.display = 'none';
                    await this.loadPublicProfile();
                }else{
                    this.this.chat_btn.style.display = 'none';
                    this.loadPrivateProfile();
                }
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

    async isRequestedMatch() {
        console.log("Is awaiting match")
        document.querySelector('#contact_btn').style.display = 'none';
        document.querySelector('#chat_btn').style.display = 'none';

        let profileButtonHTML = document.querySelector('.profile__button');

        profileButtonHTML.innerHTML += '<button class="profile__button" id="accept_match"><span class="button__text" id="accept">Accepteer match</span><img src="assets/img/icons/right-arrow.svg" class="button__icon" alt="right-arrow button icon"></button>'
        profileButtonHTML.innerHTML += '<button class="profile__button" id="deny_match"><span class="button__text" id="deny">Weiger match</span><img src="assets/img/icons/right-arrow.svg" class="button__icon" alt="right-arrow button icon"></button>'
        
        let acceptMatchHTML = document.querySelector('#accept_match');
        let denyMatchHTML = document.querySelector('#deny_match');

        acceptMatchHTML.addEventListener('click', async () => {
            await this.acceptMatch()
            App.redirect('#/profiel')
        })


        denyMatchHTML.addEventListener('click', async () => {
            await this.denyMatch()
            App.redirect('#/profiel')
        })
    }

    async acceptMatch() {
        let removeRequest = await FYSCloud.API.queryDatabase('DELETE FROM request WHERE user_id = ? AND to_user = ?', [this.profiel.id, this.ownProfiel.id]);
        let addMatch = await FYSCloud.API.queryDatabase('INSERT INTO user_matches (requested_id, is_match, user_id) VALUES (?, ?, ?)', [this.profiel.id, true, this.ownProfiel.id]);
    }

     async denyMatch() {
        let removeRequest = await FYSCloud.API.queryDatabase('DELETE FROM request WHERE user_id = ? AND to_user = ?', [this.profiel.id, this.ownProfiel.id]);
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
        App.ShowNotifyError("Profiel", "Profiel is prive: Contact gebruiker om meer over elkaar te weten te komen")
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