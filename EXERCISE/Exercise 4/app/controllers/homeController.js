(function(window, document, app) {

    app.require('app.Controller', function() {

        var homeController = (function(_super) {

            Class.extends(_homeController, _super);

            function _homeController(context) {
                _super.call(this, context);

                this.index = function() {
                    this.view();
                };
            }

            return _homeController;

        })(app.Controller);

        app.controllers = app.controllers || {};
        app.controllers.homeController = homeController;

        app.registerModule('app.controllers.homeController');
    });

})(window, document, app);