import Route from '../Classes/Route.js';
import Router from '../Classes/Router.js';
import Profile_Controller from '../Controllers/Profile_Controller.js';
import Faq_Controller from '../Controllers/Faq_Controller.js';
import Home_Controller from '../Controllers/Home_Controller.js';

/**
 *
 * @type {Route[]}
 * @author Pepijn dik
 * @namespace Router
 */
const routes = [
    new Route('home', {
        controller: new Home_Controller,
        method: 'index'
    },true),
    new Route('profile', {
        controller: new Profile_Controller,
        method: 'show'
    }),
    new Route('faq', {
        controller: new Faq_Controller,
        method: 'index'
    }),
    // new Route('register','registratie.html'),
    // new Route('profile', 'profiel.html'),
    // new Route('profile_Controller/edit', 'profile_edit.html'),
    // new Route('profile_Controller/wizard', 'profile_edit.html')
];

export const web = new Router(routes);

