import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import {web} from "../Routes/web.js";


import Login_Controller from "../Controllers/Login_Controller.js";

import Notify from "../../../vendors/Notify/notify.js";


export default class App {
    constructor() {
        this.rootElement = document.getElementById("app");
        web.init();
    }

    initEvents() {
        Login_Controller.Listen();
    }

    async load() {
        App.checkNeedsLogin(App.GetCurrentPage());
        this.initEvents();

        //Init OneSignal for popup messages
        window.OneSignal = window.OneSignal || [];
        var OneSignal = window.OneSignal || [];
        var initConfig = {
            appId: "4e42b8c3-8236-4855-8392-02923f49449f",
            notifyButton: {
                enable: true
            },
        };

        OneSignal.push(function () {
            OneSignal.SERVICE_WORKER_PARAM = {scope: '/vendors/OneSignal/'};
            OneSignal.SERVICE_WORKER_PATH = 'vendors/OneSignal/OneSignalSDKWorker.js'
            OneSignal.SERVICE_WORKER_UPDATER_PATH = 'vendors/OneSignal/OneSignalSDKUpdaterWorker.js'
            OneSignal.init(initConfig);
        });
    }

    static async addHeader() {
        const headerData = await FYSCloud.Utils.fetchAndParseHtml("layouts/_header.html");
        const firstElement = headerData[0];
        var nav = document.querySelector("#nav");
        nav.insertBefore(firstElement, nav.firstElementChild);
    }

    static async addFooter() {
        const footerData = await FYSCloud.Utils.fetchAndParseHtml("layouts/_footer.html");
        const firstElement = footerData[0];
        document.querySelector("#footer").appendChild(firstElement);
        const copyright_year = document.querySelector(".copyright .year");
        copyright_year.innerHTML = new Date().getFullYear();

        const chatButton = document.querySelector(".chatBtn");
        if (Login_Controller.isLoggedIn()) {
            chatButton.style.display = 'block';
        } else {
            chatButton.style.display = 'none';
        }
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
        if (url) {
            if (url.includes("?")) {
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
    static getFromQueryObject() {
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
                        if (other_links[i].id === "admin") {
                            other_links[i].style.display = "none";
                            if (FYSCloud.Session.get('account_type') === "admin") {
                                other_links[i].style.display = "block";
                            }
                        } else {
                            other_links[i].style.display = "block";
                        }
                        this.HandleLinks(false);

                    }
                    if (!Login_Controller.isLoggedIn()) {
                        if (other_links[i].attributes.getNamedItem('needLogin')) {
                            other_links[i].style.display = "none";
                        }
                        this.HandleLinks(true);
                    }
                }
            }
            var nav_page = null;

            const current_page = App.GetCurrentPage();
            if (current_page !== "") {

                if (current_page.includes('/')) {
                    nav_page = document.querySelector(".topnav #" + current_page.replace('/', '_'));

                } else {
                    nav_page = document.querySelector(".topnav #" + current_page);
                }

                if (current_page == "chat") {
                    nav_page = document.querySelector(".topnav #social");
                }

            }

            if (nav_page) {
                nav_page.classList.add("active");
            }
        } else {

        }

    }

    static async getData(url) {
        return await FYSCloud.Utils.fetchAndParseHtml(url);
    }

    static HandleLinks(show) {
        const login = document.querySelector(".topnav #login");
        const register = document.querySelector(".topnav #registratie");
        const heroButton = document.querySelector(".hero__button");
        const hero = document.querySelector(".hero");
        if (show) {
            login.style.display = "block";
            register.style.display = "block";
            if (App.getSession('Layout') === "./layouts/app.html") {
                heroButton.style.display = "flex";
            }
        } else {
            login.style.display = "none";
            register.style.display = "none";
            if (App.getSession('Layout') !== "./layouts/app.html" && App.getSession('Layout') !== "./layouts/admin.html") {
                const link = document.createElement("link");
                link.href = "assets/css/blank.css"
                link.rel = "stylesheet";
                document.head.appendChild(link);
                if (hero) {
                    hero.style.display = 'none';
                }
                if (heroButton) {
                    heroButton.style.display = "none";
                }
            }
        }

    }


    static checkNeedsLogin(endpoint) {

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

    static ShowNotifyError(title, message) {
        new Notify({
            status: 'error',
            title: title,
            text: message,
            effect: 'fade',
            speed: 300,
            customClass: null,
            customIcon: null,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            gap: 20,
            distance: 20,
            type: 1,
            position: 'right top'
        })
    }

    static ShowNotifySuccess(title, message) {
        new Notify({
            status: 'success',
            title: title,
            text: message,
            effect: 'fade',
            speed: 300,
            customClass: null,
            customIcon: null,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            gap: 20,
            distance: 20,
            type: 1,
            position: 'right top'
        })
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

    static setSession(name, value) {
        FYSCloud.Session.set(name, value);
        return name;
    }

    static getSession(name) {
        return FYSCloud.Session.get(name);
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
