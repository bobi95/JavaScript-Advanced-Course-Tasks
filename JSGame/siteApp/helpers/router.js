(function routerInit (GLOBAL){

    var siteApp = GLOBAL.siteApp || {};

    function Router () {

            // store routes
        var routeMap = {},

            // all routes pushed here for search
            // to be in a specific order
            routeSearchArr = [];

        this.setRoute = function setRoute (options) {

            var routeData = {

                name: options.name,
                url: options.url,
                defaults: {
                    controller: '',
                    action: ''
                },
                callback: options.callback

            };

            if (!routeData.name || routeMap[routeData.name]) {
                return;
            }

            routeMap[routeData.name] = routeData;
            routeSearchArr.push(routeData.name);
        };

        this.unsetRoute = function unsetRoute (name) {
            if (routeMap[name]) {
                routeMap[name] = undefined;
            }
            var index = routeSearchArr.indexOf(name);
            if (index > -1) {
                routeSearchArr.splice(index, 1);
            }
        };

        this.getRoute = function getRoute (name) {
            return routeMap[name];
        };

        this.bindToHash = function bindToHash () {

            GLOBAL.addEventListener('hashchange', function getHash (evnt) {

                var hash = GLOBAL.location.hash;
                matchRoute(hash.substring(1, hash.length));

            }, false);
        };

        function matchRoute (hash) {

            for(var i = 0, j = routeSearchArr.length; i < j; i++) {

                var routeData = routeMap[routeSearchArr[i]];

                if (routeData.url.slice(- hash.length) == hash) {
                    console.log(routeData);

                    // TODO: make router instanciate the controller and call it's action or the callback
                }

            }

        }
    }

    GLOBAL.Router = Router;

})(window);