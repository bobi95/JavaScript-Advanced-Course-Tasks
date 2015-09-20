(function(document, window, app){

    app.Controller = Controller;
    function Controller(context) {

        this.context = {
            controller: '',
            action: ''
        };

        for(var key in this.context) {
            if(context[key]) {
                this.context[key] = context[key];
            }
        }
    }

    Controller.prototype.view = function (model, view) {
        var viewModel = model || {};
        var viewName = view || this.context.action;
        var viewNamespace = this.context.controller;

        var viewFunc = app.views[viewNamespace][viewName](viewModel);
    };

    app.require('app.views.home.index', function(){
        app.registerModule('app.Controller');
    });

})(document, window, app);