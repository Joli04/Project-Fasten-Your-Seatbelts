/**
 * Profile controller
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import Controller from './Controller.js';
import view from "../Classes/View.js";
import faq from "../Classes/Faq.js";


export default class Faq_Controller extends Controller {
    async index() {
        const questionsObject = new faq();
        const questions = await questionsObject.getData();

        const lang = FYSCloud.Session.get("lang");
        const container = document.querySelector("#faqContainer");
        container.innerHTML = "";

        for (const topic in questions) {
            if (questions.hasOwnProperty(topic)) {
                addTopics(topic);
            }
        }

        function addTopics(topic) {
            const col = document.createElement("div");
            col.classList.add("col");

            const colContainer = document.createElement("div");
            colContainer.classList.add("container");

            const accordion = document.createElement("div");
            accordion.classList.add("accordion");

            for (const obj in questions[topic]) {
                addQuestion(questions[topic][obj], accordion)
            }

            //Set childs
            colContainer.appendChild(accordion);
            col.appendChild(colContainer);
            container.appendChild(col);
        }

        function addQuestion(question, container) {
            const l = lang;
            const item = document.createElement("div");
            item.classList.add("accordion-item");

            const btn = document.createElement("button");
            btn.setAttribute("aria-expanded", false);

            const title = document.createElement("button");
            title.classList.add("accordion-title");
            title.innerHTML = question.title[lang];

            btn.appendChild(title);

            const data = document.createElement("div");
            const data_tekst = document.createElement("p");
            data.classList.add("accordion-content");

            data_tekst.innerHTML = question.data[lang]
            data.appendChild(data_tekst);

            item.appendChild(btn);
            item.appendChild(data);

            container.appendChild(item);
        }

        const items = document.querySelectorAll('.accordion button');

        function toggleAccordion() {
            const itemToggle = this.getAttribute('aria-expanded');

            let i;
            for (i = 0; i < items.length; i++) {
                items[i].setAttribute('aria-expanded', 'false');
            }

            if (itemToggle === 'false') {
                this.setAttribute('aria-expanded', 'true');
            }
        }

        items.forEach((item) => item.addEventListener('click', toggleAccordion));

    }

    /**
     * Render view
     * @return {view}
     */
    render() {
        return new view('faq.html', "CommonFlight | F.A.Q").extends('app.html');
    }
}









