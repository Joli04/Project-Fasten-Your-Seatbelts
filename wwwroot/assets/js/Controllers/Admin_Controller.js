/**
 * Admin controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";
import App from '../Classes/app.js';
import AdminBaseController from "./AdminBaseController.js";
import Admin from "../Classes/Admin.js";
import Login_Controller from "./Login_Controller.js";

export default class Admin_Controller extends AdminBaseController
{
    constructor() {
        super();
    }
    async index() {
        document.querySelector('#adminNav_logout').addEventListener('click', function() {
            Login_Controller.logout();
            console.log("click!");
        });
    }

    async show() {
        const admin = new Admin();
    }

    render() {

        return new view('admin/dashboard.html',"Commonflight Admin");
    }
}