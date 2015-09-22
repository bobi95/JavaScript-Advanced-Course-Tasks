(function(window, document, app) {

    app.View = View;

    function View () {
        this.body = '';
        this.layout = app.templates.layout;
    }

    View.prototype.render = function() {
        var siteHtml = this.layout.run({
            bodyHtml: this.body
        });
        app.config.siteBodyElement.innerHTML = siteHtml;
    };

    View.prototype.bindEvents = function() {
        console.log('binding');
    };

    View.prototype.unbindEvents = function() {
        console.log('unbinding');
    };

})(window, document, app);