/**
 * Admin controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";
import App from '../Classes/app.js';
import AdminBaseController from "./AdminBaseController.js";


export default class Admin_Controller extends AdminBaseController
{
    constructor() {
        super();
    }

    async index() {
        await super.CheckAcces();
    }

    render() {
        return new view('admin/dashboard.html',"Commonflight Admin").extends("admin.html");
    }
}