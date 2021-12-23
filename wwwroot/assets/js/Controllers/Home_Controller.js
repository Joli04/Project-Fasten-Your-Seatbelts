/**
 * Profile controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";

export default class Home_Controller extends Controller
{
    index() {

    }
    render() {
        return new view('home.html',"Commonflight Home");
    }
}