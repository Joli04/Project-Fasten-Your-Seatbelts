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

    async registerProfile() {
        if (this.id === 'undefined') {
            try {
                let data = await FYSCloud.API.queryDatabase("INSERT INTO users (first_name, last_name, password,email,account_type,birthday,qountry_origin_id) VALUES (?,?,?,?,?,?,?);", [this.first_name, this.last_name, this.password, this.email, this.account_type, this.birthday, this.qountry]);
                return data[0]
            } catch (e) {
                return {};
            }
        }
    }

    /**
     *
     * @return {Promise<void>}
     */
    async getQountry() {

    }

    /**
     *
     * @return {Promise<void>}
     */
    async setProfile() {
        const data = await this.getData();
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email;
        this.account_type = data.account_type;
        this.birthday = data.birthday;
        this.profile = data.profile;
    }

    /**
     *
     */
    getProfilePicture() {
        return this.profile;
    }


    updateProfile(){
     return profile;
    }

    setProfilePicture(uplaudEl) {
        FYSCloud.Utils
            .getDataUrl(uplaudEl)
            .then(function (data) {
                FYSCloud.API.uploadFile(
                    "userprofile_" + this.id + ".png", //set name of file to reffence
                    data.url
                ).then(function (data) {
                    //is uplauded
                    this.profile = data.url;

                    console.log(data);
                }).catch(function (reason) {
                    console.log(reason);
                });
                if (data.isImage) {
                    document.querySelector("#imagePreview").src = data.url;
                }
            }).catch(function (reason) {
            console.log(reason);
        });
    }

    async getData() {
        if (this.id > 0) {
            try {
                let data = await FYSCloud.API.queryDatabase("SELECT * FROM users WHERE id = ?", [this.id]);
                return data[0]
            } catch (e) {
                return {};
            }

        }
    }


}