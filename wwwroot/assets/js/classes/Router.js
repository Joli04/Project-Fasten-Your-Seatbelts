function Router(routes){
    try{
        if(!routes){
            throw 'Error: There must be a routes parameter';
        }
        this.constructor(routes);
        this.init();
    }
    catch (e) {
        console.log("Router error: "+e);
    }
}
Router.prototype = {
    routes: undefined,
    rootElement: undefined,
    constructor: function (routes) {
        this.routes = routes;
        this.rootElement = document.getElementById("app");
    },
    init: function (){
        var r = this.routes;
        (function (scope, r){
            window.addEventListener('hashchange', function (e){
               scope.hasChanged(scope,r);
            });
        })(this,r);
        this.hasChanged(this,r);
    },
    hasChanged: function (scope,r){
        this.loopRoutes(scope,r,window.location.hash.length);
    },
    loopRoutes: function (scope,r,hash_length){
        for(let i = 0; i< r.length; i++){
            const route = r[i];
            if(hash_length >0){
                if(route.isActiveRoute(window.location.hash.substring(1))){
                    scope.goToRoute(route.htmlName);
                }
            }else{
                if(route.default){
                    scope.goToRoute(route.htmlName);
                }
            }
        }
    },
    goToRoute: function (htmlName){
        (function (scope){
            const url = 'views/' + htmlName,
                http = new XMLHttpRequest();
            http.onreadystatechange = function (){
               if(this.readyState === 4 && this.status === 200){
                   scope.rootElement.innerHTML = this.responseText;
               }
           };
           http.open('GET', url,true);
           http.send();
        })(this);
    }
}