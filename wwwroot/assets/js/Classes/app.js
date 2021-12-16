import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import {web} from "../Routes/web.js";


import Login_Controller from "../Controllers/Login_Controller.js";
import Profile from "./Profile.js";

export default class App {
    constructor() {
        this.rootElement = document.getElementById("app");
        web.init();
    }

    initEvents(){
        Login_Controller.Listen();
    }
    async load() {
        App.checkNeedsLogin(App.GetCurrentPage());

        //Set default translations
        FYSCloud.Localization.setTranslations(await App.getTransable());
        const initialLanguage = FYSCloud.Session.get('lang') !== undefined ? FYSCloud.Session.get('lang') : 'nl';
        App.translate(initialLanguage);

        const headerData = await FYSCloud.Utils.fetchAndParseHtml("layouts/_header.html");
        //Add the header to the page
        if (document.querySelector("#nav") !== null) {
            this.addHeader(headerData);
            var logout_btn = document.querySelector("#nav_logout");
            logout_btn.addEventListener('click', Login_Controller.logout);

            App.setActivePage();
            document.querySelector("#languageSwitch").value = initialLanguage;
            document.querySelector("#languageSwitch").addEventListener("change", function () {
                App.translate(this.value)
            });
            document.querySelector("#mobile_nav").addEventListener("click", function () {
                var x = document.querySelector(".topnav");
                console.log(x);
                if (x.className === "topnav") {
                    x.className += " responsive";
                } else {
                    x.className = "topnav";
                }
            });

        }

        //Add the footer to the page
        const footerData = await FYSCloud.Utils.fetchAndParseHtml("layouts/_footer.html");
        if (document.querySelector("#footer") !== null) {
            this.addFooter(footerData);
        }
        this.initEvents();
    }

    addHeader(data) {
        const firstElement = data[0];
        var nav = document.querySelector("#nav");
        // checkLoggedIn(firstElement);
        // const nav =document.querySelector("#nav");
        // if(nav !== undefined){
        //     nav.appendChild(firstElement);
        // }
        nav.insertBefore(firstElement, nav.firstElementChild);
    }

    addFooter(data) {
        const firstElement = data[0];
        document.querySelector("#footer").appendChild(firstElement);
        const copyright_year = document.querySelector(".copyright .year");
        copyright_year.innerHTML = new Date().getFullYear();
    }

    /**
     *
     * @constructor
     */
    Previous() {
        window.history.back()
    }

    /**
     *
     * @return {string}
     * @constructor
     */
    static GetCurrentPage() {
        //return window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1, window.location.pathname.length);
        var url = window.location.hash.split("#/")[1];
        if(url){
            if(url.includes("?")){
                url = url.split("?")[0];
            }
            return url;
        }
        return "home";
    }
      /**

     * @description Get the querystring as an object
     *
     * @returns {Object} Returns the querystring as an object
     * 
     */
    static getFromQueryString() {
        const [hash, query] = window.location.hash.split('#')[1].split('?')
        const params = Object.fromEntries(new URLSearchParams(query))
        return params;
    }

    static setActivePage() {
        const other_links = document.querySelectorAll(".topnav a");
        if (App.GetCurrentPage() !== "profiel/wizard") {

            for (let i = 0; i < other_links.length; i++) {
                if (other_links[i].classList.contains('icon')) {

                } else {
                    other_links[i].classList.remove("active");
                    if (Login_Controller.isLoggedIn()) {
                        other_links[i].style.display = "block";
                        this.HandleLinks(false);

                    }
                    if(!Login_Controller.isLoggedIn()){
                           if(other_links[i].attributes.getNamedItem('needLogin')){
                               other_links[i].style.display = "none";
                           }
                        this.HandleLinks(true);
                    }
                }

            }
            var nav_page = null;

            const current_page = App.GetCurrentPage();
            if (current_page !== "") {

                if(current_page.includes('/')){
                    nav_page = document.querySelector(".topnav #" + current_page.replace('/', '_'));
                }else{
                    nav_page = document.querySelector(".topnav #" + current_page);
                }


            }

            if (nav_page) {
                nav_page.classList.add("active");
            }

        } else {

        }

    }

    static HandleLinks(show) {
        const login = document.querySelector(".topnav #login");
        const register = document.querySelector(".topnav #registratie");
        const heroButton = document.querySelector(".hero__button");
        if (show) {
            login.style.display = "block";
            register.style.display = "block";
            heroButton.style.display = "flex";
        } else {
            login.style.display = "none";
            register.style.display = "none";
            if (heroButton) {
                heroButton.style.display = "none";
            }

        }

    }


    static checkNeedsLogin(endpoint) {
        //Todo
        //Check if user is on a page that needs login
        //Redirect user to login page with message

        switch (endpoint) {
            case "profiel":
                this.redirectToLogin();
                break;

            case "registratie":
                if (Login_Controller.isLoggedIn()) {
                    this.redirect('#/profiel');
                }
                break;
            case "matching":
                this.redirectToLogin()
                break;
        }
    }

    /**
     * Custom redirect change hash
     *
     * @param endpoint
     */
    static redirect(endpoint) {
        window.location.hash = endpoint;
    }

    static redirectToLogin() {
        if (!Login_Controller.isLoggedIn()) {
            App.redirect("#/login");
        }
    }

    static async getTransable() {
        //Get the same accommodations again, but this time from a local JSON-file.
        try {
            return await FYSCloud.Utils.fetchJson("data/translations.json");
        } catch (reason) {
            console.log(reason);
        }
    }

    static findObjectByLabel(obj, label) {
        if (obj.label === label) {
            return obj;
        }
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                var foundLabel = this.findObjectByLabel(obj[i], label);
                if (foundLabel) {
                    return foundLabel;
                }
            }
        }
        return null;
    };

    static translate(lang_code) {
        FYSCloud.Session.set('lang', lang_code);
        FYSCloud.Localization.switchLanguage(lang_code);
        FYSCloud.Localization.translate();
    }

    static validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    static validatePassword(password) {
        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
        return strongRegex.test(String(password));
    }

    static validate(elements) {
        var isValid = true;
        var errorMsg = "";
        const errors = document.querySelectorAll('.error');
        errors.forEach(e => {
            e.remove();
        });
        elements.forEach(e => {
            if (e.type === "email") {
                if (!this.validateEmail(e.value)) {
                    errorMsg = "Geen geldig email address";
                    this.addError(e, errorMsg);
                    isValid = false;
                }
            }
            if (e.type === "password") {
                if (e.value === "") {
                    errorMsg = "Wachtwoord is een verplicht veld";
                    console.log(e.value, errorMsg);
                    this.addError(e, errorMsg);
                    isValid = false;
                }
                console.log(this.validatePassword(e.value));
                if (!this.validatePassword(e.value)) {
                    errorMsg = "Wachtwoord voldoet niet aan de voorwaardes";
                    console.log(e.value, errorMsg);
                    this.addError(e, errorMsg);
                    isValid = false;
                }
            }
            if (e.type === "date") {
                if (e.value === "") {
                    errorMsg = "Datum is verplicht, selecteer een datum";
                    console.log(e.value, errorMsg);
                    this.addError(e, errorMsg);
                    isValid = false;
                }
            }
            if (e.type === "text") {
                if (!e.value > "") {
                    errorMsg = "Veld heeft geen waarde";
                    console.log(e.value, errorMsg);
                    this.addError(e);
                    isValid = false;
                }
            }
        });
        console.log(isValid);
        return isValid;
    }

    /**
     * Add Custom error block
     * @param element
     * @param errorMsg
     */
    static addError(element, errorMsg = "Dit veld is een verplicht veld") {
        const error = document.createElement("p");
        error.className = "error";
        error.style.display = 'block';
        error.innerText = errorMsg;
        document.querySelector('.errorWrapper').appendChild(error);

        function myFunction(sm, lg) {
            if (lg.matches) {
                document.querySelector('.wrapper__auth').style.padding = '0';
            } else if (sm.matches) {
                document.querySelector('.wrapper__auth').style.padding = '100px 0';
            } else {
                document.querySelector('.wrapper__auth').style.padding = '50px 0';
            }
        }

        let sm = window.matchMedia("(min-width: 576px)");
        let lg = window.matchMedia("(min-width: 992px)");
        myFunction(sm, lg)
    }


}
