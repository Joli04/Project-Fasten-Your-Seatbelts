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
    async show() {
        //Add Assets and vendor scripts to head

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "./assets/js/pages/wizard_page.js";
        document.head.appendChild(script);

        const quill_script = document.createElement("script");
        quill_script.type = "text/javascript";
        quill_script.src = "./vendors/quill/quill.js";
        document.head.appendChild(quill_script);

        const profiel = new Profile();
        await profiel.setProfile();

        const intressFilter = new Filter(document.querySelector("#interests_table"), "intressed", "name", "name", profiel.id);
        const CountrieFilter = new Filter(document.querySelector("#countries_table"), "countries", "names", "lang_short", profiel.id);
        //
        // document.querySelector("#nextBtn").addEventListener("click", this.nextPrev(1));
        // document.querySelector("#prevBtn").addEventListener("click", this.nextPrev(-1));
        //Get intress
        await intressFilter.filter();
        await CountrieFilter.filter();


        var quill = new Quill('#editor', {
            theme: 'snow'
        });

        //Document listner for matching
        document.addEventListener("wizard_finished", async function (e) {
            try {
                await finishProfile();
                await profiel.update("bio", quill.container.firstChild.innerHTML);
                App.redirect('#/matching');
                App.ShowNotifySuccess("Wizard", "Interesses succesvol toegevoegd");
            } catch (e) {
                App.ShowNotifyError("Wizard", "Interesses niet toegevoegd");
            }
        });

        /**
         * Save selected data
         */
        function finishProfile(){
            intressFilter.submit();
            CountrieFilter.submit();
        }

    }


    render() {
        return new view('wizard.html', "CommonFlight | Profiel wizard").extends("blank.html");
    }
}