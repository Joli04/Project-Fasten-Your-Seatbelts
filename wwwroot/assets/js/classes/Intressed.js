/**
 * Intress object
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import {findObjectByLabel} from "../app.js";

export default class Intressed {
    constructor(el) {
        this.el= el;
    }

    async filter(){
        this.removeAllChildNodes(this.el)
        await this.get()
        await this.create_elements(this.el)
    }
    async get(search= ""){
        try {
            this.intressed= await FYSCloud.API.queryDatabase("SELECT * FROM intressed WHERE name LIKE ?;",['%'+search+'%']);
        } catch (e) {
            return {};
        }
    };
     removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    create_elements(){
        for (const i in this.intressed) {
          const intress = findObjectByLabel(this.intressed[i]);
          const a = document.createElement('a');
          a.classList.add('intress_item');
          a.innerHTML = "  <svg className=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"\n" +
              "                     xmlns=\"http://www.w3.org/2000/svg\">\n" +
              "                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"\n" +
              "                          d=\"M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z\"></path>\n" +
              "                </svg>" +
              "   <p>"+intress.name+"</p>";
          this.el.appendChild(a);
        }
    }
}
