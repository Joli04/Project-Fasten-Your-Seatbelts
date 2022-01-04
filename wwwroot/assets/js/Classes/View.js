/**
 * @author Pepijn dik
 * @namespace View
 * @since 2021-12-10
 */


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

    SetLayout: function () {
        //Reset main
        const main = document.querySelector("#main");
        main.innerHTML = '';
        // //Set new layout
        const url = "./" + this.extendLayout,
            http = new XMLHttpRequest();
        http.onreadystatechange = async function () {
            if (this.readyState === 4 && this.status === 200) {
                main.innerHTML = this.response;
            }
        }
        http.open('GET', url, true);
        http.send();
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
