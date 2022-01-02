/**
 * One message object
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
export default class Message {
    constructor(user) {
        this.user_id = user.id;
    }
    async list(){
        try {
            return await FYSCloud.API.queryDatabase("SELECT * from messages where from_user_id="+this.user_id)
        } catch (e) {
            return {};
        }
    }

    /**
     * Send new message
     * @return {Promise<void>}
     */
    async send(message,to){
        try {
            return await FYSCloud.API.queryDatabase("INSERT INTO messages(from_user_id,to_user_id,msg) VALUES (?,?,?);",[this.user_id,to,message]);
        } catch (e) {
            console.log(e);
            return {};
        }
    }
}