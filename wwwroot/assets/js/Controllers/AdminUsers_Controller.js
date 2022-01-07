/**
 * Admin controller
 */
import Controller from './Controller.js';

import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import view from "../Classes/View.js";
import App from '../Classes/app.js';
import AdminBaseController from "./AdminBaseController.js";
import Admin from "../Classes/Admin.js";
import Profile from "../Classes/Profile.js";

export default class AdminUsers_Controller extends AdminBaseController
{
    constructor() {
        super();
    }

    async index() {
        await super.CheckAcces();
        const admin = new Admin();
        await admin.getUsers();

        const userList = document.querySelector(".userList table");
        userList.innerHTML += `
            <tr class="userList__labels">
                <th class="labels__label">Gebruiker</th>
                <th class="labels__label">Email</th>
                <th class="labels__label">Rol</th>
                <th class="labels__label">Acties</th>
            </tr>
        `;
        for (let i = 0; i < admin.users.length; i++) {
            const url = FYSCloud.Utils.createUrl("#/profiel", {
                id: admin.users[i].id,
            });
            const user = new Profile();
            await user.setProfile(admin.users[i]);
            userList.innerHTML += `
                <tr class="userList__user">
                    <th class="user__field user__name">${admin.users[i].first_name + " " + admin.users[i].last_name}</th>
                    <th class="user__field user__email">${admin.users[i].email}</th>
                    <th class="user__field user__role">${admin.users[i].account_type}</th>
                    <th class="user__field user__actions">
                        <div id="profile-delete" class="action actions__profile" onclick="window.open('${url}');">Profiel</div>
                        <div id="profile-delete" class="action actions__delete" onclick="user.destroy()">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </th>
                </tr>
            `;
        }
    }

    render() {
        return new view('admin/users.html',"CommonFlight | Admin Gebruikers").extends("admin.html");
    }
}
