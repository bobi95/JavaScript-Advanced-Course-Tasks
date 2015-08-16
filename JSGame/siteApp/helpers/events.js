(function eventsInit (global) {

    var siteApp = global.siteApp,
        element = document.getElementById(siteApp.config.eventAnchor || 'wrapper');

    function createEvent (eventName) {
        return new CustomEvent(eventName);
    }

    function listen (eventName, handler) {
        element.addEventListener(eventName, handler, false);
    }

    function trigger (eventName) {
        var e = createEvent(eventName);
        element.dispatchEvent(e);
    }

    var publicApi = {
        listen: listen,
        trigger: trigger
    };

    global.siteApp.events = publicApi;

})(window);