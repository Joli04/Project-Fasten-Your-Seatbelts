/**
 * Profile controller
 */
import Controller from './Controller.js';
import view from "../Classes/View.js";

export default class Profile_Controller extends Controller
{
     show() {

     }
     render() {
         return  new view('profiel.html', "Commonflight Profiel");
     }
}