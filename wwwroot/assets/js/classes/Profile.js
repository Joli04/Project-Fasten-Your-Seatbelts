/**
 * Profile object
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";
import Intressed from "./Intressed.js";

export default class Profile {

    constructor() {
        this.id = FYSCloud.Session.get('user_id');
    }

    /**
     * Setter
     * @param id
     */
    setId(id) {
        this.id = id;
        FYSCloud.Session.set('user_id', this.id);
    }

    getFullName() {
        return this.first_name + " " + this.last_name;
    }

    getMatches() {
        this.matches = [];
    }

    getIntress() {

    }

    async updateProfile(first, last, email, password,birthday, gender,country_origin_id,account_type = 'user'){
        try {
            let data = await FYSCloud.API.queryDatabase("UPDATE users set first_name = ?, last_name = ?, password = ?,email =?,gender=?,account_type=?,birthday = ?,country_origin_id =?", [first, last, password,email,gender,account_type, birthday, country_origin_id]);
            return data[0];
        } catch (e) {
            console.log('Profile : ' +e);
            return {};
        }
    }

    /**
     * Register a new Profile and set this profile data
     * @return {Promise<{}|*>}
     */
    async registerProfile(first, last, email, password,birthday, gender,country_origin_id,account_type = 'user') {
        try {
            let data = await FYSCloud.API.queryDatabase("INSERT INTO users (first_name, last_name, password,email,gender,account_type,birthday,country_origin_id) VALUES (?,?,?,?,?,?,?,?);", [first, last, password,email,gender,account_type, birthday, country_origin_id]);
            let user = await FYSCloud.API.queryDatabase("SELECT id from users where email = ?", [email]);
            this.setId(user[0].id) //Set registerd user
            await this.setProfile(); //Set all profile data
        } catch (e) {
            console.log("Profile error: "+e);
            return {};
        }
    }

    /**
     *
     * @return {Promise<void>}
     */
    getQountry() {
        return this.country;
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
        this.gender = data.gender;
        this.country = data.orgin_country;
    }

    generateAvatar(foregroundColor = "white", backgroundColor = "black") {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = 200;
        canvas.height = 200;

        // Draw background
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw text
        context.font = "bold 100px Assistant";
        context.fillStyle = foregroundColor;
        context.textAlign = "center";
        context.textBaseline = "middle";
        const intials = this.first_name.charAt(0) + this.last_name.charAt(0);
        context.fillText(intials, canvas.width / 2, canvas.height / 2);

        return canvas.toDataURL("image/png");
    }

    getBirthdayDateObject() {
        return new Date(this.birthday);
    }

    /**
     *
     */
    getProfilePicture() {
        if (!!this.profile) {
            return this.profile;
        } else {
            return this.generateAvatar(
                "white",
                "#009578"
            );
        }
    }


    setProfilePicture(uplaudEl, previewEl) {
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
                    previewEl.src = data.url;
                }
            }).catch(function (reason) {
            console.log(reason);
        });
    }

    async getData() {
        if (this.id > 0) {
            try {
                let data = await FYSCloud.API.queryDatabase("SELECT users.id,users.first_name,users.last_name,users.password,users.email,users.account_type,users.profile,users.account_type,users.birthday,countries.names as orgin_country ,users.profile,users.gender,users.bio FROM users INNER JOIN countries ON users.country_origin_id = countries.id where users.id = ?", [this.id]);
                return data[0]
            } catch (e) {
                return {};
            }

        }
    }


}