/**
 * Profile controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";
import App from "../Classes/app.js";
import Profile from "../Classes/Profile.js";
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
export default class MatchRequestController extends Controller
{
    async request() {
        const From_user = new Profile();
        const user = new Profile();
        const query = App.getFromQueryObject();

        await user.setProfile(query.to)
        if(query.request){
           const Request = await this.getRequest(query.request)
            await From_user.setProfile(Request.user_id)
            const accept = document.querySelector("#accept");
            if (accept) {
                accept.addEventListener('click', this.handleRequest.bind("yes",Request.id,query.to));
            }
            const deny = document.querySelector("#deny");
            if (deny) {
                deny.addEventListener('click', this.handleRequest.bind("no",Request.id,query.to));
            }
            document.querySelector("#from_user").innerHTML = From_user.getFullName();
        }else{
            App.ShowNotifyError("mm matching error", "Er missen belangrijke gevens kopieer de link opnieuw")
        }

    }
    async getRequest(id){
        try {
            let data = await FYSCloud.API.queryDatabase("SELECT * FROM request where id="+id+"");
            return data[0];
        } catch (e) {
            console.log('Request error : ' + e);
            return {};
        }
    }
    async handleRequest(match,requested_id,user_id) {
        console.log("started")
        try {
            await FYSCloud.API.queryDatabase("INSERT INTO user_matches (is_match,requested_id,user_id) VALUES (?,?,?)",[match,requested_id,user_id]);
            App.ShowNotifySuccess("matching", "Je bent Succesvol gematched met: ")
        } catch (e) {
            console.log('Matching : ' + e);
            return {};
        }
    }
    render() {
        return new view('matchRequest.html',"CommonFlight Match request");
    }
}