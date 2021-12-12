/**
 * @author Pepijn dik
 * @namespace View
 * @since 2021-12-10
 */


export default function view(path, title,script) {
    try {
        if (!path) {
            throw 'Error: There must be a path parameter';
        }
        this.constructor(path, title);

    } catch (e) {
        console.log("Route error: " + e);
    }
};

view.prototype = {
    constructor: function (path, title,script) {
        this.view = "./views/" + path;
        this.html = "";
        this.setTitle(title);
        this.setScript = script;
    },
    setTitle: function (title) {
        document.title = title;
    },

}
