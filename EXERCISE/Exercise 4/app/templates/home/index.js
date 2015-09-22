(function(window, document, app) {

    app.require('Templater', function(){

        var template = new Template(' home / index' );

        app.templates = app.templates || {};
        app.templates.home = app.templates.home || {};
        app.templates.home.index = template;

    });

})(window, document, app);