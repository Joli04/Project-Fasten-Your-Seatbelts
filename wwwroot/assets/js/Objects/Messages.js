/**
 * One message object
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import App from "../Classes/app.js";
export default class Message {
    constructor(user) {
        this.user_id = user.id;
    }
    async list() {
        try {
            return await FYSCloud.API.queryDatabase("SELECT * from messages where from_user_id=" + this.user_id)
        } catch (e) {
            return {};
        }
    }

    /**
     * Send new message
     * @return {Promise<void>}
     */
    async send(chatid, message_text, to_user_id) {
        //message_text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (message_text.length > 0) {
            try {
                return await FYSCloud.API.queryDatabase("INSERT INTO messages(chat_id,from_user_id,to_user_id,msg) VALUES (?,?,?,?);", [chatid, this.user_id, to_user_id, message_text]);
            } catch (e) {
                App.ShowNotifyError("Chat", "Versturen mislukt");
                console.log(e);
                return {};
            }
        } else {
            App.ShowNotifyError("Chat", "Versturen mislukt");
            console.log("Message is empty");
            return {};
        }
    }

    async checkValid(chatid) {
        try {
            let result = await FYSCloud.API.queryDatabase("SELECT * from chat where id=" + chatid + " and first_user=" + this.user_id + " or id=" + chatid + " and second_user=" + this.user_id)
            if (result.length <= 0) {
                return false
            } else {
                return true
            }
        } catch (e) {
            App.ShowNotifyError("Chat", "Ophalen mislukt");
            console.log(e);
            return {};
        }
    }

    async getOther(chatid) {
        try {
            let result = await FYSCloud.API.queryDatabase("SELECT * from chat where id=" + chatid)
            if (result[0].first_user == this.user_id) {
                return (result[0].second_user)
            } else {
                return (result[0].first_user)
            }
        } catch (e) {
            App.ShowNotifyError("Chat", "Ophalen mislukt");
            console.log(e);
            return {};
        }
    }

    async checkNew(userid) {
        try {
            var result = await FYSCloud.API.queryDatabase(`SELECT * FROM chat WHERE first_user=${this.user_id} AND second_user=${userid} OR first_user=${userid} AND second_user=${this.user_id}`);
            if(result.length <= 0){
                await FYSCloud.API.queryDatabase("INSERT INTO chat(first_user,second_user) VALUES (?,?);", [this.user_id, userid]);
                result = await FYSCloud.API.queryDatabase(`SELECT * FROM chat WHERE first_user=${this.user_id} AND second_user=${userid} OR first_user=${userid} AND second_user=${this.user_id}`);
            }
            return result
        } catch (e) {
            App.ShowNotifyError("Chat", "Creëren van chat mislukt");
            console.log(e);
            return false;
        }
    }

    async getAllChats(userid) {
        try {
            return await FYSCloud.API.queryDatabase(`SELECT * FROM chat WHERE first_user=${this.user_id} OR second_user=${this.user_id}`);
        } catch (e) {
            App.ShowNotifyError("Chat", "Ophalen mislukt");
            console.log(e);
            return {};
        }
    }

    async get(chatid) {
        try {
            return await FYSCloud.API.queryDatabase("SELECT * from messages where chat_id=" + chatid + " and from_user_id=" + this.user_id + " or chat_id=" + chatid + " and to_user_id=" + this.user_id)
        } catch (e) {
            App.ShowNotifyError("Chat", "Ophalen mislukt");
            console.log(e);
            return {};
        }
    }

}