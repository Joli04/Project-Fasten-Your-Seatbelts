/**
 * Intress object
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import {findObjectByLabel} from "../app.js";

export default class Filter {
    constructor(el,table,select,where) {
        this.el = el;
        this.search = "";
        this.selected = [];

        this.query_table = table;
        this.query_where = where;
        this.query_select = select;
    }

    async filter() {
        await this.removeAllChildNodes(this.el)
        await this.get()
        await this.create_elements(this.el)
    }

    async get() {
        try {
            this.selections = await FYSCloud.API.queryDatabase("SELECT * FROM "+this.query_table+" WHERE "+this.query_where+" LIKE ?;", ['%' +  this.search + '%']);
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
        for (const i in this.selections) {
            const selection = findObjectByLabel(this.selections[i]);
            const label = document.createElement('label');
            label.classList.add('todo');
            label.id = this.selections[i].id;

            var param = selection[this.query_select];
            console.log(param);
            label.innerHTML = " <input class=\"todo__state\" value="+selection.id+" type=\"checkbox\" />\n" +
                "      \n" +
                "                                  <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 200 25\" class=\"todo__icon\">\n" +
                "                                      <use xlink:href=\"#todo__line\" class=\"todo__line\"></use>\n" +
                "                                     <use xlink:href=\"#todo__box\" class=\"todo__box\"></use>\n" +
                "                                        <use xlink:href=\"#todo__check\" class=\"todo__check\"></use>\n" +
                "                                     <use xlink:href=\"#todo__circle\" class=\"todo__circle\"></use>\n" +
                "                                 </svg>\n" +
                "        \n" +
                "                                    <div class=\"todo__text\">"+param+"</div>";
            this.el.appendChild(label);

            document.getElementById(this.selections[i].id).addEventListener("change",this.select.bind(this,selection.id));
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
