(function(window, document, app) {

    app.require('Templater', function(){

        var template = new Template(' home / about<br>{{serverName}}' );

        app.templates = app.templates || {};
        app.templates.home = app.templates.home || {};
        app.templates.home.about = template;

    });

})(window, document, app);