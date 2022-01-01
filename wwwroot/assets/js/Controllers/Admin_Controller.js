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

    }
    render() {

        return new view('dashboard.html',"Commonflight Admin");
    }
}