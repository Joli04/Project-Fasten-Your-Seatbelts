/**
 * Faq object
 * @author Pepijn dik
 * @namespace Faq
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";

export default class faq {
     constructor() {

    }
    async getData() {
        //Get the same accommodations again, but this time from a local JSON-file.
        try {
            return await FYSCloud.Utils.fetchJson("data/faq.json");
        } catch (reason) {
            console.log(reason);
        }
    }

}