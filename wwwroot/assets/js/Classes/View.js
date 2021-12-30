/**
 * @author Pepijn dik
 * @namespace View
 * @since 2021-12-10
 */


export default function view(path, title,extend = "app.html") {
    try {
        if (!path) {
            throw 'Error: There must be a path parameter';
        }
        this.constructor(path, title,extend);

    } catch (e) {
        console.log("Route error: " + e);
    }
};

view.prototype = {
    constructor: function (path, title,extend = "app.html") {
        this.view = "./views/" + path;
        this.html = "";
        this.setTitle(title);
        this.extendLayout = "layouts/"+extend;
    },
    setTitle: function (title) {
        document.title = title;
    },

}
