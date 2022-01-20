/**
 * Intress object
 * Contains all logic for a signle intress
 * @author Pepijn dik
 */

import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";

export default class Intress {
    constructor() {
        this.intress = [];
    }

    async get() {
        try {
            return await FYSCloud.API.queryDatabase("SELECT * from intressed")
        } catch (e) {
            return {};
        }
    }

    static async initIntressSelector(parent) {

        const SelectorDoc = await FYSCloud.Utils.fetchAndParseHtml("_intress_selector.html");
        const SelectorElement = SelectorDoc[0];
        const Selector = SelectorElement.querySelector("#intresses");
        const i = new Intress();
        const intresses = await i.get();

        for (const intress in intresses) {
            const option = document.createElement('option');
            option.value = intresses[intress].id;
            option.innerHTML = intresses[intress].name;
            Selector.appendChild(option);
        }
        parent.insertBefore(SelectorElement, parent.firstElementChild);
    }
}