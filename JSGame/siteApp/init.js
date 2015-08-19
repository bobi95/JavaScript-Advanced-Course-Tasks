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
        },
        {
            src: 'siteApp/libs/Templater.raw-v1.0.1.0.js',
            callback: function() {
                console.log('templater.raw loaded!');
            },
            id: 'templater.raw'
        },
        {
            src: 'siteApp/helpers/router.js',
            callback: function() {
                console.log('router loaded!');
            },
            id: 'router'
        },
        {
            src: 'siteApp/helpers/keyboardcapture.js',
            callback: function() {
                console.log('keyboardcapture loaded!');
            },
            id: 'keyboardcapture'
        }
    ];

    function init () {
        console.log('everything loaded!');

        siteApp.Router = new Router();
        siteApp.Router.bindToHash();

        var ctx = document.getElementById('canvas').getContext('2d');
        for (var i=0;i<6;i++){
          for (var j=0;j<6;j++){
            ctx.strokeStyle = 'rgb(0,' + Math.floor(255-42.5*i) + ',' +
                             Math.floor(255-42.5*j) + ')';
            ctx.beginPath();
            ctx.arc(12.5+j*25,12.5+i*25,10,0,Math.PI*2,true);
            ctx.stroke();
          }
        }
    }

    global.siteApp = siteApp;

    FileManager.scripts.loadMany(scripts, init);

})(window);