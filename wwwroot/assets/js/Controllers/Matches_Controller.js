/**
 * Profile controller
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import Controller from './Controller.js';
import view from "../Classes/View.js";
import Profile from "../Classes/Profile.js";
import Countries from "../Objects/Countries.js";


export default class Matches_Controller extends Controller {

    async show() {

        this.profiel = new Profile();
        await this.profiel.setProfile();
        const heroButton = document.querySelector(".hero__button");
        heroButton.style.display = "none";
        await Countries.initCountrieSelector(document.querySelector("#countrie_selector"));
        await Countries.initCountrieSelector(document.querySelector("#countrie_selector_2"));

        var profile_name = document.querySelector('#mathing_profile_name');
        profile_name.innerHTML = this.profiel.getFullName();

        var profile_age = document.querySelector('#mathing_profile_age');
        profile_age.innerHTML = this.profiel.birthday;

        var profile_orgin = document.querySelector('#mathing_profile_orgin');
        profile_orgin.innerHTML = this.profiel.getQountry();

        const countries = await FYSCloud.API.queryDatabase('SELECT * FROM countries')
        //get filter changes
        document.querySelector('#countrie_selector_2 #countries').addEventListener("change", searchMatch)
        document.getElementById('countries').addEventListener("change", searchMatch)
        document.getElementById('genders').addEventListener("change", searchMatch)

        //initial search
        await searchMatch()

        async function searchMatch() {
            document.getElementById('card-container').innerHTML = ""
            const profiel = new Profile();
            await profiel.setProfile();

            var query_string = `SELECT id
                                FROM users
                                WHERE id != ${profiel.id}
                                  AND email_verified_at IS NOT NULL`

            let geslacht = document.getElementById('genders').value
            let country_origin = document.querySelector('#countrie_selector_2 #countries').value

            if (geslacht !== "none") {
                query_string += ` AND gender = "${geslacht}"`
            }

            query_string += ` AND country_origin_id = "${country_origin}"`

            const users = await FYSCloud.API.queryDatabase(query_string)

            await getData(users)
        }

        async function getData(users) {
            if (users.length === 0) {
                document.getElementById('card-container').innerHTML +=
                    "<h3 class='users__noResult'>Geen resultaten gevonden...</h3>"
            }

            for (const row in users) {
                const user = new Profile();
                await user.setProfile(users[row].id);
                //getting age from current date / users birthday
                const age = new Date().getFullYear() - new Date(user.birthday).getFullYear()

                //filtering to get users country (name)
                const country = countries.filter(country => country.id === user.country_id)[0]

                //capitalizing first letter of country name
                const arr = country.names.split(" ");
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

                }
                const formatted_country_name = arr.join(" ");

                //capitalizing first letter of gender
                const formatted_gender = user.gender.charAt(0).toUpperCase() + user.gender.slice(1)

                const url = FYSCloud.Utils.createUrl("#/profiel", {
                    id: user.id,
                });
                //adding user card to container
                document.getElementById('card-container').innerHTML += `
        <div class="grid-child">
            <div class="card" onclick="window.open('${url}');" style="cursor: pointer;">
                <div id="image">
                    <img class="align_image" src="${user.getProfilePicture()}" alt="Profile Picture">
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
        };
    }


    render() {
        return new view('matching.html', "Commonflight Matching");
    }


}