/**
 * Profile controller
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import Controller from './Controller.js';
import view from "../Classes/View.js";
import Profile from "../Classes/Profile.js";
import App from "../Classes/app.js";
import Countries from "../Objects/Countries.js";
import Notify from "../../../vendors/Notify/notify.js";

export default class ProfileEdit_Controller extends Controller {

    async edit() {

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "./vendors/quill/quill.js";
        document.head.appendChild(script);

        const profiel = new Profile();
        await profiel.setProfile();
        const saveBtn = document.querySelector('#profile_save');
        const fileInput = document.getElementById('uplaud_img');
        const preview = document.getElementById('avatar');
        const d = profiel.getBirtdayStringFormatedLocale("en");
        const bio = document.getElementById("profile__bio");
        bio.innerHTML = profiel.bio;
        var gender = document.querySelector('#profiel_gender');
        await Countries.initCountrieSelector(document.querySelector("#profiel_country"));
        var country = document.querySelector('#countries');
        var name = document.querySelector("#form_profile_name");
        var email = document.querySelector("#form_profile_email");
        var age = document.querySelector('#profiel_age');
        const current_name = document.querySelector("#form_current_name");


        document.getElementById("avatar").src = profiel.getProfilePicture();

        var quill = new Quill('#editor', {
            theme: 'snow'
        });

        current_name.innerHTML = profiel.getFullName();

        name.value = profiel.getFullName();
        age.value = d;
        email.value = profiel.email;
        saveBtn.addEventListener('click', save);
        email.addEventListener('change', ve);
        gender.value = profiel.gender;
        if (country) {
            country.value = profiel.country_id;
        }

        /**
         * Validate email and throw visible error
         */
        function ve() {
            const errors = document.querySelectorAll('.error');
            errors.forEach(e => {
                e.remove();
            });
            if (!App.validateEmail(email.value)) {
                App.addError(this, "Email is niet juist");
                App.ShowNotifyError("Validatie", "Chit, Het lijkt er op dat je email niet correct is")
            }
        }

        /**
         * Save entire profile_Controller
         */
        function save() {
            const names = name.value.split(" ");
            profiel.updateProfile(names[0], names[1], email.value, age.value, gender.value, country.value, quill.container.firstChild.innerHTML);
            App.ShowNotifySuccess("Profiel saved","Yes, jouw profiel is bijgewerkt!")
            App.redirect("/profiel");

        }

        fileInput.onchange = () => {
            uplaud()
        }

        function uplaud() {
            console.log("click")
            profiel.setProfilePicture(fileInput, preview);
        }


    }

    render() {
        return new view('profiel_edit.html', "Commonflight Edit Profiel").extends("blank.html");
    }
}