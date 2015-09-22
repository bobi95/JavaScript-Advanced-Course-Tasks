(function(window, document, app) {

    app.require('app.scripts', initModules);

    app.require([
                'app.router',
                'app.Controller',
                'app.controllers.homeController'
            ], function(){

        initRoutes();
        app.router.checkHash();
    });

    function initModules() {

        var components = app.config.scripts.components,
            controllers = app.config.scripts.controllers,
            views = app.config.scripts.views,
            newComponents = [];

        newComponents.push(components.router);
        newComponents.push(components.templater);
        newComponents.push(controllers.base);
        newComponents.push(views.base);

        app.scripts.loadMany(newComponents, function() {
            app.registerModule('app.router');
            app.registerModule('Templater');
            app.registerModule('app.Controller');
            app.registerModule('app.View');

            initTemplates();
        });
    }

    function initTemplates() {
        var templates = app.config.scripts.templates,
            newTemplates = [];

        newTemplates.push(templates.layout);
        newTemplates.push(templates.home.index);
        newTemplates.push(templates.home.about);

        app.scripts.loadMany(newTemplates, function() {

            app.registerModule('app.templates.layout');
            app.registerModule('app.templates.home.index');
            app.registerModule('app.templates.home.about');

            initViews();
        });
    }

    function initViews() {

    var views = app.config.scripts.views,
        newViews = [];

        newViews.push(views.home.index);
        newViews.push(views.home.about);

        app.scripts.loadMany(newViews, function(){

            app.registerModule('app.views.home.index');
            app.registerModule('app.views.home.about');

            initControllers();
        });
    }

    function initControllers() {
        var controllers = app.config.scripts.controllers,
            newControllers = [];

        newControllers.push(controllers.home);

        app.scripts.loadMany(newControllers, function(){

            app.registerModule('app.controllers.homeController');

        });
    }

    function initRoutes() {

        app.router
            .defaultRoute('/')
            .setControllerNamespace(app.controllers)
            .registerRoute({
                name: '/',
                url: '/',
                controller: 'home',
                action: 'index'
            })
            .registerRoute({
                name: 'home',
                url: '/home/?',
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