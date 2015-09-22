(function(document, window, app){

    app.Controller = Controller;

    var currentView = null;

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

    Controller.prototype.view = function (model, view, controller) {
        var viewModel = model || {};
        var viewName = view || this.context.action;
        var viewNamespace = controller || this.context.controller;

        if(currentView) {
            currentView.unbindEvents();
        }

        currentView = new app.views[viewNamespace][viewName](viewModel);

        currentView.bindEvents();
    };

})(document, window, app);