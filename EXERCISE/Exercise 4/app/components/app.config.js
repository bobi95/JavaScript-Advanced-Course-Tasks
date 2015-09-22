var app = app || {};
(function(window, document, app) {

    app.config = {
        siteBodyElement: document.getElementById('siteBody'),
        scripts: {
            components: {
                'router': {
                    src: 'app/components/router.js',
                    name: 'app.router'
                },
                'templater': {
                    src: 'app/components/Templater-v1.0.1.0.js',
                    name: 'Templater'
                },
                'jsSerializer': {
                    src: 'app/components/JSSerializer-v1.0.1.0.js',
                    name: 'JSSerializer'
                },
                'templater.raw': {
                    src: 'app/components/Templater.raw-v1.0.1.0.js',
                    name: 'Templater.raw'
                }
            },
            controllers: {
                base: {
                    src: 'app/controllers/Controller.js',
                    name: 'app.Controller'
                },
                home: {
                    src: 'app/controllers/homeController.js',
                    name: 'app.controllers.homeController'
                }
            },
            templates: {
                layout: {
                    src: 'app/templates/layout.js',
                    name: 'app.templates.layout'
                },
                home: {
                    index: {
                        src: 'app/templates/home/index.js',
                        name: 'app.templates.home.index'
                    },
                    about: {
                        src: 'app/templates/home/about.js',
                        name: 'app.templates.home.about'
                    }
                }
            },
            views: {
                base: {
                    src: 'app/views/View.js',
                    name: 'app.View'
                },
                home: {
                    index: {
                        src: 'app/views/home/indexView.js',
                        name: 'app.views.home.index'
                    },
                    about: {
                        src: 'app/views/home/aboutView.js',
                        name: 'app.views.home.about'
                    }
                }
            }
        }
    };

})(window, document, app);