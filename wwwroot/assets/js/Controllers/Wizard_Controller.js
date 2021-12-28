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
        this.currentTab = 0; // Current tab is set to be the first tab (0)
        const profiel = new Profile();
        await profiel.setProfile();
        
        document.querySelector("#nextBtn")
            .addEventListener("click", this.nextPrev(1));
        document.querySelector("#prevBtn")
            .addEventListener("click", this.nextPrev(-1));
        const intressFilter = new Filter(document.querySelector("#interests_table"), "intressed", "name", "name", profiel.id);
        //const CountrieFilter = new Filter(document.querySelector("#countries_table"), "countries", "names", "lang_short", profiel.id);


        //Get intress
        await intressFilter.filter();
        //await CountrieFilter.filter();

        this.showTab(this.currentTab)
        // var quill = new Quill('#editor', {
        //     theme: 'snow'
        // });
        //Document listner for matching
        // document.addEventListener("submitWizard", function (e) {
        //     finishProfile();
        //     App.redirect('#/matching');
        // });
        //
        //
        // function finishProfile(){
        //     intressFilter.submit();
        //     CountrieFilter.submit();
        // }

    }

    showTab(n) {
        // This function will display the specified tab of the form...
        var x = document.getElementsByClassName("tab");

        x[n].style.display = "block";
        //... and fix the Previous/Next buttons:
        if (n === 0) {
            document.getElementById("prevBtn").style.display = "none";
        } else {
            document.getElementById("prevBtn").style.display = "inline";
        }
        if (n === (x.length - 1)) {
            document.getElementById("nextBtn").innerHTML = "Submit";
        } else {
            document.getElementById("nextBtn").innerHTML = "Next";
        }
        //... and run a function that will display the correct step indicator:
        this.fixStepIndicator(n)
    }

    nextPrev(tab) {

        // This function will figure out which tab to display
        var x = document.getElementsByClassName("tab");
        // Exit the function if any field in the current tab is invalid:
        if (tab === 1 && !this.validateForm()) return false;
        // Hide the current tab:
        x[this.currentTab].style.display = "none";
        // Increase or decrease the current tab by 1:
        this.currentTab = this.currentTab + tab;
        // if you have reached the end of the form...
        if (this.currentTab >= x.length) {
            //Dispatch event to finsih
            return false;
        }
        // Otherwise, display the correct tab:
        this.showTab(this.currentTab);
    }

    validateForm() {
        // This function deals with validation of the form fields
        var x, y, i, valid = true;
        x = document.getElementsByClassName("tab");
        y = x[this.currentTab].getElementsByTagName("input");
        // A loop that checks every input field in the current tab:
        for (i = 0; i < y.length; i++) {
            // If a field is empty...
            if (y[i].value === "") {
                // add an "invalid" class to the field:
                y[i].className += " invalid";
                // and set the current valid status to false
                valid = false;
            }
        }
        // If the valid status is true, mark the step as finished and valid:
        if (valid) {
            document.getElementsByClassName("step")[this.currentTab].className += " finish";
        }
        return valid; // return the valid status
    }

    fixStepIndicator(n) {
        // This function removes the "active" class of all steps...
        var i, x = document.getElementsByClassName("step");
        for (i = 0; i < x.length; i++) {
            x[i].className = x[i].className.replace(" active", "");
        }
        //... and adds the "active" class on the current step:
        x[n].className += " active";
    }

    render() {
        return new view('profile_wizard.html', "Commonflight Verify account");
    }
}