/**
 * @author Pepijn dik
 * @namespace View
 * @since 2021-12-10
 */


import App from "./app.js";

export default function view(path, title, extend = "app.html") {
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
        this.domParser = new DOMParser();
        this.extendLayout = "layouts/" + extend;
    },
    setTitle: function (title) {
        document.title = title;
    },
    LoadPageContent: async function () {
        await this.SetLayout();
        const AppContent = document.querySelector("#app");
        AppContent.innerHTML = '';
        const page = await App.getData(this.view);
        await AppContent.appendChild(page[0]);
        await App.addHeader();
        App.setActivePage();
        await App.addFooter();
        // const url = this.view,
        //     http = new XMLHttpRequest();
        // http.onreadystatechange = async function () {
        //     if (this.readyState === 4 && this.status === 200) {
        //         app.innerHTML = this.responseText;
        //     }
        // };
        // http.open('GET', url, true);
        // http.send();
    },
    SetLayout: async function () {
        //Reset main
        const main = document.querySelector("#main");
        main.innerHTML = '';
        // //Set new layout
        // const url = this.extendLayout,
        //     http = new XMLHttpRequest();
        // http.onreadystatechange = async function () {
        //     if (this.readyState === 4 && this.status === 200) {
        //         main.innerHTML = this.response;
        //     }
        // }
        // http.open('GET', url, true);
        // http.send();
        const Layout = await App.getData(this.extendLayout);
       await main.appendChild(Layout[0]);
    },
    extends: function (layout) {
        this.extendLayout = "./layouts/" + layout;
        return this;
    },
    parseHtml: function (html) {
        const htmlDocument = this.domParser.parseFromString(html, "text/html");
        return htmlDocument.body.childNodes;
    }
}
