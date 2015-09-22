(function(window, document, app) {
    app.templates = app.templates || {};
    app.templates.layout = (function() {
        var newTemplate = new Template();

        newTemplate.processQueue = [
            {
                type:'text',
                value:'<header><div class="banner">Banner here</div><ul><li><a href="#/home">Home</a></li><li><a href="#/login">Login</a></li><li><a href="#/register">Register</a></li><li><a href="#/about">About</a></li></ul></header>'
            },
            {
                type:'echo',
                path:['this', 'bodyHtml']
            }
            ];

        newTemplate.innerTemplates = {};
        newTemplate.functions = {};
        return newTemplate;
    })();
})(window, document, app);