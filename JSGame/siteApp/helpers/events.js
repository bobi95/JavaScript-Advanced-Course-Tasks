(function eventsInit (GLOBAL, DOC) {

    var element = DOC.createElement('div');

    function createEvent (eventName, detail) {
        return new CustomEvent(eventName, { detail: detail });
    }

    function listen (eventName, handler) {
        element.addEventListener(eventName, handler, false);
    }

    function trigger (eventName, detail) {
        var e = createEvent(eventName, detail);
        element.dispatchEvent(e);
    }

    function mute (eventName, handler) {
        element.removeEventListener(eventNamem, handler, false);
    }

    var publicApi = {
        listen: listen,
        trigger: trigger,
        mute: mute
    };

    GLOBAL.siteApp = GLOBAL.siteApp || {};
    GLOBAL.siteApp.events = publicApi;

})(window, document);