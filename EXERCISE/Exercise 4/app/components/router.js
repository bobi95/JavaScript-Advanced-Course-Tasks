(function(window, document, app) {

    var router = app.router || {};

    var _defaultRoute = '',
        _routes = {},
        _controllerNamespace = {},
        _controllerSuffix = 'Controller';

    function routerInit() {
        window.addEventListener('hashchange', onHashchange.bind(this), false);
    }
    routerInit();

    router.setControllerNamespace = setControllerNamespace;
    function setControllerNamespace (obj) {
        if(obj) {
            _controllerNamespace = obj;
        }

        return router;
    }

    function setControllerSuffix (suffix) {
        _controllerSuffix = suffix;
    }


    router.checkHash = checkHash;
    function checkHash() {
        onHashchange();

        return router;
    }

    function onHashchange () {

        var hash = window.location.hash.substr(1);

        for(var name in _routes) {
            if(_routes[name].url === hash) {

                var route = _routes[name];
                if(!app.data) {
                    app.data = {};
                }

                app.data.viewData = {};
                app.data.tempData = {};

                var controllerConstructor = _controllerNamespace[route.controller + _controllerSuffix];
                var controllerContext = {
                    controller: route.controller,
                    action: route.action
                };

                var controller = new (controllerConstructor)(controllerContext);

                var actionFunc = controller[route.action];
                actionFunc.call(controller);

                return;
            }
        }

        if(_defaultRoute) {
            window.location.hash = '#' + _defaultRoute;
        }
    }

    router.registerRoute = registerRoute;
    function registerRoute (routeObj) {
        var url = routeObj.url,
            controller = routeObj.controller,
            action = routeObj.action,
            name = routeObj.name;

        if(_routes[name]) {
            throw new Error('Route name "' + name + '" already in use.');
        }

        if(url.startsWith('#')) {
            url = url.substr(1);
        }

        _routes[name]  = {
            controller: controller,
            action: action,
            url: url
        };

        return router;
    }

    router.defaultRoute = defaultRoute;
    function defaultRoute (url) {
        if(url && typeof url === 'string') {
            _defaultRoute = url;
        }

        return router;
    }

    app.router = router;

    app.registerModule('app.router');
})(window, document, app);