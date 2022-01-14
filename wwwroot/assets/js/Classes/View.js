/**
 * @author Pepijn dik
 * @namespace View
 * @since 2021-12-10
 */


import App from "./app.js";
import Login_Controller from "../Controllers/Login_Controller.js";
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";

export default function view(path, title, extend) {
    try {
        if (!path) {
            throw 'Error: There must be a path parameter';
        }
        this.constructor(path, title, extend);

    } catch (e) {
        console.log("Route error: " + e);
    }
};

view.prototype = {
    constructor: function (path, title, extend = "app.html") {
        this.view = "./views/" + path;
        this.html = "";
        this.setTitle(title);
        this.extendLayout = "layouts/" + extend;
    },
    setTitle: function (title) {
        document.title = title;
    },
    LoadPageContent: async function () {
        if (App.getSession('Layout') !== this.extendLayout) {
            await this.SetLayout();
        }
        const AppContent = document.querySelector("#app");
        AppContent.innerHTML = '';

        const page = await App.getData(this.view);
        await AppContent.appendChild(page[0]);

        //Fronted Logic
        if (this.extendLayout === "layouts/app.html" || this.extendLayout === "./layouts/blank.html") {
            if (document.querySelector("#nav")) {
                if (!document.querySelector("#nav").hasChildNodes()) {
                    await App.addHeader();
                    if (document.querySelector("#nav") !== null) {
                        var logout_btn = document.querySelector("#nav_logout");
                        logout_btn.addEventListener('click', Login_Controller.logout);

                        FYSCloud.Localization.setTranslations(await App.getTransable());
                        const initialLanguage = FYSCloud.Session.get('lang') !== undefined ? FYSCloud.Session.get('lang') : 'nl';
                        App.translate(initialLanguage);

                        document.querySelector("#languageSwitch").value = initialLanguage;
                        document.querySelector("#languageSwitch").addEventListener("change", function () {
                            App.translate(this.value)
                        });
                        document.querySelector("#mobile_nav").addEventListener("click", function () {
                            var x = document.querySelector(".topnav");
                            if (x.className === "topnav") {
                                x.className += " responsive";
                            } else {
                                x.className = "topnav";
                            }
                        });

                    }
                }
            }
            if (document.querySelector("#footer")) {
                if (!document.querySelector("#footer").hasChildNodes()) {
                    await App.addFooter();
                }
            }
        }
        await App.setActivePage();
    },
    SetLayout: async function () {
        //Reset main
        const main = document.querySelector("#main");
        main.innerHTML = '';
        const Layout = await App.getData(this.extendLayout);
        App.setSession('Layout', this.extendLayout);
        await main.appendChild(Layout[0]);
    },
    extends: function (layout) {
        this.extendLayout = "./layouts/" + layout;
        return this;
    }
}
