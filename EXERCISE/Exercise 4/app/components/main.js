(function(window, document, app) {

    app.require([
                'app.router',
                'app.Controller',
                'app.controllers.homeController'
            ], function(){

        initRoutes();
        app.router.checkHash();
    });

    function initRoutes() {

        app.router
            .defaultRoute('/')
            .setControllerNamespace(app.controllers)
            .registerRoute({
                name: 'home',
                url: '/',
                controller: 'home',
                action: 'index'
            })
            .registerRoute({
                name: 'about',
                url: '/about',
                controller: 'home',
                action: 'about'
            });
    }

})(window, document, app);