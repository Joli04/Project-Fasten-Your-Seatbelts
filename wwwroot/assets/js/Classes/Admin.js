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

}