/**
 * Profile controller
 */
import Controller from './Controller.js';
import View from "../Classes/View.js";

export default class Profile_Controller extends Controller
{
     async render() {
        return  new View('profiel.html');
     }
}