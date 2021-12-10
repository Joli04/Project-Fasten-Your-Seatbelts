/**
 * Profile controller
 */
import Controller from './Controller.js';
import View from "../Classes/View.js";

export default class Home_Controller extends Controller
{
    index() {
        return new View('home.html');
    }
}