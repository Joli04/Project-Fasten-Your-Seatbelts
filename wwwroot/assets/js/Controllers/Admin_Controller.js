/**
 * Admin controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";
import App from '../Classes/app.js';
import AdminBaseController from "./AdminBaseController.js";
import Profile from "../Classes/Profile.js";

export default class Admin_Controller extends AdminBaseController
{
    constructor() {
        super();
    }

    async index() {
        await super.CheckAcces();
        const user = new Profile();
        await user.setProfile();

        const ctx = document.getElementById('myChart').getContext('2d');
        const First_chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
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

    async render() {
        return  new view('admin/dashboard.html', "CommonFlight | Admin").extends("admin.html");
    }
}