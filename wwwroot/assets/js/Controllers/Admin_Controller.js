/**
 * Admin controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";
import App from '../Classes/app.js';
import AdminBaseController from "./AdminBaseController.js";
import Profile from "../Classes/Profile.js";
import Admin from "../Classes/Admin.js";

export default class Admin_Controller extends AdminBaseController
{
    constructor() {
        super();
    }

    async index() {
        await super.CheckAcces();

        const user = new Profile();
        const admin = new Admin();

        await admin.getUsers();
        await admin.getMatches();

        await user.setProfile();

        const ctx = document.getElementById('myChart').getContext('2d');
        const First_chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Users', 'Matches'],
                datasets: [{
                    label: 'Amount of',
                    data: [admin.users.length, admin.matches.length],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',

                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        console.log("Loaded")

    }

    render() {
        return  new view('admin/dashboard.html', "CommonFlight | Admin").extends("admin.html");
    }
}