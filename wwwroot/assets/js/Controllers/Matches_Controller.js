/**
 * Profile controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";

export default class Matches_Controller extends Controller
{
    index() {

    }
    render() {
        return new view('matching.html',"Commonflight Matching");
    }
}