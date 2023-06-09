'use strict';

import Profile from "./Profile.js";
import App from "./app.js";

/**
 *
 * @param routes
 * @constructor
 * @author Pepijn dik
 * @namespace Router
 */
export default function Router(routes) {
    try {
        if (!routes) {
            throw 'Error: There must be a routes parameter';
        }
        this.constructor(routes);
    } catch (e) {
        console.log("Router error: " + e);
    }
}
Router.prototype = {
    routes: undefined,
    active: undefined,
    rootElement: undefined,
    auth: undefined,
    constructor: function (routes) {
        this.routes = routes;
        //Todo use rootElement from extended view;
        this.rootElement = document.getElementById("app");
        const user = new Profile();
        this.auth = user.isLoggedInUser();
    },
    init: function () {
        var r = this.routes;
        (function (scope, r) {
            window.addEventListener('hashchange', function (e) {
                scope.hasChanged(scope, r).then();
            });
        })(this, r);

        this.hasChanged(this, r).then();
    },
    hasChanged: async function (scope, r) {
        await this.loopRoutes(scope, r, window.location.hash.length);
    },
    loopRoutes: async function (scope, r, hash_length) {
        for (let i = 0; i < r.length; i++) {
            const route = r[i];

            if (hash_length > 0) {
                if (route.isActiveRoute(window.location.hash.slice(1) || '/')) {
                    this.active = route.name;
                    scope.goToRoute(route);
                }
            } else {
                if (route.default) {
                    scope.goToRoute(route);
                }
            }
        }
    },

    goToRoute: function (route) {
        (async function (scope) {
            if (route.auth && !scope.auth) {
                return App.redirect('#/login');
            }

            // if (route.name.includes("admin")) {
            //     await route.render().SetLayout();
            //     scope.setRootElement(); //Reset RootElement
            // }
            //set page content
            await route.render().LoadPageContent();

            //Run the controller script
            await route.runScript();
        })(this);
    }
}