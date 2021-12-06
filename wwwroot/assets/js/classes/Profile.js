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

    /**
     * Update all profile data
     * @param first
     * @param last
     * @param email
     * @param password
     * @param birthday
     * @param gender
     * @param country_origin_id
     * @param account_type
     * @return {Promise<{}|*>}
     */
    async updateProfile(first, last, email, password,birthday, gender,country_origin_id,account_type = 'user'){
        try {
            let data = await FYSCloud.API.queryDatabase("UPDATE users set first_name = ?, last_name = ?, password = ?,email =?,gender=?,account_type=?,birthday = ?,country_origin_id =? where users.id="+this.id, [first, last, password,email,gender,account_type, birthday, country_origin_id]);
            return data[0];
        } catch (e) {
            console.log('Profile : ' +e);
            return {};
        }
    }

    /**
     * Update one specific colum
     * @param colum
     * @param colum_data
     * @return {Promise<{}|*>}
     */
    async update(colum,colum_data){
        try {
            let data = await FYSCloud.API.queryDatabase("UPDATE users set "+colum+" = ? where users.id="+this.id, [colum_data]);
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
                getComputedStyle(document.documentElement).getPropertyValue('--dark_green') // #999999
            );
        }
    }


    async setProfilePicture(uplaudEl, previewEl) {
        try{
            const dataUrl = await FYSCloud.Utils.getDataUrl(uplaudEl);
            const result = await FYSCloud.API.uploadFile( "userprofile_" + this.id + ".png", dataUrl.url, true);
            await this.update('profile',result)
            this.updateProfilePreview(previewEl,result);
        }catch (e){

        }
    }

     updateProfilePreview(previewElement,url) {
        if (url) {
            previewElement.src = url;
            previewElement.style.display = "block";
        } else {
            previewElement.style.display = "none";
        }
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