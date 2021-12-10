(function (){
    function init(){
        var router = new Router([
            new Route('home', 'index.html',true),
            new Route('faq','faq.html')
        ])
    }
    init();
})();