import Profile from "../Classes/Profile.js";

/**
 * Default Controller class
 * to handle all functions of a Controller
 * @author Pepijn dik
 * @namespace Model
 */


export default class Controller{
    constructor(model, view) {
        this.view = view;
        this.model = model;

    }

    async loadTemplate(){
            //Remove Basic layouts
            document.querySelector("body").remove();
            document.querySelector("html").append(document.createElement("body"))

            //Load admin layout
            const url = "layouts/app.html",
                http = new XMLHttpRequest();
            http.onreadystatechange = async function () {
                if (this.readyState === 4 && this.status === 200) {
                    document.querySelector("body").innerHTML = this.response;
                }
            };
            http.open('GET', url, true);
            http.send();

    }
    /**
     * Return a list
     */
    index(){

    }
    render(){
        return null;
    }
}