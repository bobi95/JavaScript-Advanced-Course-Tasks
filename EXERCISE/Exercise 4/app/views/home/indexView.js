(function(window, document, app) {

    app.require('app.View', function(){

        app.views = app.views || {};
        app.views.home = app.views.home || {};

        var indexView = (function(_super){
            Class.extends(_indexView, _super);

            function _indexView (model) {

                _super.call(this);

                var indexTemplate = app.templates.home.index;
                this.body = indexTemplate.run(model);
                _indexView.prototype.render.call(this);
            }

            return _indexView;
        })(app.View);

        app.views.home.index = indexView;

        app.require('app.templates.home.index', function(){
            app.registerModule('app.views.home.index');
        });
    });


})(window, document, app);