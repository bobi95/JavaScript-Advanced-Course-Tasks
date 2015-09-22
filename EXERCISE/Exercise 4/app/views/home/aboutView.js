(function(window, document, app) {

    app.require('app.View', function(){

        app.views = app.views || {};
        app.views.home = app.views.home || {};

        var aboutView = (function(_super){
            Class.extends(_aboutView, _super);

            function _aboutView (model) {

                _super.call(this);

                var indexTemplate = app.templates.home.about;
                this.body = indexTemplate.run(model);
                _aboutView.prototype.render.call(this);
            }

            return _aboutView;
        })(app.View);

        app.views.home.about = aboutView;
    });


})(window, document, app);