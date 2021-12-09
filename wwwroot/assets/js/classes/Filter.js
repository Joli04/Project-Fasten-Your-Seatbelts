/**
 * Intress object
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import {findObjectByLabel} from "../app.js";

export default class Filter {
    constructor(el, table, select, where,user) {
        this.el = el;
        this.search = "";
        this.selected = [];

        this.query_table = table;
        this.query_where = where;
        this.query_select = select;
        this.user_id = user;
    }

    async filter() {
        await this.removeAllChildNodes(this.el)
        await this.get()

        await this.create_elements(this.el)
    }

    async submit() {
        for (const selection in this.selected) {
            try {
              console.log(this.query_table +" "+this.selected[selection]);
              await FYSCloud.API.queryDatabase("INSERT INTO user_"+this.query_table+" (user_id,"+this.query_table+"_id) VALUES (?,?);",[this.user_id, this.selected[selection]]);
              console.log("Item added to db")
            } catch (e) {
                console.log("Fyscloud Error");
                console.log(e);
                return {};
            }
        }

    }

    async get() {
        try {
            this.selections = await FYSCloud.API.queryDatabase("SELECT * FROM " + this.query_table + " WHERE " + this.query_where + " LIKE ?;", ['%' + this.search + '%']);
        } catch (e) {
            return {};
        }
    };

    removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    create_list() {
        const div = document.createElement('div');
        div.innerHTML = "<div className=\"search\">\n" +
            "            <input type=\"text\" className=\"searchTerm\" placeholder=\"Search for " + this.query_table + "\">\n" +
            "                <button type=\"button\" className=\"searchButton\">\n" +
            "                    <svg className=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"\n" +
            "                         xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "                        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"\n" +
            "                              d=\"M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z\"></path>\n" +
            "                    </svg>\n" +
            "                </button>\n" +
            "        </div>\n" +
            "        <svg viewBox=\"0 0 0 0\" style=\"position: absolute; z-index: -1; opacity: 0;\">\n" +
            "            <defs>\n" +
            "                <linearGradient id=\"boxGradient\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"25\" y2=\"25\">\n" +
            "                    <stop offset=\"0%\" stop-color=\"#27FDC7\"/>\n" +
            "                    <stop offset=\"100%\" stop-color=\"#0FC0F5\"/>\n" +
            "                </linearGradient>\n" +
            "\n" +
            "                <linearGradient id=\"lineGradient\">\n" +
            "                    <stop offset=\"0%\" stop-color=\"#0FC0F5\"/>\n" +
            "                    <stop offset=\"100%\" stop-color=\"#27FDC7\"/>\n" +
            "                </linearGradient>\n" +
            "\n" +
            "                <path id=\"todo__line\" stroke=\"url(#lineGradient)\" d=\"M21 12.3h168v0.1z\"></path>\n" +
            "                <path id=\"todo__box\" stroke=\"url(#boxGradient)\"\n" +
            "                      d=\"M21 12.7v5c0 1.3-1 2.3-2.3 2.3H8.3C7 20 6 19 6 17.7V7.3C6 6 7 5 8.3 5h10.4C20 5 21 6 21 7.3v5.4\"></path>\n" +
            "                <path id=\"todo__check\" stroke=\"url(#boxGradient)\" d=\"M10 13l2 2 5-5\"></path>\n" +
            "                <circle id=\"todo__circle\" cx=\"13.5\" cy=\"12.5\" r=\"10\"></circle>\n" +
            "            </defs>\n" +
            "        </svg>\n" +
            "        <div className=\"todo-list\" id=\"intress\">\n" +
            "\n" +
            "        </div>";
        this.el.append(div);
    }

    create_elements() {
        for (const i in this.selections) {
            const selection = findObjectByLabel(this.selections[i]);
            const label = document.createElement('label');
            label.classList.add('todo');
            label.id = this.selections[i].id;

            var param = selection[this.query_select];
            console.log(param);
            label.innerHTML = " <input class=\"todo__state\" value=" + selection.id + " type=\"checkbox\" />\n" +
                "      \n" +
                "                                  <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 200 25\" class=\"todo__icon\">\n" +
                "                                      <use xlink:href=\"#todo__line\" class=\"todo__line\"></use>\n" +
                "                                     <use xlink:href=\"#todo__box\" class=\"todo__box\"></use>\n" +
                "                                        <use xlink:href=\"#todo__check\" class=\"todo__check\"></use>\n" +
                "                                     <use xlink:href=\"#todo__circle\" class=\"todo__circle\"></use>\n" +
                "                                 </svg>\n" +
                "        \n" +
                "                                    <div class=\"todo__text\">" + param + "</div>";
            this.el.appendChild(label);

            document.getElementById(this.selections[i].id).addEventListener("change", this.select.bind(this, selection.id));
        }
    }

    searchForId(id) {
        if (this.selected.includes(id)) {
            return true;
        } else {
            return false;
        }
    }

    select(id) {
        const key = this.searchForId(id);

        if (!key) {
            this.search = "";
            this.selected.push(id);
        } else {
            this.selected = this.arrayRemove(this.selected, id);
        }
    }

    arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele !== value;
        });
    }

}
