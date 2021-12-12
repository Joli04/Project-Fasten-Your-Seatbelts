/**
 * Profile controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";

export default class Home_Controller extends Controller
{
    show() {

    }
    render() {
        return new view('registratie.html',"Commonflight Home");
    }
}