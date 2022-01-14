/**
 * Admin object
 * @author Dia Fortmeier
 * @namespace Admin
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";

export default class Admin {
    constructor() {}

    async getUsers() {
        this.users = [];
        try {
            this.users = await FYSCloud.API.queryDatabase("SELECT * from users ORDER BY email_verified_at DESC");
        } catch (e) {
            console.log('Admin Users : ' + e);
            this.users = {};
        }
    }
    async getMatches() {
        this.matches = [];
        try {
            this.matches = await FYSCloud.API.queryDatabase("SELECT * from user_matches where is_match='yes'");
        } catch (e) {
            console.log('admin matches : ' + e);
            this.matches = {};
        }
    }

    async destroy(userId) {
        if (userId > 0) {
            try {
                await FYSCloud.API.queryDatabase("DELETE FROM user_countries WHERE user_id = ?", [userId]);
                await FYSCloud.API.queryDatabase("DELETE FROM user_intressed WHERE user_id = ? OR intressed_id = ?", [userId, userId]);
                await FYSCloud.API.queryDatabase("DELETE FROM user_matches WHERE requested_id = ? OR user_id = ?", [userId, userId]);
                await FYSCloud.API.queryDatabase("DELETE FROM chat WHERE first_user = ? OR second_user = ?", [userId, userId]);
                await FYSCloud.API.queryDatabase("DELETE FROM messages WHERE from_user_id = ? OR to_user_id = ?", [userId, userId]);
                await FYSCloud.API.queryDatabase("DELETE FROM request WHERE user_id = ? OR to_user = ?", [userId, userId]);
                let data = await FYSCloud.API.queryDatabase("DELETE FROM users WHERE id = ?", [userId]);
                this.first_name = null;
                this.last_name = null;
                this.email = null;
                this.account_type = null;
                this.birthday = null;
                this.profile = null;
                this.gender = null;
                this.verified_at = null;
                this.country = null;
                return data[0];

            } catch (e) {
                return {};
            }

        }
    }

}