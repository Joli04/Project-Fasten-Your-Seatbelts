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
            console.log('Users : ' + e);
            this.users = {};
        }
    }
}