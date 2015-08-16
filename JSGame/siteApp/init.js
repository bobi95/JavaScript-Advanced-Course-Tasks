(function (global) {

    var siteApp = global.siteApp || {};

    siteApp.config = {
        eventAnchor: 'wrapper',
        root: 'wrapper'
    };

    var scripts = [
        {
            src: 'siteApp/helpers/events.js',
            callback: function() {
                console.log('events loaded!');
            },
            id: 'events'
        },
        {
            src: 'siteApp/libs/JSSerializer-v1.0.1.0.js',
            callback: function() {
                console.log('JSSerializer loaded!');
            },
            id: 'serializer'
        },
        {
            src: 'siteApp/libs/Templater-v1.0.1.0.js',
            callback: function() {
                console.log('templater loaded!');
            },
            id: 'templater'
        }
    ];

    function init () {
        console.log('everything loaded!');
    }

    global.siteApp = siteApp;
    FileManager.scripts.loadMany(scripts, init);
})(window);