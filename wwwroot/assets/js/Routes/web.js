import Route from '../Classes/Route.js';
import Router from '../Classes/Router.js';

import Profile_Controller from '../Controllers/Profile_Controller.js';
import ProfileEdit_Controller from '../Controllers/ProfileEdit_Controller.js';
import Faq_Controller from '../Controllers/Faq_Controller.js';
import Home_Controller from '../Controllers/Home_Controller.js';
import Login_Controller from '../Controllers/Login_Controller.js';
import Register_Controller from '../Controllers/Register_Controller.js';
import Wizard_Controller from "../Controllers/Wizard_Controller.js";
import Matches_Controller from "../Controllers/Matches_Controller.js";

import Admin_Controller from '../Controllers/Admin_Controller.js';
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
    }, false, true),
    new Route('profiel', {
        controller: new Profile_Controller,
        method: 'show',
    }, true),
    new Route('profiel/edit', {
        controller: new ProfileEdit_Controller,
        method: 'edit'
    }, true),
    new Route('faq', {
        controller: new Faq_Controller,
        method: 'index'
    }),
    new Route('login', {
        controller: new Login_Controller,
        method: 'show'
    }),
    new Route('registratie', {
        controller: new Register_Controller,
        method: 'show'
    }),
    new Route('matching', {
        controller: new Matches_Controller,
        method: 'show'
    }),
    new Route('profiel/verify', {
        controller: new Profile_Controller,
        method: 'verify'
    }),
    new Route('profiel/wizard', {
        controller: new Wizard_Controller,
        method: 'show'
    }),
    new Route('admin', {
        controller: new Admin_Controller,
        method: 'index'
    },true),
];

export const web = new Router(routes);

