/**
 * @constructor
 * @author Pepijn dik
 * @namespace Route
 * @param name
 * @param options
 * @param defaultRoute
 */
export default function Route(name, options, defaultRoute) {
    try {
        if (!name || !options) {
            throw 'Error: There must be a routes parameter';
        }
        this.constructor(name, options, defaultRoute);
    } catch (e) {
        console.log("Route error: " + e);
    }
}

Route.prototype = {
    name: undefined,
    controller: undefined,
    method: undefined, view: undefined,
    default: undefined,
    constructor: function (name, options,auth, defaultRoute) {
        const errors = [];
        if (!options.controller) {
            errors.push("*Controller missing for Route" + name);
        }
        if (!options.method) {
            errors.push("*Method missing for Route" + name);
        }
        if (errors.length > 0) {
            alert(`Route is missing one or more properties :\n${errors.join("\n")}`);
            return false;
        }

        this.name = name;
        this.controller = options.controller;
        this.method = options.method;
        this.auth = auth;
        this.default = defaultRoute;

    },
    render() {
        return this.controller.render();
    },
    runScript(){
        return this.controller[this.method]();
    },
    isActiveRoute: function (hashedPath) {
        //hashedPath.replace('/', "").split("?")[0];
        return  hashedPath.replace('/', "").split("?")[0] === this.name;
    }
}