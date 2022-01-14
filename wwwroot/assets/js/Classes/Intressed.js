/**
 * Intress object
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import App from "./app.js";
/**
 * Intressed db items
 * @author Pepijn dik
 */
export default class Intressed {
    constructor(el) {
        this.el = el;
        this.search = "";
        this.selected = [];
    }

    async filter() {
        await this.removeAllChildNodes(this.el)
        await this.get()
        await this.create_elements(this.el)
    }

    async get() {
        try {
            this.intressed = await FYSCloud.API.queryDatabase("SELECT * FROM intressed WHERE name LIKE ?;", ['%' +  this.search + '%']);
        } catch (e) {
            return {};
        }
    };

    removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    create_elements() {
        for (const i in this.intressed) {
            const intress = App.findObjectByLabel(this.intressed[i]);
            const label = document.createElement('label');
            label.classList.add('todo');
            label.id = "intress_"+this.intressed[i].id;

            label.innerHTML = " <input class=\"todo__state\" value="+intress.id+" type=\"checkbox\" />\n" +
                "      \n" +
                "                                  <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 200 25\" class=\"todo__icon\">\n" +
                "                                      <use xlink:href=\"#todo__line\" class=\"todo__line\"></use>\n" +
                "                                     <use xlink:href=\"#todo__box\" class=\"todo__box\"></use>\n" +
                "                                        <use xlink:href=\"#todo__check\" class=\"todo__check\"></use>\n" +
                "                                     <use xlink:href=\"#todo__circle\" class=\"todo__circle\"></use>\n" +
                "                                 </svg>\n" +
                "        \n" +
                "                                    <div class=\"todo__text\">"+intress.name+"</div>";
            this.el.appendChild(label);

            document.getElementById(this.intressed[i].id).addEventListener("change",this.select.bind(this,intress.id));
        }
    }
    searchForId(id) {
            if(this.selected.includes(id)){
                return true;
            } else {
                return false;
            }
    }
    select(id){
       const key = this.searchForId(id);
       if(!key){
           this.search = "";
           this.selected.push(id);
       } else {
            this.selected = this.arrayRemove(this.selected, id);
       }
    }

    arrayRemove(arr, value) { 
        return arr.filter(function(ele){ 
            return ele !== value;
        });
    }

}
