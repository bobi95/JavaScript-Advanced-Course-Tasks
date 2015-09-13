(function eventsInit (GLOBAL, DOC) {

    var element = DOC.createElement('div');

    var docReady = false;

    function createEvent (eventName, detail) {
        return new CustomEvent(eventName, { detail: detail });
    }

    function listen (eventName, handler) {

        if (eventName === 'document:ready' && docReady) {
            handler(createElement(eventName));
            return;
        }

        element.addEventListener(eventName, handler, false);
    }

    function trigger (eventName, detail) {
        var e = createEvent(eventName, detail);

        if (eventName === 'document:ready') {
            if (!docReady) {
                docReady = true;
                element.dispatchEvent(e);
            }
            return;
        }

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