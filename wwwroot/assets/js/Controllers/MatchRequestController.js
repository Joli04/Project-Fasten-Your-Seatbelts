/**
 * Profile controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";
import App from "../Classes/app.js";
import Profile from "../Classes/Profile.js";

export default class MatchRequestController extends Controller
{
    async request() {
        const From_user = new Profile();
        const user = new Profile();
        const query = App.getFromQueryObject();

        await From_user.setProfile(query.from_user);
        await user.setProfile(query.to)


        document.querySelector("#from_user").innerHTML = From_user.getFullName();
    }
    render() {
        return new view('matchRequest.html',"Commonflight Match request");
    }
}