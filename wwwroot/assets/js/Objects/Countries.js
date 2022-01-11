import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";

export default class Countries {
    constructor() {
        this.country = [];
    }

    async getCountries() {
        const apiEndpoint = `https://restcountries.com/v2/all `;

        try {
            let response = await fetch(apiEndpoint);
            const data = await response.json();
            data.forEach(element => {
                //create an array to hold all countries
                this.country.push({id: element.alpha3Code, names: element.name, currency: element.currencies});
            });
        } catch (err) {
            console.error(err);
            // Handle errors here
        }
        return this.country;
    }

    async get() {
        try {
            return await FYSCloud.API.queryDatabase("SELECT * from countries")
        } catch (e) {
            return {};
        }
    }

    static async initCountrieSelector(parent) {

        const SelectorDoc = await FYSCloud.Utils.fetchAndParseHtml("_countrie_selector.html");
        const SelectorElement = SelectorDoc[0];
        const Selector = SelectorElement.querySelector("#countries");
        const c = new Countries();
        const countries = await c.get();

        for (const countrie in countries) {
            const option = document.createElement('option');
            option.value = countries[countrie].id;
            option.innerHTML = countries[countrie].names;
            Selector.appendChild(option);
        }
        parent.insertBefore(SelectorElement, parent.firstElementChild);
    }
}