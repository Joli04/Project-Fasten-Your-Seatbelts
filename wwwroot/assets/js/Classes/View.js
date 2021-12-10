/**
 * @author Pepijn dik
 * @namespace View
 * @since 2021-12-10
 */

import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";

import App from "./app.js";

export default class View extends App {
    constructor(path) {
        super();
        try {
            if (!path) {
                throw 'Error: There must be a path parameter';
            }

            return this.insertView(path);
        } catch (e) {
            console.log("View error: " + e);
        }
    }

    async insertView(path) {
        const view = new File("views/"+path);
        console.log(view.exists())
        if(view.exists()){
            return "views/"+path;
        }
        return null;
    }
};