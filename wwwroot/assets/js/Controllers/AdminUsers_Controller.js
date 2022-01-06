/**
 * Admin controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";
import App from '../Classes/app.js';
import AdminBaseController from "./AdminBaseController.js";
import Admin from "../Classes/Admin.js";

export default class AdminUsers_Controller extends AdminBaseController
{
    constructor() {
        super();
    }

    async index() {
        await super.CheckAcces();
        // const admin = new Admin();
        // await admin.getUsers();
        //
        // for (let i = 0; i < admin.users.length; i++) {
        //     console.log(admin.users[i]);
        // }
    }

    render() {
        return new view('admin/users.html',"CommonFlight | Admin Gebruikers").extends("admin.html");
    }
}