'strict use';
function Route(routes){
    try{
        if(!routes){
            throw 'Error: There must be a routes parameter';
        }
        this.constructor(routes);
        this.init();
    }
    catch (e) {
        console.log("Route error: "+e);
    }
}

Route.prototype = {
    name: undefined,
    htmlName: undefined,
    default: undefined,
    constructor: function (name,htmlName, defaultRoute) {
        this.name = name;
        this.htmlName = htmlName;
        this.default = defaultRoute;
    },
    isActiveRoute: function (hasedPath){
        return hasedPath.replace('/',"") === this.name;
    }
}