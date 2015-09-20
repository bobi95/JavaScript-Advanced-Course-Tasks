(function(window, document, app) {

    app.View = View;
    function View () {
        this.body = '';
    }

    View.prototype.render = function() {
        var layout = app.templates.layout;

        var body = this.body;
        layout.functions.renderBody = function() {
            return body;
        };

        var siteHtml = layout.run();
        app.config.siteBodyElement.innerHTML = siteHtml;
    };

    app.registerModule('app.View');

})(window, document, app);