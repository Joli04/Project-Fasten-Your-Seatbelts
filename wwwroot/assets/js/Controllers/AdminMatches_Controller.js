/**
 * Admin controller
 */

import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import view from "../Classes/View.js";
import AdminBaseController from "./AdminBaseController.js";
import Admin from "../Classes/Admin.js";

export default class AdminMatches_Controller extends AdminBaseController
{
    constructor() {
        super();
    }

    async index() {
        await super.CheckAcces();
        const admin = new Admin();
        await admin.getUsers();
    }

    render() {
        return new view('admin/userMatches.html',"CommonFlight | Admin Gebruiker matches").extends("admin.html");
    }
}
