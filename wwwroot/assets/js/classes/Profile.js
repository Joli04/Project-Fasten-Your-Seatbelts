/**
 * Profile object
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";

export default class Profile {


    constructor() {
        this.id = FYSCloud.Session.get('user_id');
    }

    getFullName() {
        return this.first_name + " " + this.last_name;
    }

    async setProfile() {
        const data = await this.getData();
        console.log(data);
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email;
        this.account_type = data.account_type;
        this.birthday = data.birthday;
    }

    async getData() {
        if (this.id > 0) {
            let data = await FYSCloud.API.queryDatabase("SELECT * FROM users WHERE id = ?", [this.id]);
            //console.log(data)

            return data[0]
            // await FYSCloud.API.queryDatabase("SELECT * FROM users WHERE id = ?", [this.id]
            // ).then(function (data) {
            //     console.log(data[0]);
            //     return data[0];
            // }).catch(function (reason) {
            //     console.log(reason);
            // });
        }
    }


}