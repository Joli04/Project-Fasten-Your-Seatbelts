/**
 * Profile controller
 */
import Controller from './Controller.js';
import App from '../Classes/app.js';
import Profile from "../Classes/Profile.js";
import Filter from "../Classes/Filter.js";
import Countries from "../Objects/Countries.js";

const profiel = new Profile();
import view from "../Classes/View.js";


export default class Wizard_Controller extends Controller {
    show() {
        const intressFilter = new Filter(document.querySelector("#interests_table"), "intressed", "name", "name", profiel.id);
        const CountrieFilter = new Filter(document.querySelector("#countries_table"), "countries", "names", "lang_short", profiel.id);


        window.onchange = async function () {
            //Get intress
            await intressFilter.filter();
            await CountrieFilter.filter();
            var quill = new Quill('#editor', {
                theme: 'snow'
            });
            //Document listner for matching
            document.addEventListener("submitWizard", function (e) {
                finishProfile();
                App.redirect('#/matching');
            });
        };
        function finishProfile(){
            intressFilter.submit();
            CountrieFilter.submit();
        }
    }

    render() {
        return new view('profile_wizard.html', "Commonflight Verify account");
    }
}