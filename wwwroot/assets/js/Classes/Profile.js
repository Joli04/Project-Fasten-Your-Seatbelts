/**
 * Profile object
 * @author Pepijn dik
 * @namespace Model
 */
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";

import FileManager from "./FileManager.js";
import App from "./app.js";


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

    isLoggedInUser() {
        if (FYSCloud.Session.get("user_id") === this.id) {
            return true;
        }
        return false;
    }


    async getMatches() {
        this.matches = [];
        try {
            let data = await FYSCloud.API.queryDatabase("SELECT * from user_matches where user_id=? OR requested_id=?", [this.id, this.id]);
            this.matches = data;
        } catch (e) {
            console.log('Matches : ' + e);
            this.matches = {};
        }
    }

    async getCountry() {
        this.countries = [];
        try {
            this.countries = await FYSCloud.API.queryDatabase("SELECT created_at,names,user_countries.id FROM user_countries INNER JOIN countries ON user_countries.countries_id = countries.id where user_countries.user_id=" + this.id);
        } catch (e) {
            console.log('Profile country : ' + e);
            this.countries = {};
        }
    }
    async getCountryNames() {
        await this.getCountry();
        const countryList = [];
        try {
            for (let i = 0; i < this.countries.length; i++) {
                countryList[i] = this.countries[i].names;
            }
            return countryList;
        } catch (e) {
            console.log('Profile country : ' + e);
        }
    }


    async getIntress() {
        this.intressed = [];
        try {
            this.intressed = await FYSCloud.API.queryDatabase("SELECT created_at,name,user_intressed.id FROM user_intressed INNER JOIN intressed ON user_intressed.intressed_id = intressed.id where user_intressed.user_id=" + this.id);
        } catch (e) {
            console.log('Profile : ' + e);
            this.intressed = {};
        }
    }

    async GetIntressCountryString() {
        await this.getCountry();
        const countryList = [];
        for (let i = 0; i < this.countries.length; i++) {
            countryList[i] = this.countries[i].names;
        }
        return countryList.toString();
    }

    async GetIntressString() {
        await this.getIntress();
        const instressList = [];
        for (let i = 0; i < this.intressed.length; i++) {
            instressList[i] = this.intressed[i].name;
        }
        return instressList.toString();
    }

    /**
     * Update all profile_Controller data
     * @param first
     * @param last
     * @param email
     * @param birthday
     * @param gender
     * @param country_origin_id
     * @param bio
     * @param account_type
     * @return {Promise<{}|*>}
     */
    async updateProfile(first, last, email, birthday, gender, country_origin_id, bio, account_type = 'user') {
        try {
            let data = await FYSCloud.API.queryDatabase("UPDATE users set first_name = ?, last_name = ?,email =?,gender=?,account_type=?,birthday = ?,bio = ?,country_origin_id =? where users.id=" + this.id, [first, last, email, gender, account_type, birthday, bio, country_origin_id]);
            return data[0];
        } catch (e) {
            console.log('Profile : ' + e);
            return {};
        }
    }

    async updatePassword(old, newPass, ConfirmPass) {
        try {
            let data = await FYSCloud.API.queryDatabase("UPDATE users set password = ?,  where users.id=" + this.id, [first, last, email, gender, account_type, birthday, bio, country_origin_id]);
            return data[0];
        } catch (e) {
            console.log('Profile : ' + e);
            return {};
        }
    }

    /**
     * Update one specific colum
     * @param colum
     * @param colum_data
     * @return {Promise<{}|*>}
     */
    async update(colum, colum_data) {
        try {
            let data = await FYSCloud.API.queryDatabase("UPDATE users set " + colum + " = ? where users.id=" + this.id, [colum_data]);
            return data[0];
        } catch (e) {
            console.log('Profile : ' + e);
            return {};
        }
    }

    /**
     * Register a new Profile and set this profile_Controller data
     * @return {Promise<{}|*>}
     */
    async registerProfile(first, last, email, password, birthday, gender, country_origin_id) {
        try {
            let data = await FYSCloud.API.queryDatabase("INSERT INTO users (first_name, last_name, password,email,gender,birthday,country_origin_id) VALUES (?,?,?,?,?,?,?);", [first, last, password, email, gender, birthday, country_origin_id]);
            let user = await FYSCloud.API.queryDatabase("SELECT id from users where email = ?", [email]);
            this.setId(user[0].id) //Set registerd user
            await this.setProfile(); //Set all profile_Controller data
        } catch (e) {
            console.log("Profile error: " + e);
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
    async setProfile(id = null) {
        if (id) {
            this.id = id;
        }
        const data = await this.getData();
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email;
        this.account_type = data.account_type;
        this.birthday = data.birthday;
        this.profile = data.profile;
        this.gender = data.gender;
        this.bio = data.bio;
        this.verified_at = data.email_verified_at;
        this.country = data.orgin_country;
        this.country_id = data.country_origin_id;
        this.public = data.public;
        if (this.verified_at === null && App.GetCurrentPage() !== 'verify') {
            await this.sendVerification();
            App.redirect("#/profiel/wizard");
        }
    }

    verify() {
        var time = new Date().getTime();
        this.update('email_verified_at', time);
    }

    getPublic() {
        return this.public;
    }

    async sendVerification() {
        if (this.verified_at === null) {
            const domain = "https://" + window.location.hostname;
            const url = FYSCloud.Utils.createUrl("#/profiel/wizard", {
                id: this.id,
                timestamp: FYSCloud.Utils.toSqlDatetime(new Date())
            });

            try {
                await FYSCloud.API.sendEmail({
                    from: {
                        name: "CommonFlight",
                        address: "group@fys.cloud"
                    },
                    to: [
                        {
                            name: this.getFullName(),
                            address: this.email
                        },
                    ],
                    subject: "Email verification",
                    html: "<!DOCTYPE html>\n" +
                        "<html>\n" +
                        "\n" +
                        "<head>\n" +
                        "    <title></title>\n" +
                        "    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\n" +
                        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
                        "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n" +
                        "    <style type=\"text/css\">\n" +
                        "        @media screen {\n" +
                        "            @font-face {\n" +
                        "                font-family: 'Lato';\n" +
                        "                font-style: normal;\n" +
                        "                font-weight: 400;\n" +
                        "                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');\n" +
                        "            }\n" +
                        "\n" +
                        "            @font-face {\n" +
                        "                font-family: 'Lato';\n" +
                        "                font-style: normal;\n" +
                        "                font-weight: 700;\n" +
                        "                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');\n" +
                        "            }\n" +
                        "\n" +
                        "            @font-face {\n" +
                        "                font-family: 'Lato';\n" +
                        "                font-style: italic;\n" +
                        "                font-weight: 400;\n" +
                        "                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');\n" +
                        "            }\n" +
                        "\n" +
                        "            @font-face {\n" +
                        "                font-family: 'Lato';\n" +
                        "                font-style: italic;\n" +
                        "                font-weight: 700;\n" +
                        "                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');\n" +
                        "            }\n" +
                        "        }\n" +
                        "\n" +
                        "        /* CLIENT-SPECIFIC STYLES */\n" +
                        "        body,\n" +
                        "        table,\n" +
                        "        td,\n" +
                        "        a {\n" +
                        "            -webkit-text-size-adjust: 100%;\n" +
                        "            -ms-text-size-adjust: 100%;\n" +
                        "        }\n" +
                        "\n" +
                        "        table,\n" +
                        "        td {\n" +
                        "            mso-table-lspace: 0pt;\n" +
                        "            mso-table-rspace: 0pt;\n" +
                        "        }\n" +
                        "\n" +
                        "        img {\n" +
                        "            -ms-interpolation-mode: bicubic;\n" +
                        "        }\n" +
                        "\n" +
                        "        /* RESET STYLES */\n" +
                        "        img {\n" +
                        "            border: 0;\n" +
                        "            height: auto;\n" +
                        "            line-height: 100%;\n" +
                        "            outline: none;\n" +
                        "            text-decoration: none;\n" +
                        "        }\n" +
                        "\n" +
                        "        table {\n" +
                        "            border-collapse: collapse !important;\n" +
                        "        }\n" +
                        "\n" +
                        "        body {\n" +
                        "            height: 100% !important;\n" +
                        "            margin: 0 !important;\n" +
                        "            padding: 0 !important;\n" +
                        "            width: 100% !important;\n" +
                        "        }\n" +
                        "\n" +
                        "        /* iOS BLUE LINKS */\n" +
                        "        a[x-apple-data-detectors] {\n" +
                        "            color: inherit !important;\n" +
                        "            text-decoration: none !important;\n" +
                        "            font-size: inherit !important;\n" +
                        "            font-family: inherit !important;\n" +
                        "            font-weight: inherit !important;\n" +
                        "            line-height: inherit !important;\n" +
                        "        }\n" +
                        "\n" +
                        "        /* MOBILE STYLES */\n" +
                        "        @media screen and (max-width:600px) {\n" +
                        "            h1 {\n" +
                        "                font-size: 32px !important;\n" +
                        "                line-height: 32px !important;\n" +
                        "            }\n" +
                        "        }\n" +
                        "\n" +
                        "        /* ANDROID CENTER FIX */\n" +
                        "        div[style*=\"margin: 16px 0;\"] {\n" +
                        "            margin: 0 !important;\n" +
                        "        }\n" +
                        "    </style>\n" +
                        "</head>\n" +
                        "\n" +
                        "<body style=\"background-color: #1e8410; margin: 0 !important; padding: 0 !important;\">\n" +
                        "    <!-- HIDDEN PREHEADER TEXT -->\n" +
                        "    <div style=\"display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;\">We zijn blij om je te zien! verifier nu</div>\n" +
                        "    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n" +
                        "        <!-- LOGO -->\n" +
                        "        <tr>\n" +
                        "            <td bgcolor=\"#1e8410\" align=\"center\">\n" +
                        "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">\n" +
                        "                    <tr>\n" +
                        "                        <td align=\"center\" valign=\"top\" style=\"padding: 40px 10px 40px 10px;\"> </td>\n" +
                        "                    </tr>\n" +
                        "                </table>\n" +
                        "            </td>\n" +
                        "        </tr>\n" +
                        "        <tr>\n" +
                        "            <td bgcolor=\"#1e8410\" align=\"center\" style=\"padding: 0px 10px 0px 10px;\">\n" +
                        "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">\n" +
                        "                    <tr>\n" +
                        "                        <td bgcolor=\"#ffffff\" align=\"center\" valign=\"top\" style=\"padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;\">\n" +
                        "                            <h1 style=\"font-size: 48px; font-weight: 400; margin: 2;\">Welkom!</h1> <img src=\"https://dev-is108-3.fys.cloud/assets/img/corendon-logo.svg\" width=\"125\" height=\"120\" style=\"display: block; border: 0px;\" />\n" +
                        "                        </td>\n" +
                        "                    </tr>\n" +
                        "                </table>\n" +
                        "            </td>\n" +
                        "        </tr>\n" +
                        "        <tr>\n" +
                        "            <td bgcolor=\"#f4f4f4\" align=\"center\" style=\"padding: 0px 10px 0px 10px;\">\n" +
                        "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">\n" +
                        "                    <tr>\n" +
                        "                        <td bgcolor=\"#ffffff\" align=\"left\" style=\"padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;\">\n" +
                        "                            <p style=\"margin: 0;\">Nog even en je kunt aan de slag met je account! verifeer je email hieronder</p>\n" +
                        "                        </td>\n" +
                        "                    </tr>\n" +
                        "                    <tr>\n" +
                        "                        <td bgcolor=\"#ffffff\" align=\"left\">\n" +
                        "                            <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n" +
                        "                                <tr>\n" +
                        "                                    <td bgcolor=\"#ffffff\" align=\"center\" style=\"padding: 20px 30px 60px 30px;\">\n" +
                        "                                        <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n" +
                        "                                            <tr>\n" +
                        "                                                <td align=\"center\" style=\"border-radius: 3px;\" bgcolor=\"#1e8410\"><a href=" + domain + "/" + url + " target=\"_blank\" style=\"font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #1e8410; display: inline-block;\">Confirm Account</a></td>\n" +
                        "                                            </tr>\n" +
                        "                                        </table>\n" +
                        "                                    </td>\n" +
                        "                                </tr>\n" +
                        "                            </table>\n" +
                        "                        </td>\n" +
                        "                    </tr> <!-- COPY -->\n" +
                        "                    <tr>\n" +
                        "                        <td bgcolor=\"#ffffff\" align=\"left\" style=\"padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;\">\n" +
                        "                            <p style=\"margin: 0;\">Wanneer de link niet werkt kopieer en plak deze dan:</p>\n" +
                        "                        </td>\n" +
                        "                    </tr> <!-- COPY -->\n" +
                        "                    <tr>\n" +
                        "                        <td bgcolor=\"#ffffff\" align=\"left\" style=\"padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;\">\n" +
                        "                            <p style=\"margin: 0;\"><a href=" + domain + "/" + url + " target=\"_blank\" style=\"color: #1e8410;\">" + domain + "/" + url + "</a></p>\n" +
                        "                        </td>\n" +
                        "                    </tr>\n" +
                        "                    <tr>\n" +
                        "                        <td bgcolor=\"#ffffff\" align=\"left\" style=\"padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;\">\n" +
                        "                            <p style=\"margin: 0;\">Voor vragen we reageren nooit!</p>\n" +
                        "                        </td>\n" +
                        "                    </tr>\n" +
                        "                    <tr>\n" +
                        "                        <td bgcolor=\"#ffffff\" align=\"left\" style=\"padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;\">\n" +
                        "                            <p style=\"margin: 0;\">Cheers,<br>Team 3</p>\n" +
                        "                        </td>\n" +
                        "                    </tr>\n" +
                        "                </table>\n" +
                        "            </td>\n" +
                        "        </tr>\n" +
                        "        <tr>\n" +
                        "            <td bgcolor=\"#f4f4f4\" align=\"center\" style=\"padding: 30px 10px 0px 10px;\">\n" +
                        "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">\n" +
                        "                    <tr>\n" +
                        "                        <td bgcolor=\"#FFECD1\" align=\"center\" style=\"padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;\">\n" +
                        "                            <h2 style=\"font-size: 20px; font-weight: 400; color: #111111; margin: 0;\">Meer hulp nodig?</h2>\n" +
                        "                            <p style=\"margin: 0;\"><a href=\"#\" target=\"_blank\" style=\"color: #1e8410;\">We&rsquo;zijn er niet om je te helpen</a></p>\n" +
                        "                        </td>\n" +
                        "                    </tr>\n" +
                        "                </table>\n" +
                        "            </td>\n" +
                        "        </tr>\n" +
                        "        <tr>\n" +
                        "            <td bgcolor=\"#f4f4f4\" align=\"center\" style=\"padding: 0px 10px 0px 10px;\">\n" +
                        "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">\n" +
                        "                    <tr>\n" +
                        "                        <td bgcolor=\"#f4f4f4\" align=\"left\" style=\"padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;\"> <br>\n" +
                        "                            <p style=\"margin: 0;\">Wanneer je helemaal gek wordt van onze emails kun je altijd deaboneren <a href=\"#\" target=\"_blank\" style=\"color: #111111; font-weight: 700;\">unsubscribe</a>.</p>\n" +
                        "                        </td>\n" +
                        "                    </tr>\n" +
                        "                </table>\n" +
                        "            </td>\n" +
                        "        </tr>\n" +
                        "    </table>\n" +
                        "</body>\n" +
                        "\n" +
                        "</html>"
                })
            } catch (e) {
                console.log(e)
            }

        }
    }

    async CreateRequest(to) {
        try {
            let data = await FYSCloud.API.queryDatabase("INSERT INTO request (user_id,to_user) VALUES (?,?)", [this.id, to]);
            return data;
        } catch (e) {
            console.log('Profile : ' + e);
            return {};
        }
    }

    async sendRequest(to) {
        const domain = "https://" + window.location.hostname;
        const user = new Profile();
        await user.setProfile(to);

        //Create request
        const Request = await this.CreateRequest(user.id)
        const url = FYSCloud.Utils.createUrl("#/match/request", {
            request: Request.insertId,
            to: user.id,
            timestamp: FYSCloud.Utils.toSqlDatetime(new Date())
        });

        try {
            await FYSCloud.API.sendEmail({
                from: {
                    name: "CommonFlight",
                    address: "group@fys.cloud"
                },
                to: [
                    {
                        name: user.getFullName(),
                        address: user.email
                    },
                ],
                subject: "Match aanvraag",
                html: "<!DOCTYPE html>\n" +
                    "<html>\n" +
                    "\n" +
                    "<head>\n" +
                    "    <title></title>\n" +
                    "    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\n" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
                    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n" +
                    "    <style type=\"text/css\">\n" +
                    "        @media screen {\n" +
                    "            @font-face {\n" +
                    "                font-family: 'Lato';\n" +
                    "                font-style: normal;\n" +
                    "                font-weight: 400;\n" +
                    "                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');\n" +
                    "            }\n" +
                    "\n" +
                    "            @font-face {\n" +
                    "                font-family: 'Lato';\n" +
                    "                font-style: normal;\n" +
                    "                font-weight: 700;\n" +
                    "                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');\n" +
                    "            }\n" +
                    "\n" +
                    "            @font-face {\n" +
                    "                font-family: 'Lato';\n" +
                    "                font-style: italic;\n" +
                    "                font-weight: 400;\n" +
                    "                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');\n" +
                    "            }\n" +
                    "\n" +
                    "            @font-face {\n" +
                    "                font-family: 'Lato';\n" +
                    "                font-style: italic;\n" +
                    "                font-weight: 700;\n" +
                    "                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');\n" +
                    "            }\n" +
                    "        }\n" +
                    "\n" +
                    "        /* CLIENT-SPECIFIC STYLES */\n" +
                    "        body,\n" +
                    "        table,\n" +
                    "        td,\n" +
                    "        a {\n" +
                    "            -webkit-text-size-adjust: 100%;\n" +
                    "            -ms-text-size-adjust: 100%;\n" +
                    "        }\n" +
                    "\n" +
                    "        table,\n" +
                    "        td {\n" +
                    "            mso-table-lspace: 0pt;\n" +
                    "            mso-table-rspace: 0pt;\n" +
                    "        }\n" +
                    "\n" +
                    "        img {\n" +
                    "            -ms-interpolation-mode: bicubic;\n" +
                    "        }\n" +
                    "\n" +
                    "        /* RESET STYLES */\n" +
                    "        img {\n" +
                    "            border: 0;\n" +
                    "            height: auto;\n" +
                    "            line-height: 100%;\n" +
                    "            outline: none;\n" +
                    "            text-decoration: none;\n" +
                    "        }\n" +
                    "\n" +
                    "        table {\n" +
                    "            border-collapse: collapse !important;\n" +
                    "        }\n" +
                    "\n" +
                    "        body {\n" +
                    "            height: 100% !important;\n" +
                    "            margin: 0 !important;\n" +
                    "            padding: 0 !important;\n" +
                    "            width: 100% !important;\n" +
                    "        }\n" +
                    "\n" +
                    "        /* iOS BLUE LINKS */\n" +
                    "        a[x-apple-data-detectors] {\n" +
                    "            color: inherit !important;\n" +
                    "            text-decoration: none !important;\n" +
                    "            font-size: inherit !important;\n" +
                    "            font-family: inherit !important;\n" +
                    "            font-weight: inherit !important;\n" +
                    "            line-height: inherit !important;\n" +
                    "        }\n" +
                    "\n" +
                    "        /* MOBILE STYLES */\n" +
                    "        @media screen and (max-width:600px) {\n" +
                    "            h1 {\n" +
                    "                font-size: 32px !important;\n" +
                    "                line-height: 32px !important;\n" +
                    "            }\n" +
                    "        }\n" +
                    "\n" +
                    "        /* ANDROID CENTER FIX */\n" +
                    "        div[style*=\"margin: 16px 0;\"] {\n" +
                    "            margin: 0 !important;\n" +
                    "        }\n" +
                    "    </style>\n" +
                    "</head>\n" +
                    "\n" +
                    "<body style=\"background-color: #1e8410; margin: 0 !important; padding: 0 !important;\">\n" +
                    "    <!-- HIDDEN PREHEADER TEXT -->\n" +
                    "    <div style=\"display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;\">Er is een match aanvraag, Accepteer deze nu!</div>\n" +
                    "    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n" +
                    "        <!-- LOGO -->\n" +
                    "        <tr>\n" +
                    "            <td bgcolor=\"#1e8410\" align=\"center\">\n" +
                    "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">\n" +
                    "                    <tr>\n" +
                    "                        <td align=\"center\" valign=\"top\" style=\"padding: 40px 10px 40px 10px;\"> </td>\n" +
                    "                    </tr>\n" +
                    "                </table>\n" +
                    "            </td>\n" +
                    "        </tr>\n" +
                    "        <tr>\n" +
                    "            <td bgcolor=\"#1e8410\" align=\"center\" style=\"padding: 0px 10px 0px 10px;\">\n" +
                    "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">\n" +
                    "                    <tr>\n" +
                    "                        <td bgcolor=\"#ffffff\" align=\"center\" valign=\"top\" style=\"padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;\">\n" +
                    "                            <h1 style=\"font-size: 48px; font-weight: 400; margin: 2;\">Match aanvraag</h1> <img src=\"https://is108-3.fys.cloud/assets/img/corendon-logo.svg\" width=\"125\" height=\"120\" style=\"display: block; border: 0px;\" />\n" +
                    "                        </td>\n" +
                    "                    </tr>\n" +
                    "                </table>\n" +
                    "            </td>\n" +
                    "        </tr>\n" +
                    "        <tr>\n" +
                    "            <td bgcolor=\"#f4f4f4\" align=\"center\" style=\"padding: 0px 10px 0px 10px;\">\n" +
                    "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">\n" +
                    "                    <tr>\n" +
                    "                        <td bgcolor=\"#ffffff\" align=\"left\" style=\"padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;\">\n" +
                    "                            <p style=\"margin: 0;\">" + this.getFullName() + " heeft een match aanvraag gedaan aan jou, Accepteer deze nu om contact te maken en eventueel samen op reis te gaan!</p>\n" +
                    "                        </td>\n" +
                    "                    </tr>\n" +
                    "                    <tr>\n" +
                    "                        <td bgcolor=\"#ffffff\" align=\"left\">\n" +
                    "                            <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n" +
                    "                                <tr>\n" +
                    "                                    <td bgcolor=\"#ffffff\" align=\"center\" style=\"padding: 20px 30px 60px 30px;\">\n" +
                    "                                        <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n" +
                    "                                            <tr>\n" +
                    "                                                <td align=\"center\" style=\"border-radius: 3px;\" bgcolor=\"#1e8410\"><a href=" + domain + "/" + url + " target=\"_blank\" style=\"font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #1e8410; display: inline-block;\">Accepteer match</a></td>\n" +
                    "                                            </tr>\n" +
                    "                                        </table>\n" +
                    "                                    </td>\n" +
                    "                                </tr>\n" +
                    "                            </table>\n" +
                    "                        </td>\n" +
                    "                    </tr> <!-- COPY -->\n" +
                    "                    <tr>\n" +
                    "                        <td bgcolor=\"#ffffff\" align=\"left\" style=\"padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;\">\n" +
                    "                            <p style=\"margin: 0;\">Wanneer de link niet werkt kopieer en plak deze dan:</p>\n" +
                    "                        </td>\n" +
                    "                    </tr> <!-- COPY -->\n" +
                    "                    <tr>\n" +
                    "                        <td bgcolor=\"#ffffff\" align=\"left\" style=\"padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;\">\n" +
                    "                            <p style=\"margin: 0;\"><a href=" + domain + "/" + url + " target=\"_blank\" style=\"color: #1e8410;\">" + domain + "/" + url + "</a></p>\n" +
                    "                        </td>\n" +
                    "                    </tr>\n" +
                    "                    <tr>\n" +
                    "                        <td bgcolor=\"#ffffff\" align=\"left\" style=\"padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;\">\n" +
                    "                            <p style=\"margin: 0;\">Voor vragen we reageren nooit!</p>\n" +
                    "                        </td>\n" +
                    "                    </tr>\n" +
                    "                    <tr>\n" +
                    "                        <td bgcolor=\"#ffffff\" align=\"left\" style=\"padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;\">\n" +
                    "                            <p style=\"margin: 0;\">Cheers,<br>Team 3</p>\n" +
                    "                        </td>\n" +
                    "                    </tr>\n" +
                    "                </table>\n" +
                    "            </td>\n" +
                    "        </tr>\n" +
                    "        <tr>\n" +
                    "            <td bgcolor=\"#f4f4f4\" align=\"center\" style=\"padding: 30px 10px 0px 10px;\">\n" +
                    "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">\n" +
                    "                    <tr>\n" +
                    "                        <td bgcolor=\"#FFECD1\" align=\"center\" style=\"padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;\">\n" +
                    "                            <h2 style=\"font-size: 20px; font-weight: 400; color: #111111; margin: 0;\">Meer hulp nodig?</h2>\n" +
                    "                            <p style=\"margin: 0;\"><a href=\"#\" target=\"_blank\" style=\"color: #1e8410;\">We&rsquo;zijn er niet om je te helpen</a></p>\n" +
                    "                        </td>\n" +
                    "                    </tr>\n" +
                    "                </table>\n" +
                    "            </td>\n" +
                    "        </tr>\n" +
                    "        <tr>\n" +
                    "            <td bgcolor=\"#f4f4f4\" align=\"center\" style=\"padding: 0px 10px 0px 10px;\">\n" +
                    "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">\n" +
                    "                    <tr>\n" +
                    "                        <td bgcolor=\"#f4f4f4\" align=\"left\" style=\"padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;\"> <br>\n" +
                    "                            <p style=\"margin: 0;\">Wanneer je helemaal gek wordt van onze emails kun je altijd deaboneren <a href=\"#\" target=\"_blank\" style=\"color: #111111; font-weight: 700;\">unsubscribe</a>.</p>\n" +
                    "                        </td>\n" +
                    "                    </tr>\n" +
                    "                </table>\n" +
                    "            </td>\n" +
                    "        </tr>\n" +
                    "    </table>\n" +
                    "</body>\n" +
                    "\n" +
                    "</html>"
            })
            App.ShowNotifySuccess("Match aanvraag", "Succesvol verzonden");
        } catch (e) {
            App.ShowNotifyError("Matching", "Aanvraag versturen is mislukt")
            console.log(e)
        }
    };

    async destroy() {
        if (this.id > 0) {
            try {
                let data = await FYSCloud.API.queryDatabase("DELETE FROM users WHERE user_id = ?", [this.id]);
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

    getBirtdayStringFormatedLocale(initialLanguage) {
        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }

        var d = new Date(this.birthday)

        if (initialLanguage == null) {
            initialLanguage = FYSCloud.Session.get('lang') !== undefined ? FYSCloud.Session.get('lang') : 'nl';
        }
        if (initialLanguage === "nl") {
            return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-');
        }
        if (initialLanguage === "en") {
            return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
        }
    }

    /**
     * Get profile_Controller picture
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


    /**
     * Set profile_Controller picture
     * @param uplaudEl
     * @param previewEl
     * @return {Promise<void>}
     */
    async setProfilePicture(uplaudEl, previewEl) {
        try {

            const dataUrl = await FYSCloud.Utils.getDataUrl(uplaudEl);
            const bestand = new FileManager(dataUrl);
            if (bestand.isImage()) {
                const result = await FYSCloud.API.uploadFile("userprofile_" + this.id + ".png", dataUrl.url, true);
                await this.update('profile', result)
                this.updateProfilePreview(previewEl, result);
                App.ShowNotifySuccess("Profiel foto", "Succesvol opgeslagen")
            } else {
                App.ShowNotifyError("Profiel foto", "Bestand is geen foto, of extensie wordt niet gesupport");
            }
        } catch (e) {
            App.ShowNotifyError("Foto niet kunnen veranderen", 'Foutje:' + e);
            console.log(e);
        }
    }

    updateProfilePreview(previewElement, url) {
        if (url) {
            previewElement.src = url;
            previewElement.style.display = "block";
        } else {
            previewElement.style.display = "none";
        }
    }

    async getData() {
        try {
            let data = await FYSCloud.API.queryDatabase("SELECT users.public,users.country_origin_id,users.email_verified_at,users.id,users.first_name,users.last_name,users.password,users.email,users.account_type,users.profile,users.account_type,users.birthday,countries.names as orgin_country ,users.profile,users.gender,users.bio FROM users INNER JOIN countries ON users.country_origin_id = countries.id where users.id = ?", [this.id]);
            return data[0]
        } catch (e) {
            console.log(e);
            return {};
        }
    }


}